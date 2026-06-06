# WuHua-note

这是一个高三复习物化资料库，目前包含了一轮复习内容。

## 使用方法

### 搜索工具（推荐）

下载对应系统的 release 压缩包，解压后双击 `搜索.html` 即可在浏览器中直接使用：

- **浏览** — 左侧按单元列出所有专题，点击即可查看知识点详情
- **搜索** — 顶部搜索栏支持任意关键词搜索，结果会高亮匹配内容并标注所在专题
- **筛选** — 顶部分页可切换查看全部 / 化学 / 物理

工具为完全离线运行的单文件 HTML，所有数据已内嵌，无需安装或联网。

### 数据文件

知识库以 JSON 格式存储在 `data/knowledge/` 目录下：

| 文件 | 说明 |
|------|------|
| `chemistry.json` | 化学一轮复习知识点，33 个专题，9 个单元 |
| `physics.json` | 物理一轮复习知识点，29 个专题 |
| `processed_files.json` | 已处理课件文件的元数据 |

每个专题包含多个考点（kaodians），考点下按知识点 / 考点 / 易混点 / 方法技巧等类型组织详细内容。

### 构建脚本

`scripts/` 目录下的 PowerShell 脚本可用于从 DOCX 课件文件中提取内容并更新知识库：

- `build_chemistry_knowledge.ps1` — 构建/更新化学知识库
- `create_chemistry_json.ps1` — 创建化学 JSON
- `process_files.ps1` — 批量处理课件文件

使用前需修改脚本中的源文件路径，指向本地的课件目录。

## 当前内容

- **化学** — 一轮复习知识点整理（data/knowledge/chemistry.json）
- **物理** — 一轮复习知识点整理（data/knowledge/physics.json）
- **处理脚本** — 用于构建和更新知识库的 PowerShell 工具（scripts/）
- **搜索工具** — 离线运行的 HTML 搜索浏览工具（_release/search.html）

## 远期计划

- 添加更加智能的搜索功能，对于特定关键词，可以实现准确搜索和模糊识别
