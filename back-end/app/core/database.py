from pymongo import MongoClient
from pymongo.collection import Collection
from app.core.config import settings
from app.core.logging import get_logger
from contextlib import contextmanager

logger = get_logger(__name__)


class MongoDBClient:
    """MongoDB client for database operations"""

    _instance = None
    _client = None
    _db = None

    @classmethod
    def get_instance(cls):
        """Get singleton instance of MongoDBClient"""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        """Initialize MongoDB connection"""
        if MongoDBClient._client is None:
            try:
                MongoDBClient._client = MongoClient(settings.MONGODB_URL)
                # Test connection
                MongoDBClient._client.admin.command("ping")
                logger.info("Connected to MongoDB successfully")
            except Exception as e:
                logger.error(f"Failed to connect to MongoDB: {str(e)}")
                raise

        if MongoDBClient._db is None:
            MongoDBClient._db = MongoDBClient._client[settings.MONGODB_DB_NAME]

    @staticmethod
    def get_database():
        """Get database instance"""
        if MongoDBClient._db is None:
            MongoDBClient.get_instance()
        return MongoDBClient._db

    @staticmethod
    def get_collection(collection_name: str) -> Collection:
        """Get a specific collection"""
        db = MongoDBClient.get_database()
        if db is None:
            raise RuntimeError("Database not initialized")
        return db[collection_name]

    @staticmethod
    def close():
        """Close MongoDB connection"""
        if MongoDBClient._client:
            MongoDBClient._client.close()
            MongoDBClient._client = None
            MongoDBClient._db = None
            logger.info("MongoDB connection closed")


# Initialize on module import
def init_mongodb():
    """Initialize MongoDB connection"""
    try:
        MongoDBClient.get_instance()
    except Exception as e:
        logger.error(f"Failed to initialize MongoDB: {str(e)}")
        raise


init_mongodb()
