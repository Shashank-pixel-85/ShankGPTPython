from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URL"))
db = client["shankgpt"]

users = db["users"]
chats = db["chats"]