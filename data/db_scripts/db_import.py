import json
import os
import certifi
from pymongo import MongoClient, UpdateOne

# Resolve paths relative to the repo's data directory
DATA_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(DATA_DIR, "processed", "uiuc_courses_flatten.json")

with open(JSON_PATH, "r") as f:
    courses = json.load(f)

print(f"Loaded {len(courses)} courses.")

MONGO_URI = (
    "mongodb+srv://uiuc_admin:uiuc123@cluster0.zqytfnv.mongodb.net/?appName=Cluster0"
)

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["uiuc"]
collection = db["courses"]

print("Connected to MongoDB Atlas.")

operations = []

for course_id, course_data in courses.items():
    course_data["_id"] = course_id
    operations.append(UpdateOne({"_id": course_id}, {"$set": course_data}, upsert=True))

if operations:
    result = collection.bulk_write(operations)
    print("Inserted:", result.upserted_count)
    print("Updated:", result.modified_count)

print("Import complete.")
