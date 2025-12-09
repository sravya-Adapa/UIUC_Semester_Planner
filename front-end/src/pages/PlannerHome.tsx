// src/pages/PlannerHome.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


import { fetchPathways, type CareerPath } from "../services/pathwayService";
import { searchCourses, type Course } from "../services/courseService";

// ----- Types -----
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
  const navigate = useNavigate();
  const location = useLocation();
  const incomingState = location.state as any; // Using any to avoid duplicating the interface for now

  // ----- Step control -----
  const [step, setStep] = useState<Step>(1);

  // ----- Step 1 state -----
  const [selectedMajor, setSelectedMajor] = useState(incomingState?.major || "");

  // ----- Step 2 state -----
  const [selectedCareer, setSelectedCareer] = useState<string | null>(incomingState?.careerPathId || null);
  const [pathways, setPathways] = useState<CareerPath[]>([]);

  // Fetch pathways when step becomes 2 (or on mount if you prefer, but let's do lazy load or on mount)
  useEffect(() => {
    // Only fetch if we haven't already
    if (pathways.length === 0) {
      fetchPathways().then((data) => {
        setPathways(data);
      });
    }
  }, []);

  // ----- Step 3 state -----
  const [currentSemester, setCurrentSemester] = useState(incomingState?.currentSemester || "");
  // Store selected courses persists
  const [selectedCoursesData, setSelectedCoursesData] = useState<Course[]>(incomingState?.selectedCourses || []);

  // Search state
  const [courseSearch, setCourseSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search Effect
  useEffect(() => {
    if (step !== 3) return;

    // Clear results if search is too short
    if (courseSearch.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timerId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCourses(courseSearch, 5); // Fetch top 5 only
        setSearchResults(results);
      } catch (err) {
        console.error("Error searching courses:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timerId);
  }, [step, courseSearch]);

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

  const addCourse = (course: Course) => {
    setSelectedCoursesData((prev) => {
      if (prev.some((c) => c.course_id === course.course_id)) return prev;
      return [...prev, course];
    });
    // Optional: Clear search after adding? Users might want to add multiple. 
    // Let's keep search open but maybe clear if user desires. 
    // For now, keep it open so they can verify.
    // Actually, usually "Add" resets search field. Let's reset for faster flow.
    setCourseSearch("");
    setSearchResults([]);
  };

  const removeCourse = (courseId: string) => {
    setSelectedCoursesData((prev) => prev.filter((c) => c.course_id !== courseId));
  };

  const handleGeneratePlan = () => {
    const selectedPath = pathways.find(p => p.id === selectedCareer);
    navigate("/generate-plan", {
      state: {
        major: selectedMajor,
        careerPathId: selectedCareer,
        careerPathName: selectedPath ? selectedPath.label : "Career Path",
        selectedCourses: selectedCoursesData,
        currentSemester: currentSemester
      }
    });
  };

  // ----- Render helpers -----
  const renderStepper = () => (
    <div className="wizard-stepper">
      <div className="wizard-steps">
        <div className={step === 1 ? "wizard-step wizard-step--active" : "wizard-step wizard-step--completed"}>1</div>
        <div className={step >= 2 ? "wizard-step-line wizard-step-line--active" : "wizard-step-line"} />
        <div className={step === 2 ? "wizard-step wizard-step--active" : step > 2 ? "wizard-step wizard-step--completed" : "wizard-step"}>2</div>
        <div className={step === 3 ? "wizard-step-line wizard-step-line--active" : "wizard-step-line"} />
        <div className={step === 3 ? "wizard-step wizard-step--active" : "wizard-step"}>3</div>
      </div>
      <p className="wizard-step-label">Step {step} of 3</p>
    </div>
  );

  const renderStep1 = () => (
    <>
      <div className="wizard-card-header">
        <div className="wizard-icon">
          <img src="/uiuc-planner-icon.svg" alt="UIUC icon" className="wizard-icon-img" />
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
            <option value="" disabled>Choose your major...</option>
            {majors.map((major) => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="wizard-footer">
        <button className="wizard-back-button" disabled><span className="wizard-back-arrow">‹</span> Back</button>
        <button className="wizard-next-button" onClick={goNextFromStep1} disabled={!selectedMajor}>
          Next <span className="wizard-next-arrow">›</span>
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="wizard-card-header">
        <div className="wizard-icon">
          <img src="/uiuc-planner-icon.svg" alt="Career icon" className="wizard-icon-img" />
        </div>
        <div>
          <h1 className="wizard-title">Choose Your Career Path</h1>
          <p className="wizard-subtitle">What&apos;s your professional goal?</p>
        </div>
      </div>

      <div className="wizard-body">
        <div className="wizard-career-grid">
          {pathways.map((path) => {
            const isSelected = selectedCareer === path.id;
            return (
              <button
                key={path.id}
                type="button"
                className={"wizard-career-card" + (isSelected ? " wizard-career-card--selected" : "")}
                onClick={() => setSelectedCareer(path.id)}
              >
                <div className="wizard-career-icon" style={{ backgroundColor: path.color }}>
                  <path.icon className="wizard-career-icon-img" />
                </div>
                <span className="wizard-career-label">{path.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="wizard-footer">
        <button className="wizard-back-button" onClick={goBack}><span className="wizard-back-arrow">‹</span> Back</button>
        <button className="wizard-next-button" onClick={goNextFromStep2} disabled={!selectedCareer}>
          Next <span className="wizard-next-arrow">›</span>
        </button>
      </div>
    </>
  );

  const renderStep3 = () => {
    return (
      <>
        <div className="wizard-card-header">
          <div className="wizard-icon">
            <img src="/uiuc-planner-icon.svg" alt="Book icon" className="wizard-icon-img" />
          </div>
          <div>
            <h1 className="wizard-title">Your Academic Progress</h1>
            <p className="wizard-subtitle">Tell us where you are in your journey</p>
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
                <option value="" disabled>Select current semester...</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Completed courses */}
          <div className="wizard-field-group">
            <label className="wizard-field-label">
              Completed Courses <span className="wizard-field-optional">(Optional)</span>
            </label>

            {/* Selected Courses List - ALWAYS VISIBLE */}
            {selectedCoursesData.length > 0 && (
              <div className="wizard-selected-courses" style={{ marginBottom: '1.5rem' }}>
                <p className="wizard-selected-label">Selected:</p>
                <div className="wizard-chips">
                  {selectedCoursesData.map((course) => (
                    <button
                      key={course.course_id}
                      type="button"
                      className="wizard-chip"
                      onClick={() => removeCourse(course.course_id)}
                    >
                      {course.course_id}
                      <span className="wizard-chip-remove">×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="wizard-course-search-wrapper" style={{ position: 'relative' }}>
              <input
                type="text"
                className="wizard-course-search"
                placeholder="Search to add courses (e.g. CS 124)..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
              />
              {/* Spinner */}
              {isSearching && (
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.875rem' }}>
                  Searching...
                </div>
              )}
            </div>

            {/* Search Results Dropdown/List */}
            {courseSearch.length >= 2 && !isSearching && searchResults.length > 0 && (
              <div className="wizard-search-results">
                {searchResults.map((course) => {
                  const isAdded = selectedCoursesData.some(c => c.course_id === course.course_id);
                  return (
                    <div
                      key={course.course_id}
                      className={`wizard-search-result-item ${isAdded ? 'disabled' : ''}`}
                      onClick={() => !isAdded && addCourse(course)}
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid #f3f4f6',
                        cursor: isAdded ? 'default' : 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        opacity: isAdded ? 0.6 : 1
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: '#111827', marginRight: '8px' }}>{course.course_id}</span>
                        <span style={{ color: '#6b7280', fontSize: '0.9em' }}>{course.title}</span>
                      </div>
                      {!isAdded && <button className="btn-add-mini" style={{ padding: '2px 8px' }}>+</button>}
                      {isAdded && <span style={{ color: '#10b981', fontSize: '0.8em', fontWeight: 600 }}>Added</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {!isSearching && courseSearch.length >= 2 && searchResults.length === 0 && (
              <div style={{ padding: '12px', color: '#6b7280', fontSize: '0.9rem', fontStyle: 'italic' }}>No courses found.</div>
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

