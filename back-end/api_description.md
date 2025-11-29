# Semester Planner API Endpoints

## Courses

### GET /courses
Get paginated list of courses

**Query Params:** `department`, `semester`, `gen_ed`, `credit_hours`, `min_rating`, `max_difficulty`, `page`, `limit`

---

### GET /courses/{courseId}
Get detailed course information including instructors, prerequisites, and stats

---

### GET /courses/search
Search courses by keyword or skills

**Query Params:** `q` (search text), `skills` (comma-separated)

---

### GET /courses/{courseId}/prerequisites
Get prerequisite tree for a course

---

### GET /courses/{courseId}/instructors
Get instructors for a course with their stats

**Query Params:** `sort_by` ("rating", "difficulty", "avg_gpa")

---

## Pathways

### GET /pathways
Get all available career pathways

---

### GET /pathways/{pathwayId}
Get detailed pathway information including skills and course lists

---

### GET /pathways/{pathwayId}/courses
Get courses for a pathway (core, recommended, optional)

**Query Params:** `type` ("core", "recommended", "optional", "all"), `include_details` (boolean)

---

### POST /pathways/{pathwayId}/recommend
Generate personalized course recommendations

**Request Body:**
```json
{
  "completed_courses": ["CS 101", "MATH 221"],
  "current_semester": "fall",
  "credits_per_semester": 15,
  "preferences": {
    "max_difficulty": 4.0,
    "preferred_instructors": ["Butler, L"],
    "avoid_gen_eds": false,
    "prioritize_pathway": true
  }
}
```

**Returns:** Recommended courses with priority levels, reasons, and suggested instructors