from typing import List, Dict
from app.models.philosopher import PHILOSOPHERS, PHILOSOPHER_ORDER
from app.services.llm_service import LLMService
from app.models.philosopher import Message

class ConversationOrchestrator:
    def __init__(self):
        self.llm_service = LLMService()
    
    def get_philosopher(self, philosopher_id: str):
        """获取哲学家信息"""
        return PHILOSOPHERS[philosopher_id]
    
    def format_conversation_history(self, messages: List[Message]) -> List[Dict[str, str]]:
        """将消息列表格式化为 LLM API 需要的格式"""
        history = []
        for msg in messages:
            if msg.philosopher:
                # 哲学家发言，格式化为用户消息（因为 LLM 会以该角色身份回复）
                history.append({
                    "role": "user",
                    "content": f"[{msg.philosopher}]: {msg.content}"
                })
            else:
                # 用户输入
                history.append({
                    "role": "user",
                    "content": msg.content
                })
        return history
    
    async def generate_round_one(
        self, 
        user_input: str
    ) -> List[Message]:
        """
        第一轮：每个哲学家独立对用户输入做出反应（并发执行）
        """
        import asyncio
        
        messages = []
        
        # 添加用户输入
        messages.append(Message(
            role="user",
            content=user_input
        ))
        
        # 定义异步任务函数
        async def generate_philosopher_response(philosopher_id: str):
            philosopher = PHILOSOPHERS[philosopher_id]
            
            # 构建系统提示词
            system_prompt = philosopher["prompt"].format(
                task_instruction="请对用户的输入做出你的初始反应。用你的核心立场分析这个问题。",
                conversation_history=f"用户输入：{user_input}"
            )
            
            # 调用 LLM
            response = await self.llm_service.generate_response(
                system_prompt=system_prompt,
                conversation_history=None  # 第一轮只看用户输入
            )
            
            return Message(
                role="assistant",
                content=response,
                philosopher=philosopher["name"]
            )
        
        # 并发执行所有哲学家的回复
        tasks = [generate_philosopher_response(philosopher_id) for philosopher_id in PHILOSOPHER_ORDER]
        philosopher_messages = await asyncio.gather(*tasks)
        
        # 按照顺序添加到消息列表
        messages.extend(philosopher_messages)
        
        return messages
    
    async def generate_round_two(
        self, 
        round_one_messages: List[Message]
    ) -> List[Message]:
        """
        第二轮：哲学家基于第一轮的观点进行互动（并发执行）
        """
        import asyncio
        
        messages = round_one_messages.copy()
        
        # 格式化第一轮对话历史
        conversation_history_text = self._format_history_for_display(round_one_messages)
        conversation_history = self.format_conversation_history(round_one_messages)
        
        # 定义异步任务函数
        async def generate_philosopher_response(philosopher_id: str):
            philosopher = PHILOSOPHERS[philosopher_id]
            
            # 构建系统提示词
            system_prompt = philosopher["prompt"].format(
                task_instruction="请基于第一轮的讨论，回应其他哲学家的观点。你可以赞同、反驳、补充或深化讨论。",
                conversation_history=conversation_history_text
            )
            
            # 调用 LLM（传入完整的第一轮对话历史）
            response = await self.llm_service.generate_response(
                system_prompt=system_prompt,
                conversation_history=conversation_history
            )
            
            return Message(
                role="assistant",
                content=response,
                philosopher=philosopher["name"]
            )
        
        # 并发执行所有哲学家的回复
        tasks = [generate_philosopher_response(philosopher_id) for philosopher_id in PHILOSOPHER_ORDER]
        philosopher_messages = await asyncio.gather(*tasks)
        
        # 添加到消息列表
        messages.extend(philosopher_messages)
        
        return messages
    
    def _format_history_for_display(self, messages: List[Message]) -> str:
        """将对话历史格式化为文本，用于显示在 Prompt 中"""
        history_text = ""
        for msg in messages:
            if msg.philosopher:
                history_text += f"\n{msg.philosopher}: {msg.content}\n"
            else:
                history_text += f"\n用户: {msg.content}\n"
        return history_text

