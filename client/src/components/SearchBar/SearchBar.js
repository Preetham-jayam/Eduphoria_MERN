import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { useGetCoursesQuery } from "../../Slices/courseApiSlice";

const SearchBar = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);
  const {data:courseData,isLoading}=useGetCoursesQuery();
  
  const navigate = useNavigate();

  useEffect(() => {
   if(courseData){
    setCourses(courseData.courses);
   }
  }, [courseData]);

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setShowSuggestions(query.trim() !== "");
    const results = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery) ||
        course.instructorName.toLowerCase().includes(searchQuery)
    );
    setResults(results);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    const results = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery) ||
        course.instructorName.toLowerCase().includes(searchQuery)
    );
    setResults(results);
    clearSearch();
    navigate("/results", { state: {query:searchQuery, courses: results } });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  if(isLoading){
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="search-bar">
        <form onSubmit={handleFormSubmit}>
          <div className="form-field">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
      {showSuggestions && courses.length > 0 && (
        <div className="suggestions">
          {results.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                setSearchQuery("");
                setResults([]);
                navigate(`/courseDetails/${course._id}`);
              }}
            >
              {course.title} - {course.instructorName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
