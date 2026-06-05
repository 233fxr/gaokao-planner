from llm_client import LLMClient
from typing import Optional


class QuestionScraper:
    """Generate questions using LLM (no actual scraping needed)."""

    SYSTEM_PROMPT = """你是一位资深高考命题专家。你的任务是：
根据用户描述，生成一道贴合高考风格的真实题目。

请严格按照以下JSON格式返回（不要包含任何额外文字）：

{
  "subject": "学科名称（如物理、数学）",
  "source": "题目来源描述（如"2024年广东卷"）",
  "question": "完整的题目内容，包括题干、选项（如果是选择题）、数值等",
  "answer": "标准答案",
  "explanation": "详细的解题思路和步骤解析",
  "difficulty": 1-5的难度评级,
  "type": "选择题 | 填空题 | 解答题"
}

注意：
- 题目必须是真实、准确的，符合高考命题规范
- 如果是物理题，请确保公式用LaTeX格式（$...$）表达
- 解题步骤需要详细，方便学生自学
- 难度评级：1=基础，2=中等，3=较难，4=困难，5=压轴级别
"""

    def __init__(self):
        self.llm = LLMClient()

    def generate(self, query: str) -> Optional[dict]:
        """Generate a question based on the user's natural language description."""
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"请根据以下描述生成一道题目：\n\n{query}",
            },
        ]
        try:
            text = self.llm.chat(messages, temperature=0.5, max_tokens=4096)
            result = self.llm.extract_json(text)
            if result and "question" in result:
                return result
            return {
                "question": text,
                "answer": "（请参考上方解析）",
                "explanation": "LLM 返回了非结构化的内容，已将原始输出展示在上方。",
                "source": query,
                "subject": "未知",
                "difficulty": 3,
                "type": "解答题",
            }
        except Exception as e:
            return {
                "error": True,
                "message": f"生成题目失败：{e}",
            }
