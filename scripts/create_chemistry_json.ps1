Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-DocxText {
    param([string]$Path)
    $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
    $entry = $zip.GetEntry("word/document.xml")
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $xml = $reader.ReadToEnd()
    $reader.Close(); $zip.Dispose()
    $matches = [regex]::Matches($xml, '<w:t[^>]*>([^<]*)</w:t>')
    $texts = foreach ($m in $matches) { $m.Groups[1].Value }
    return ($texts -join '') -replace '\s+', ' ' -replace '◆|■|●|▲|△|★|☆|（|）', ' '
}

$baseDir = "E:\学生课件\高三\化学\一轮清单"
$KnowledgeDir = "C:\Users\方向容\Documents\教育方案改进和工程项目\data\knowledge"
$ChemistryPath = "$KnowledgeDir\chemistry.json"

# Get chemistry 一轮清单 解析版 files sorted by lecture number
$allFiles = Get-ChildItem $baseDir -Filter "*（解析版）*" | Where-Object { $_.Name -match '第(\d+)讲' }
$sorted = $allFiles | Sort-Object { [int][regex]::Match($_.Name, '第(\d+)讲').Groups[1].Value }

# Helper: parse text into sections
function Parse-LectureText {
    param([string]$Text, [int]$LectureNum)
    
    $result = @{
        title = ""
        kaodians = @()
    }
    
    # Extract lecture title (usually after "第X讲")
    if ($Text -match '第\d+讲\s+(.+?)(?:复习导航|学习导航|核心知识)') {
        $result.title = $Matches[1].Trim()
    }
    if (-not $result.title) {
        $result.title = "第${LectureNum}讲"
    }
    
    # Split text by 考点 markers
    $parts = $Text -split '(?=考点\d+)'
    $kaodianIndex = 1
    $sectionIndex = 1
    
    foreach ($part in $parts) {
        if ($part -match '考点(\d+)\s*(.+?)(?=知识点|真题|$|考点\d+)') {
            $kaoTitle = $Matches[2].Trim()
            if ($kaoTitle.Length -gt 50) { $kaoTitle = $kaoTitle.Substring(0, 50) + "..." }
            
            # Extract knowledge points
            $knowledgeParts = $part -split '(?=知识点\d+)'
            $sections = @()
            $innerSectionIndex = 1
            
            foreach ($kp in $knowledgeParts) {
                if ($kp -match '知识点(\d+)\s*(.+?)(?=知识点|真题|$)') {
                    $knowTitle = $Matches[2].Trim().Substring(0, [Math]::Min(40, $Matches[2].Trim().Length))
                    if ($Matches[2].Trim().Length -gt 40) { $knowTitle += "..." }
                    
                    # Extract lines of text
                    $lines = @()
                    $content = $kp -replace '知识点\d+\s*', '' -replace '\s+', ' '
                    $content = $content.Trim()
                    if ($content.Length -gt 10) {
                        $sentences = $content -split '(?<=[。；])\s*'
                        foreach ($s in $sentences) {
                            $s = $s.Trim()
                            if ($s.Length -gt 20) {
                                $lines += $s
                            }
                        }
                    }
                    
                    if ($lines.Count -gt 0) {
                        $sections += @{
                            type = "zhishi"
                            title = "知识点$innerSectionIndex $($knowTitle)"
                            lines = $lines[0..[Math]::Min($lines.Count-1, 5)]
                        }
                        $innerSectionIndex++
                    }
                }
            }
            
            # Add tips/notes section
            if ($part -match '(?:特别提醒|方法技巧|规律总结|易错|[误正])') {
                $sections += @{
                    type = "special"
                    tag = "名师点拨"
                    lines = @("注意区分易混淆概念，掌握解题技巧和方法规律。")
                }
            }
            
            $result.kaodians += @{
                title = "考点$kaodianIndex $kaoTitle"
                difficulty = [Math]::Min(5, [Math]::Max(1, 3))
                sections = $sections
            }
            $kaodianIndex++
        }
    }
    
    if ($result.kaodians.Count -eq 0) {
        # Fallback: create a generic kaodian
        $result.kaodians += @{
            title = "考点一 $($result.title)基础知识"
            difficulty = 3
            sections = @(
                @{
                    type = "zhishi"
                    title = "知识点一 核心内容"
                    lines = @($Text.Substring(0, [Math]::Min(200, $Text.Length)))
                }
            )
        }
    }
    
    return $result
}

Write-Output "=== 创建 chemistry.json ==="

$lectures = @()

# Define lecture mapping: 一轮清单讲次 → 专题ID + unit
$lectureConfig = @{
    1 = @{ topic = "专题01"; unit = "化学基础知识" }
    2 = @{ topic = "专题02"; unit = "化学基础知识" }
    3 = @{ topic = "专题03"; unit = "化学基础知识" }
    4 = @{ topic = "专题04"; unit = "化学基础知识" }
    5 = @{ topic = "专题05"; unit = "物质结构基础" }
    6 = @{ topic = "专题06"; unit = "物质结构基础" }
    7 = @{ topic = "专题07"; unit = "元素化合物" }
    8 = @{ topic = "专题08"; unit = "元素化合物" }
    9 = @{ topic = "专题09"; unit = "元素化合物" }
    10 = @{ topic = "专题10"; unit = "元素化合物" }
}

foreach ($f in $sorted) {
    $num = [int][regex]::Match($f.Name, '第(\d+)讲').Groups[1].Value
    if ($num -gt 10) { continue }  # Process only first 10 lectures
    
    $text = Get-DocxText -Path $f.FullName
    if (-not $text -or $text.Length -lt 50) { continue }
    
    $parsed = Parse-LectureText -Text $text -LectureNum $num
    $config = $lectureConfig[$num]
    
    $lectures += @{
        id = $config.topic
        title = $parsed.title
        unit = $config.unit
        kaodians = $parsed.kaodians
    }
    
    Write-Output "  已处理: $($config.topic) $($parsed.title)"
    Write-Output "    考点数: $($parsed.kaodians.Count)"
}

$chemistry = @{
    subject = "化学"
    lectures = $lectures
}

$json = $chemistry | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($ChemistryPath, $json, [System.Text.Encoding]::UTF8)

Write-Output "`n=== 完成 ==="
Write-Output "chemistry.json 已保存: $ChemistryPath"
Write-Output "共 $($lectures.Count) 个专题"
Write-Output "总大小: $( $json.Length ) 字符"
