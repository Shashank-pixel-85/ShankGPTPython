from fastapi import APIRouter, Depends
from bson import ObjectId
from app.database.db import chats
from app.utils.deps import get_current_user
from app.llm.groq_llm import GroqLLM

router = APIRouter(prefix="/chat")
llm = GroqLLM()


# 1️⃣ Create a new empty chat session
@router.post("/new")
def new_chat(user_id: str = Depends(get_current_user)):
    chat_id = str(ObjectId())

    chats.insert_one({
        "_id": chat_id,
        "user_id": user_id,
        "title": "New Chat",
        "messages": []
    })

    return {
    "chat": {
        "id": chat_id,
        "title": "New Chat",
        "messages": []
    }
}


# 2️⃣ Send message to specific chat
@router.post("/{chat_id}")
def send_message(chat_id: str, payload: dict, user_id: str = Depends(get_current_user)):
    message = payload["message"]

    chat_doc = chats.find_one({"_id": chat_id, "user_id": user_id})
    if not chat_doc:
        return {"error": "Chat not found"}

    history = chat_doc["messages"]

    ai_reply = llm.chat(user_message=message, history=history)

    history.append({"role": "user", "content": message})
    history.append({"role": "ai", "content": ai_reply})

    # First user message becomes title
    if chat_doc["title"] == "New Chat":
        chats.update_one({"_id": chat_id}, {"$set": {"title": message[:30]}})

    chats.update_one(
        {"_id": chat_id},
        {"$set": {"messages": history}}
    )

    return {"answer": ai_reply}


# 3️⃣ Load chat messages
@router.get("/{chat_id}")
def load_chat(chat_id: str, user_id: str = Depends(get_current_user)):

    chat_doc = chats.find_one({"_id": chat_id, "user_id": user_id})

    if not chat_doc:
        return {"messages": []}

    return {
        "title": chat_doc["title"],
        "messages": chat_doc["messages"]
    }


# 4️⃣ List all chats for sidebar
@router.get("/list/all")
def list_chats(user_id: str = Depends(get_current_user)):
    user_chats = chats.find({"user_id": user_id})

    return {
    "chats": [
        {"id": chat["_id"], "title": chat["title"]}
        for chat in user_chats
    ]
}


# 5️⃣ Delete chat
@router.delete("/{chat_id}")
def delete_chat(chat_id: str, user_id: str = Depends(get_current_user)):
    chats.delete_one({"_id": chat_id, "user_id": user_id})
    return {"success": True}