from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database.db import users
from app.models.user_model import UserCreate, UserLogin
from app.utils.auth import hash_password, verify_password, create_token

router = APIRouter()

# SIGNUP
@router.post("/auth/signup")
def signup(data: UserCreate):
    # Check if email exists
    if users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed = hash_password(data.password)

    user = {
        "name": data.name,
        "email": data.email,
        "password": hashed
    }

    res = users.insert_one(user)
    user_id = str(res.inserted_id)

    token = create_token({"user_id": user_id})

    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": data.name,
            "email": data.email
        }
    }


# LOGIN
@router.post("/auth/login")
def login(data: UserLogin):
    user = users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email/password")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email/password")

    user_id = str(user["_id"])
    token = create_token({"user_id": user_id})

    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"]
        }
    }