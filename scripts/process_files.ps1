param(
    [int]$MaxFiles = 10,
    [string]$KnowledgeDir = "C:\Users\方向容\Documents\教育方案改进和工程项目\data\knowledge",
    [string]$PhysicsDir = "E:\学生课件\高三\物理",
    [string]$ChemistryDir = "E:\学生课件\高三\化学"
)

# Import .NET ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem

# --- Helper: Extract text from DOCX ---
function Extract-DocxText {
    param([string]$Path)
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
        $entry = $zip.GetEntry("word/document.xml")
        if ($entry) {
            $reader = New-Object System.IO.StreamReader($entry.Open())
            $xml = $reader.ReadToEnd()
            $reader.Close()
            $zip.Dispose()
            # Strip XML tags to get text
            $text = $xml -replace '<[^>]+>', ' '
            $text = $text -replace '\s+', ' '
            return $text.Trim()
        }
        $zip.Dispose()
        return $null
    } catch {
        Write-Warning "Failed to extract DOCX: $Path - $_"
        return $null
    }
}

# --- Helper: Extract text from PDF (basic approach) ---
function Extract-PdfText {
    param([string]$Path, [int]$MaxBytes = 5000000)
    try {
        $bytes = [System.IO.File]::ReadAllBytes($Path)
        if ($bytes.Length -gt $MaxBytes) {
            Write-Warning "PDF too large to read entirely: $($bytes.Length) bytes"
            # Read only first part
            $bytes = $bytes[0..[Math]::Min($bytes.Length, $MaxBytes)]
        }
        $text = [System.Text.Encoding]::UTF8.GetString($bytes)
        # Extract text between parentheses in PDF operators Tj/TJ/'
        $matches = [regex]::Matches($text, '\(([^)]*)\)\s*Tj')
        $result = @()
        foreach ($m in $matches) {
            $result += $m.Groups[1].Value
        }
        # Also try TJ arrays
        $matches2 = [regex]::Matches($text, '\[([^\]]*)\]\s*TJ')
        foreach ($m in $matches2) {
            $partMatches = [regex]::Matches($m.Groups[1].Value, '\(([^)]*)\)')
            $parts = @()
            foreach ($pm in $partMatches) {
                $parts += $pm.Groups[1].Value
            }
            $result += ($parts -join '')
        }
        $fullText = $result -join ' '
        # Also extract Unicode-escaped text
        $fullText = $fullText -replace '\\[0-9A-Fa-f]{3}', ''
        if ($fullText.Trim().Length -gt 50) {
            return $fullText.Trim()
        }
        return $null
    } catch {
        Write-Warning "Failed to extract PDF: $Path - $_"
        return $null
    }
}

# --- Load existing knowledge ---
function Load-Knowledge {
    param([string]$Path)
    if (Test-Path $Path) {
        $json = Get-Content $Path -Raw -Encoding UTF8
        return ($json | ConvertFrom-Json)
    }
    return $null
}

function Save-Knowledge {
    param([object]$Data, [string]$Path)
    $json = $Data | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($Path, $json, [System.Text.Encoding]::UTF8)
}

function Load-Processed {
    param([string]$Path)
    if (Test-Path $Path) {
        $json = Get-Content $Path -Raw -Encoding UTF8
        return ($json | ConvertFrom-Json)
    }
    return @{ files = @() }
}

function Save-Processed {
    param([object]$Data, [string]$Path)
    $json = $Data | ConvertTo-Json -Depth 3
    [System.IO.File]::WriteAllText($Path, $json, [System.Text.Encoding]::UTF8)
}

# --- Main ---
$processedPath = Join-Path $KnowledgeDir "processed_files.json"
$physicsPath = Join-Path $KnowledgeDir "physics.json"
$chemistryPath = Join-Path $KnowledgeDir "chemistry.json"

$processed = Load-Processed -Path $processedPath
$physics = Load-Knowledge -Path $physicsPath
$chemistry = Load-Knowledge -Path $chemistryPath

Write-Output "=== 知识笔记状态 ==="
Write-Output "物理笔记: $(if ($physics) { "$($physics.lectures.Count) 个专题" } else { '不存在' })"
Write-Output "化学笔记: $(if ($chemistry) { "$($chemistry.lectures.Count) 个专题" } else { '不存在' })"
Write-Output "已处理文件: $($processed.files.Count) 个"

# --- Scan source files ---
$allFiles = @()
Get-ChildItem -Path $PhysicsDir -File | ForEach-Object {
    $allFiles += @{
        Path = $_.FullName
        Name = $_.Name
        Length = $_.Length
        Source = "physics"
        Ext = $_.Extension.ToLower()
    }
}
Get-ChildItem -Path $ChemistryDir -File | ForEach-Object {
    $allFiles += @{
        Path = $_.FullName
        Name = $_.Name
        Length = $_.Length
        Source = "chemistry"
        Ext = $_.Extension.ToLower()
    }
}

Write-Output "`n=== 扫描文件 ==="
Write-Output "物理目录: $(@(Get-ChildItem $PhysicsDir -File).Count) 个文件"
Write-Output "化学目录: $(@(Get-ChildItem $ChemistryDir -File).Count) 个文件"
Write-Output "总计: $($allFiles.Count) 个文件"

# --- Filter unprocessed files ---
$processedNames = $processed.files | ForEach-Object { $_ }
$unprocessed = $allFiles | Where-Object { $_.Name -notin $processedNames }
Write-Output "未处理: $($unprocessed.Count) 个文件 (本次最多处理 $MaxFiles 个)"

# --- Sort by size (small files first) ---
$toProcess = $unprocessed | Sort-Object Length | Select-Object -First $MaxFiles

Write-Output "`n=== 本次待处理文件 ==="
$toProcess | ForEach-Object { Write-Output "  $($_.Name) ($($_.Length) bytes)" }

$newEntries = @()
$errors = @()

foreach ($file in $toProcess) {
    Write-Output "`n--- 处理: $($file.Name) ---"
    $text = $null
    if ($file.Ext -eq '.docx') {
        $text = Extract-DocxText -Path $file.Path
        if ($text) {
            Write-Output "  成功提取 $(($text.Length/1000).ToString('F1'))KB 文本"
        } else {
            $errors += "DOCX提取失败: $($file.Name)"
            Write-Warning "  无法提取内容"
        }
    } elseif ($file.Ext -eq '.pdf') {
        if ($file.Length -gt 50000000) {
            $errors += "PDF过大跳过: $($file.Name) ($($file.Length/1MB) MB)"
            Write-Warning "  PDF过大 (大于50MB)，跳过提取"
        } else {
            $text = Extract-PdfText -Path $file.Path
            if ($text) {
                Write-Output "  成功提取 $(($text.Length/1000).ToString('F1'))KB 文本"
            } else {
                $errors += "PDF提取失败(可能为扫描件): $($file.Name)"
                Write-Warning "  无法提取文本内容"
            }
        }
    } else {
        $errors += "不支持的文件格式: $($file.Name)"
        Write-Warning "  不支持的文件格式: $($file.Ext)"
    }

    if ($text) {
        $newEntries += @{
            file = $file
            text = $text
            Length = $text.Length
        }
    }

    # Mark as processed
    $processed.files += $file.Name
}

Save-Processed -Data $processed -Path $processedPath

Write-Output "`n===[处理摘要]==="
Write-Output "本次检查文件数: $($allFiles.Count)"
Write-Output "新处理文件数: $($toProcess.Count)"
Write-Output "已处理/跳过文件数: $($processed.files.Count)"
Write-Output "成功提取内容: $($newEntries.Count) 个"
Write-Output "错误/异常: $($errors.Count) 个"
if ($errors.Count -gt 0) {
    Write-Output "错误详情:"
    $errors | ForEach-Object { Write-Output "  - $_" }
}
Write-Output "`n(知识笔记更新将在后续步骤中基于提取的内容进行)"
