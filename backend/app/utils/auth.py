import jwt
import os
from datetime import datetime, timedelta
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET = os.getenv("JWT_SECRET", "secret123")

# Hash password
def hash_password(password: str):
    # bcrypt max limit
    password = password[:72]
    return pwd_context.hash(password)

# Verify password
def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain[:72], hashed)

# Create JWT
def create_token(data: dict, expire_minutes=60*24*7):  # 7 days
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expire_minutes)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET, algorithm="HS256")

# Decode JWT
def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])
    except:
        return None