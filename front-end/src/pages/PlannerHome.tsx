// src/pages/PlannerHome.tsx
import React, { useEffect, useState } from "react";
import {
  CodeBracketIcon,
  ChartBarIcon,
  CpuChipIcon,
  BriefcaseIcon,
  BeakerIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

// === TEMP: base URL for the FastAPI backend ===
// Change this if your backend runs somewhere else.
const API_BASE_URL = "http://localhost:8000/api/v1";

// ----- Types -----
interface Course {
  course_id: string;
  title: string;
  // feel free to add more fields if you want later
}

type Step = 1 | 2 | 3;

// ----- Static data -----
const majors = [
  "Computer Science",
  "Electrical Engineering",
  "Computer Engineering",
  "Mathematics",
  "Statistics",
  "Data Science",
  "Information Science",
];

const careerPaths = [
  {
    id: "software_engineer",
    label: "Software Engineer",
    icon: CodeBracketIcon,
    color: "#2563eb",
  },
  {
    id: "data_analyst",
    label: "Data Analyst",
    icon: ChartBarIcon,
    color: "#22c55e",
  },
  {
    id: "ml_engineer",
    label: "ML Engineer",
    icon: CpuChipIcon,
    color: "#a855f7",
  },
  {
    id: "product_manager",
    label: "Product Manager",
    icon: BriefcaseIcon,
    color: "#f97316",
  },
  {
    id: "researcher",
    label: "Researcher",
    icon: BeakerIcon,
    color: "#ec4899",
  },
  {
    id: "data_scientist",
    label: "Data Scientist",
    icon: Squares2X2Icon,
    color: "#6366f1",
  },
];


const semesters = [
  "Spring 2024",
  "Summer 2024",
  "Fall 2024",
  "Spring 2025",
  "Summer 2025",
  "Fall 2025",
  "Spring 2026",
  "Summer 2026",
  "Fall 2026",
];

const PlannerHome: React.FC = () => {
  // ----- Step control -----
  const [step, setStep] = useState<Step>(1);

  // ----- Step 1 state -----
  const [selectedMajor, setSelectedMajor] = useState("");

  // ----- Step 2 state -----
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  // ----- Step 3 state -----
  const [currentSemester, setCurrentSemester] = useState("");
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Fetch courses from backend when we first enter Step 3
  useEffect(() => {
    if (step !== 3 || allCourses.length > 0) return;

    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);

        // Basic fetch: get first 100 courses
        const res = await fetch(`${API_BASE_URL}/courses?limit=100`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const json = await res.json();

        const courses: Course[] = json?.data?.courses ?? [];

        // Sort them nicely (by course_id)
        courses.sort((a, b) => a.course_id.localeCompare(b.course_id));

        setAllCourses(courses);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setCoursesError("Couldn't load courses. Please try again later.");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [step, allCourses.length]);

  // ----- Handlers -----
  const goNextFromStep1 = () => {
    if (!selectedMajor) return;
    setStep(2);
  };

  const goNextFromStep2 = () => {
    if (!selectedCareer) return;
    setStep(3);
  };

  const goBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  const toggleCompletedCourse = (courseId: string) => {
    setCompletedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleGeneratePlan = () => {
    // For now just log; later you can call the recommendation endpoint here
    console.log("Major:", selectedMajor);
    console.log("Career Path:", selectedCareer);
    console.log("Current Semester:", currentSemester);
    console.log("Completed Courses:", completedCourses);
    alert("This is where we'll generate your plan next 😊");
  };

  // ----- Render helpers -----
  const renderStepper = () => (
    <div className="wizard-stepper">
      <div className="wizard-steps">
        <div
          className={
            step === 1
              ? "wizard-step wizard-step--active"
              : "wizard-step wizard-step--completed"
          }
        >
          1
        </div>
        <div
          className={
            step >= 2
              ? "wizard-step-line wizard-step-line--active"
              : "wizard-step-line"
          }
        />
        <div
          className={
            step === 2
              ? "wizard-step wizard-step--active"
              : step > 2
              ? "wizard-step wizard-step--completed"
              : "wizard-step"
          }
        >
          2
        </div>
        <div
          className={
            step === 3
              ? "wizard-step-line wizard-step-line--active"
              : "wizard-step-line"
          }
        />
        <div
          className={
            step === 3
              ? "wizard-step wizard-step--active"
              : "wizard-step"
          }
        >
          3
        </div>
      </div>
      <p className="wizard-step-label">Step {step} of 3</p>
    </div>
  );

  const renderStep1 = () => (
    <>
      <div className="wizard-card-header">
        <div className="wizard-icon">
          <img
            src="/uiuc-planner-icon.svg"
            alt="UIUC icon"
            className="wizard-icon-img"
          />
        </div>
        <div>
          <h1 className="wizard-title">Select Your Major</h1>
          <p className="wizard-subtitle">What are you studying at UIUC?</p>
        </div>
      </div>

      <div className="wizard-body">
        <div className="wizard-select-wrapper">
          <select
            className="wizard-select"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
          >
            <option value="" disabled>
              Choose your major...
            </option>
            {majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="wizard-footer">
        <button className="wizard-back-button" disabled>
          <span className="wizard-back-arrow">‹</span> Back
        </button>
        <button
          className="wizard-next-button"
          onClick={goNextFromStep1}
          disabled={!selectedMajor}
        >
          Next <span className="wizard-next-arrow">›</span>
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="wizard-card-header">
        <div className="wizard-icon">
          <img
            src="/uiuc-planner-icon.svg"
            alt="Career icon"
            className="wizard-icon-img"
          />
        </div>
        <div>
          <h1 className="wizard-title">Choose Your Career Path</h1>
          <p className="wizard-subtitle">What&apos;s your professional goal?</p>
        </div>
      </div>

      <div className="wizard-body">
        <div className="wizard-career-grid">
          {careerPaths.map((path) => {
            const isSelected = selectedCareer === path.id;
            return (
              <button
                key={path.id}
                type="button"
                className={
                  "wizard-career-card" +
                  (isSelected ? " wizard-career-card--selected" : "")
                }
                onClick={() => setSelectedCareer(path.id)}
              >
                <div
                  className="wizard-career-icon"
                  style={{ backgroundColor: path.color }}
                >
                  <path.icon className="wizard-career-icon-img" />
                </div>
                <span className="wizard-career-label">{path.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="wizard-footer">
        <button className="wizard-back-button" onClick={goBack}>
          <span className="wizard-back-arrow">‹</span> Back
        </button>
        <button
          className="wizard-next-button"
          onClick={goNextFromStep2}
          disabled={!selectedCareer}
        >
          Next <span className="wizard-next-arrow">›</span>
        </button>
      </div>
    </>
  );

  const renderStep3 = () => {
  // filter courses based on search text
  const search = courseSearch.toLowerCase();
  const filteredCourses = allCourses.filter((course) =>
    course.course_id.toLowerCase().includes(search) ||
    course.title.toLowerCase().includes(search)
  );
  // checked courses appear first
  filteredCourses.sort((a, b) => {
    const aChecked = completedCourses.includes(a.course_id);
    const bChecked = completedCourses.includes(b.course_id);
    return Number(bChecked) - Number(aChecked);
  });

  return (
    <>
      <div className="wizard-card-header">
        <div className="wizard-icon">
          <img
            src="/uiuc-planner-icon.svg"
            alt="Book icon"
            className="wizard-icon-img"
          />
        </div>
        <div>
          <h1 className="wizard-title">Your Academic Progress</h1>
          <p className="wizard-subtitle">
            Tell us where you are in your journey
          </p>
        </div>
      </div>

      <div className="wizard-body">
        {/* Current semester */}
        <div className="wizard-field-group">
          <label className="wizard-field-label">Current Semester</label>
          <div className="wizard-select-wrapper wizard-select-wrapper--left">
            <select
              className="wizard-select"
              value={currentSemester}
              onChange={(e) => setCurrentSemester(e.target.value)}
            >
              <option value="" disabled>
                Select current semester...
              </option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Completed courses */}
        <div className="wizard-field-group">
          <label className="wizard-field-label">
            Completed Courses <span className="wizard-field-optional">(Optional)</span>
          </label>

          {coursesLoading && (
            <p className="wizard-helper-text">Loading courses…</p>
          )}

          {coursesError && (
            <p className="wizard-error-text">{coursesError}</p>
          )}

          {!coursesLoading && !coursesError && (
            <>
              {/* Search bar */}
              <div className="wizard-course-search-wrapper">
                <input
                  type="text"
                  className="wizard-course-search"
                  placeholder="Search by course code or title..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>

              {/* Scrollable checkbox grid */}
              <div className="wizard-course-grid">
                {filteredCourses.map((course) => {
                  const isChecked = completedCourses.includes(course.course_id);
                  return (
                    <label
                      key={course.course_id}
                      className={
                        "wizard-course-item" +
                        (isChecked ? " wizard-course-item--checked" : "")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCompletedCourse(course.course_id)}
                      />
                      <span className="wizard-course-code">
                        {course.course_id}
                      </span>
                      <span className="wizard-course-title">
                        {course.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="wizard-footer">
        <button className="wizard-back-button" onClick={goBack}>
          <span className="wizard-back-arrow">‹</span> Back
        </button>
        <button
          className="wizard-next-button wizard-next-button--primary"
          onClick={handleGeneratePlan}
          disabled={!currentSemester}
        >
          Generate My Plan <span className="wizard-next-arrow">✨</span>
        </button>
      </div>
    </>
  );
};


  return (
    <div className="wizard-page">
      {renderStepper()}

      <div className="wizard-card">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default PlannerHome;

