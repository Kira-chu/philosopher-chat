from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from dotenv import load_dotenv
import os
from pathlib import Path

# 加载环境变量（明确指定 .env 文件路径）
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="哲学家群聊 API")

# CORS 配置（允许前端访问）
# 生产环境：从环境变量读取允许的域名，开发环境允许所有
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",") if os.getenv("ALLOWED_ORIGINS") else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "哲学家群聊 API 运行中"}

@app.get("/api/health")
async def health():
    return {"status": "ok"}

