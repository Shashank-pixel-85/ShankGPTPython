from fastapi import APIRouter, Depends
from bson import ObjectId
from app.database.db import users
from app.utils.deps import get_current_user

router = APIRouter()

@router.get("/auth/me")
def get_me(user_id: str = Depends(get_current_user)):
    user = users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"user": None}

    return {
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }