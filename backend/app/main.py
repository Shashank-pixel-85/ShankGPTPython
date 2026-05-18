from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
import os

# Load .env manually from backend root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

from app.routes.auth import router as auth_router
from app.routes.chat import router as chat_router
from app.routes.me import router as me_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],               # CORS updated
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(me_router)