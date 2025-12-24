from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.philosopher import ChatRequest, Message, PHILOSOPHERS, PHILOSOPHER_ORDER
from app.services.orchestrator import ConversationOrchestrator
import uuid
import json
import asyncio
import random

router = APIRouter()
orchestrator = ConversationOrchestrator()

async def generate_stream(request: ChatRequest):
    """
    流式生成哲学家回复 - 模拟真实群聊，支持@功能
    """
    try:
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # 所有消息历史
        all_messages = [Message(role="user", content=request.user_input)]
        
        # 解析@信息，决定哪些哲学家回复
        mentioned_philosophers = []
        if request.mentions:
            if '所有人' in request.mentions:
                # @所有人，所有哲学家都回复
                mentioned_philosophers = PHILOSOPHER_ORDER.copy()
            else:
                # @特定哲学家
                for mention in request.mentions:
                    for pid, pdata in PHILOSOPHERS.items():
                        if pdata["name"] == mention:
                            if pid not in mentioned_philosophers:
                                mentioned_philosophers.append(pid)
                            break
        
        # 如果没有@任何人，使用原来的逻辑（随机选择第一个）
        if not mentioned_philosophers:
            # 随机选择一个哲学家首先回应
            remaining_philosophers = PHILOSOPHER_ORDER.copy()
            first_philosopher_id = random.choice(remaining_philosophers)
            remaining_philosophers.remove(first_philosopher_id)
            mentioned_philosophers = [first_philosopher_id] + remaining_philosophers
        
        # 随机打乱顺序，让对话更自然
        random.shuffle(mentioned_philosophers)
        
        # 第一轮：被@的哲学家依次回应
        for philosopher_id in mentioned_philosophers:
        
            philosopher = PHILOSOPHERS[philosopher_id]
            
            # 如果是第一个，直接回应用户；否则可以回应前面的人
            if len(all_messages) == 1:
                # 第一个哲学家直接回应用户
                system_prompt = philosopher["prompt"].format(
                    task_instruction="请对用户的输入做出你的初始反应。用你的核心立场分析这个问题。回复要简短精炼（80-120字），口语化自然，不要AI味，不要用太多符号，绝对不要用'哈！'这种模式化开头。",
                    conversation_history=f"用户输入：{request.user_input}"
                )
                conversation_history = None
            else:
                # 后续哲学家可以回应前面的人和用户
                num_to_respond = min(random.randint(1, 3), len(all_messages))
                selected_messages = random.sample(all_messages, num_to_respond)
                
                # 确保包含用户输入
                if not any(msg.role == "user" for msg in selected_messages):
                    selected_messages = [all_messages[0]] + selected_messages[:num_to_respond-1]
                
                conversation_history_text = orchestrator._format_history_for_display(selected_messages)
                conversation_history = orchestrator.format_conversation_history(selected_messages)
                
                system_prompt = philosopher["prompt"].format(
                    task_instruction="请基于前面的讨论做出回应。你可以回应前面某个或某几个人的观点，同时表达自己的观点。不需要回应所有人，选择你最想说的。回复要简短精炼（80-120字），口语化自然，不要AI味，不要用太多符号，绝对不要用'哈！'这种模式化开头。",
                    conversation_history=conversation_history_text
                )
            
            response = await orchestrator.llm_service.generate_response(
                system_prompt=system_prompt,
                conversation_history=conversation_history
            )
            
            message = Message(
                role="assistant",
                content=response,
                philosopher=philosopher["name"]
            )
            all_messages.append(message)
            yield f"data: {json.dumps({'type': 'message', 'message': {'role': 'assistant', 'content': response, 'philosopher': philosopher['name']}, 'conversation_id': conversation_id}, ensure_ascii=False)}\n\n"
            await asyncio.sleep(0.1)
        
        # 如果只@了一个人，可能不需要第二轮；如果@了多个或所有人，可以继续讨论
        if len(mentioned_philosophers) > 1 and random.random() > 0.3:
            # 第二轮：继续讨论，从被@的哲学家中随机选择
            num_round2 = random.randint(1, min(3, len(mentioned_philosophers)))
            selected_philosophers = random.sample(mentioned_philosophers, num_round2)
            
            for philosopher_id in selected_philosophers:
                philosopher = PHILOSOPHERS[philosopher_id]
                
                # 随机选择1-3个前面的消息来回应
                num_to_respond = min(random.randint(1, 3), len(all_messages))
                selected_messages = random.sample(all_messages, num_to_respond)
                
                conversation_history_text = orchestrator._format_history_for_display(selected_messages)
                conversation_history = orchestrator.format_conversation_history(selected_messages)
                
                system_prompt = philosopher["prompt"].format(
                    task_instruction="请继续讨论，可以回应前面某个或某几个人的观点，同时表达自己的观点。回复要简短精炼（80-120字），口语化自然，不要AI味，不要用太多符号，绝对不要用'哈！'这种模式化开头。",
                    conversation_history=conversation_history_text
                )
                
                response = await orchestrator.llm_service.generate_response(
                    system_prompt=system_prompt,
                    conversation_history=conversation_history
                )
                
                message = Message(
                    role="assistant",
                    content=response,
                    philosopher=philosopher["name"]
                )
                all_messages.append(message)
                yield f"data: {json.dumps({'type': 'message', 'message': {'role': 'assistant', 'content': response, 'philosopher': philosopher['name']}, 'conversation_id': conversation_id}, ensure_ascii=False)}\n\n"
                await asyncio.sleep(0.1)
        
        # 第三轮：可能继续，随机决定（如果@了多个或所有人，概率更高）
        if len(mentioned_philosophers) > 1 and random.random() > 0.6:
            num_round3 = random.randint(1, min(2, len(mentioned_philosophers)))
            selected_philosophers = random.sample(mentioned_philosophers, num_round3)
            
            for philosopher_id in selected_philosophers:
                philosopher = PHILOSOPHERS[philosopher_id]
                
                num_to_respond = min(random.randint(1, 3), len(all_messages))
                selected_messages = random.sample(all_messages, num_to_respond)
                
                conversation_history_text = orchestrator._format_history_for_display(selected_messages)
                conversation_history = orchestrator.format_conversation_history(selected_messages)
                
                system_prompt = philosopher["prompt"].format(
                    task_instruction="请继续讨论，可以回应前面某个或某几个人的观点，同时表达自己的观点。回复要简短精炼（80-120字），口语化自然，不要AI味，不要用太多符号，绝对不要用'哈！'这种模式化开头。",
                    conversation_history=conversation_history_text
                )
                
                response = await orchestrator.llm_service.generate_response(
                    system_prompt=system_prompt,
                    conversation_history=conversation_history
                )
                
                message = Message(
                    role="assistant",
                    content=response,
                    philosopher=philosopher["name"]
                )
                all_messages.append(message)
                yield f"data: {json.dumps({'type': 'message', 'message': {'role': 'assistant', 'content': response, 'philosopher': philosopher['name']}, 'conversation_id': conversation_id}, ensure_ascii=False)}\n\n"
                await asyncio.sleep(0.1)
        
        # 发送完成信号
        yield f"data: {json.dumps({'type': 'done', 'conversation_id': conversation_id}, ensure_ascii=False)}\n\n"
        
    except Exception as e:
        error_msg = f"处理失败: {str(e)}"
        yield f"data: {json.dumps({'type': 'error', 'error': error_msg}, ensure_ascii=False)}\n\n"

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    流式处理用户输入，逐个返回哲学家回复 - 模拟真实群聊
    """
    return StreamingResponse(
        generate_stream(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
