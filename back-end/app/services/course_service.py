from typing import Optional, List, Dict, Any
from app.core.database import MongoDBClient
from app.core.logging import get_logger

logger = get_logger(__name__)


class CourseService:
    """Service for course-related database operations"""

    COLLECTION_NAME = "courses"

    @staticmethod
    def get_collection():
        """Get courses collection"""
        return MongoDBClient.get_collection(CourseService.COLLECTION_NAME)

    @staticmethod
    def get_all_courses(
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        limit: int = 20,
        sort_by: str = "course_id",
    ) -> tuple[List[Dict], int]:
        """
        Get all courses with optional filtering and pagination

        Returns:
            Tuple of (courses list, total count)
        """
        collection = CourseService.get_collection()

        query = filters or {}

        # Calculate skip for pagination
        skip = (page - 1) * limit

        # Get total count
        total = collection.count_documents(query)

        # Get paginated results
        courses = list(collection.find(query).sort(sort_by, 1).skip(skip).limit(limit))

        return courses, total

    @staticmethod
    def get_course_by_id(course_id: str) -> Optional[Dict]:
        """Get a single course by ID"""
        collection = CourseService.get_collection()
        return collection.find_one({"course_id": course_id})

    @staticmethod
    def search_courses(
        query: str, skills: Optional[List[str]] = None, page: int = 1, limit: int = 20
    ) -> tuple[List[Dict], int]:
        """
        Search courses by query string and/or skills
        """
        collection = CourseService.get_collection()

        # Build search filter
        search_filter: Dict[str, Any] = {
            "$or": [
                {"course_id": {"$regex": query, "$options": "i"}},
                {"title": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
            ]
        }

        if skills:
            search_filter["$or"].append({"skills": {"$in": skills}})

        skip = (page - 1) * limit
        total = collection.count_documents(search_filter)

        courses = list(collection.find(search_filter).skip(skip).limit(limit))

        return courses, total

    @staticmethod
    def get_prerequisites(course_id: str) -> Optional[Dict]:
        """Get prerequisites for a course"""
        course = CourseService.get_course_by_id(course_id)
        if course:
            return {
                "course_id": course_id,
                "prerequisites": course.get("prerequisites"),
            }
        return None

    @staticmethod
    def get_instructors(course_id: str, sort_by: str = "rating") -> Optional[Dict]:
        """Get instructors for a course, optionally sorted"""
        course = CourseService.get_course_by_id(course_id)
        if course:
            instructors = course.get("instructors", {})

            # Convert to list and sort if needed
            instructor_list = [
                {
                    "name": name,
                    "rating": stats.get("rating"),
                    "difficulty": stats.get("difficulty"),
                    "avg_gpa": stats.get("avg_gpa"),
                }
                for name, stats in instructors.items()
            ]

            # Sort by requested metric
            if sort_by in ["rating", "difficulty", "avg_gpa"]:
                instructor_list.sort(
                    key=lambda x: x.get(sort_by) or 0, reverse=(sort_by == "rating")
                )

            return {"course_id": course_id, "instructors": instructor_list}
        return None
