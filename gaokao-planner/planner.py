from llm_client import LLMClient
from typing import Optional
import json


class StudyPlanner:
    """Generate personalized review plans based on student info."""

    SYSTEM_PROMPT = """你是一位经验丰富的高考备考规划师。请根据学生信息生成一份详细的复习计划。

要求：
1. 计划要具体、可执行，包含每天的学习内容和时间安排
2. 针对薄弱知识点重点安排复习时间和练习
3. 合理分配不同科目的学习时间
4. 包含阶段性检测和调整机制

请严格按照以下JSON格式返回：

{
  "overall_goal": "整体复习目标概述",
  "total_weeks": 总周数,
  "weekly_plans": [
    {
      "week": 1,
      "theme": "本周主题",
      "focus_areas": ["重点1", "重点2"],
      "daily_schedule": [
        {
          "day": "周一",
          "tasks": [
            {"time": "08:00-10:00", "content": "学习内容", "details": "具体任务描述"}
          ]
        }
      ],
      "weekly_checkpoint": "本周末的自测/检查方式"
    }
  ],
  "tips": ["备考建议1", "备考建议2"]
}

注意：
- 每一天的安排都要具体到时间和内容
- 每周安排要合理，考虑学生的学习能力和疲劳度
- 薄弱知识点要反复出现以加强记忆
"""

    def __init__(self):
        self.llm = LLMClient()

    def generate_plan(
        self,
        name: str,
        start_date: str,
        end_date: str,
        weak_points: list[str],
        weekly_hours: int,
        subjects: list[str] | None = None,
    ) -> dict:
        """Generate a study plan based on student information."""
        subjects_text = ", ".join(subjects) if subjects else "根据薄弱点自动确定"

        prompt = f"""学生姓名：{name}
复习时间段：{start_date} 至 {end_date}
薄弱知识点：{', '.join(weak_points)}
每周可用学习时间：{weekly_hours}小时
需要复习的科目：{subjects_text}

请为这位学生制定一份详细的复习计划。"""

        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ]

        try:
            text = self.llm.chat(messages, temperature=0.6, max_tokens=8192)
            result = self.llm.extract_json(text)
            if result and "weekly_plans" in result:
                return result
            return {
                "raw_response": text,
                "note": "LLM 返回了非结构化内容，请查看原始输出。",
            }
        except Exception as e:
            return {"error": True, "message": f"生成计划失败：{e}"}
