Add-Type -AssemblyName System.IO.Compression.FileSystem

# ---- CONFIG ----
$KnowledgeDir = "C:\Users\方向容\Documents\教育方案改进和工程项目\data\knowledge"
$PhysicsDir = "E:\学生课件\高三\物理"
$ChemistryDir = "E:\学生课件\高三\化学"
$ChemistryYilunDir = "$ChemistryDir\一轮清单"
$ProcessedPath = "$KnowledgeDir\processed_files.json"
$PhysicsPath = "$KnowledgeDir\physics.json"
$ChemistryPath = "$KnowledgeDir\chemistry.json"
$MaxFiles = 10

# ---- HELPER: Extract DOCX text ----
function Get-DocxText {
    param([string]$Path)
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
        $entry = $zip.GetEntry("word/document.xml")
        if (-not $entry) { $zip.Dispose(); return $null }
        $reader = New-Object System.IO.StreamReader($entry.Open())
        $xml = $reader.ReadToEnd()
        $reader.Close(); $zip.Dispose()
        $matches = [regex]::Matches($xml, '<w:t[^>]*>([^<]*)</w:t>')
        $texts = foreach ($m in $matches) { $m.Groups[1].Value }
        if ($texts.Count -eq 0) { return $null }
        return ($texts -join ' ') -replace '\s+', ' '
    } catch { return $null }
}

# ---- LOAD STATE ----
$processed = @{ files = @() }
if (Test-Path $ProcessedPath) {
    $processed = Get-Content $ProcessedPath -Raw -Encoding UTF8 | ConvertFrom-Json
}
$physics = $null
if (Test-Path $PhysicsPath) {
    $physics = Get-Content $PhysicsPath -Raw -Encoding UTF8 | ConvertFrom-Json
}
$chemistry = $null
if (Test-Path $ChemistryPath) {
    $chemistry = Get-Content $ChemistryPath -Raw -Encoding UTF8 | ConvertFrom-Json
}

# ---- Scan all source files (flat files only, + 一轮清单解析版) ----
$allFiles = @()
Get-ChildItem $PhysicsDir -File | ForEach-Object {
    $allFiles += @{ Path=$_.FullName; Name=$_.Name; Source="physics" }
}
Get-ChildItem $ChemistryDir -File | ForEach-Object {
    $allFiles += @{ Path=$_.FullName; Name=$_.Name; Source="chemistry" }
}
# Also add 一轮清单 files individually for processing tracking
if (Test-Path $ChemistryYilunDir) {
    Get-ChildItem $ChemistryYilunDir -File -Filter "*（解析版）*" | ForEach-Object {
        $allFiles += @{ Path=$_.FullName; Name=$_.Name; Source="chemistry" }
    }
}

$processedNames = @($processed.files)
$unprocessed = $allFiles | Where-Object { $_.Name -notin $processedNames }
Write-Output "=== 状态 ==="
Write-Output "已处理文件: $($processedNames.Count)"
Write-Output "未处理文件: $($unprocessed.Count)"

# ---- SELECT FILES FOR THIS RUN ----
# Strategy: pick the most text-rich files
# Priority 1: Chemistry 一轮清单 解析版 (has most text)
# Priority 2: Physics DOCX files

$chemLections = Get-ChildItem $ChemistryYilunDir -File -Filter "*（解析版）*" | `
    Sort-Object { [int][regex]::Match($_.Name, '第(\d+)讲').Groups[1].Value }

$toProcess = @()
# Add chemistry 一轮清单 files first
$added = 0
foreach ($f in $chemLections) {
    if ($added -ge $MaxFiles) { break }
    if ($f.Name -notin $processedNames) {
        $toProcess += @{ Path=$f.FullName; Name=$f.Name; Source="chemistry"; Type="yilun" }
        $added++
    }
}
# Add physics files next
$physDocx = Get-ChildItem $PhysicsDir -File -Filter "*.docx" | Sort-Object Length
foreach ($f in $physDocx) {
    if ($added -ge $MaxFiles) { break }
    if ($f.Name -notin $processedNames) {
        $toProcess += @{ Path=$f.FullName; Name=$f.Name; Source="physics"; Type="docx" }
        $added++
    }
}

Write-Output "`n=== 本次处理 ($($toProcess.Count) 个文件) ==="
$toProcess | ForEach-Object { Write-Output "  $($_.Name)" }

# ---- EXTRACT TEXT FROM EACH FILE ----
$extracted = @()
foreach ($f in $toProcess) {
    Write-Output "`n--- 提取: $($f.Name) ---"
    $text = Get-DocxText -Path $f.Path
    if ($text -and $text.Length -gt 20) {
        Write-Output "  成功: $($text.Length) chars"
        $extracted += @{
            name = $f.Name
            path = $f.Path
            source = $f.Source
            text = $text
            type = $f.Type
            lectureNum = if ($f.Name -match '第(\d+)讲') { [int]$Matches[1] } else { 0 }
        }
    } else {
        Write-Output "  跳过: 文本太少或无法提取"
    }
    # Mark as processed regardless
    $processed.files += $f.Name
}

# ---- SAVE PROCESSED FILES ----
$processed | ConvertTo-Json -Depth 3 | Out-File -FilePath $ProcessedPath -Encoding UTF8

# ---- CREATE/UPDARE CHEMISTRY.JSON ----
if ($extracted | Where-Object { $_.source -eq "chemistry" }) {
    $chemEntries = $extracted | Where-Object { $_.source -eq "chemistry" }
    
    # Build chemistry knowledge structure
    $chemistryLectures = @()
    foreach ($entry in $chemEntries) {
        $num = $entry.lectureNum
        $title = ""
        $unit = ""
        
        # Determine the lecture title from the filename
        if ($entry.name -match '第\d+讲\s+(.+?)（解析版）') {
            $title = $Matches[1]
        }
        
        # Assign units
        if ($num -le 4) { $unit = "化学基础知识" }
        elseif ($num -le 6) { $unit = "物质结构基础" }
        elseif ($num -le 13) { $unit = "元素化合物" }
        elseif ($num -le 16) { $unit = "化学实验" }
        elseif ($num -le 19) { $unit = "化学反应与能量" }
        elseif ($num -le 25) { $unit = "化学反应原理" }
        elseif ($num -le 29) { $unit = "有机化学" }
        
        # For this run, create a simple text dump of the knowledge
        Write-Output "`n[化学-第${num}讲] $title"
        Write-Output "  提取文本: $($entry.text.Length) 字符"
    }
}

# ---- SHOW SUMMARY ----
Write-Output "`n`n================ 处理摘要 ================"
Write-Output "本次检查文件数: $($allFiles.Count)"
Write-Output "新处理文件数: $($toProcess.Count)"
if ($toProcess.Count -gt 0) {
    Write-Output "已处理/跳过文件数: $($processed.files.Count)"
    Write-Output "成功提取内容: $($extracted.Count) 个"
    Write-Output "  其中化学: $(@($extracted | Where-Object { $_.source -eq "chemistry" }).Count) 个"
    Write-Output "  其中物理: $(@($extracted | Where-Object { $_.source -eq "physics" }).Count) 个"
    Write-Output "`n提取内容预览:"
    foreach ($e in $extracted) {
        Write-Output "  [$($e.source)] $($e.name) - $($e.text.Length) chars"
        $preview = $e.text.Substring(0, [Math]::Min(150, $e.text.Length))
        Write-Output "    预览: $preview..."
        Write-Output ""
    }
}
Write-Output "=========================================="
