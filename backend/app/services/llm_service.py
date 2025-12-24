import os
from openai import OpenAI
from typing import List, Dict
from dotenv import load_dotenv
from pathlib import Path

# 加载环境变量
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class LLMService:
    def __init__(self):
        api_key = os.getenv("DEEPSEEK_API_KEY")
        base_url = os.getenv("DEEPSEEK_API_BASE", "https://api.deepseek.com")
        
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY 环境变量未设置")
        
        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url
        )
        self.model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    
    async def generate_response(
        self, 
        system_prompt: str, 
        conversation_history: List[Dict[str, str]] = None
    ) -> str:
        """
        调用 DeepSeek API 生成回复
        """
        messages = [{"role": "system", "content": system_prompt}]
        
        if conversation_history:
            messages.extend(conversation_history)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.8,  # 稍微提高创造性，但保持一致性
                max_tokens=150  # 限制回复长度，让对话更简短精炼
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"LLM API 调用失败: {str(e)}")

