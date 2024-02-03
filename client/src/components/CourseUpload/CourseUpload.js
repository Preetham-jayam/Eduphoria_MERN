import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./CourseUpload.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetCourseDetailsQuery,
  useUpdateCourseMutation,
  useDeleteLessonMutation,
  useAddChapterMutation,
  useAddLessonMutation,
  useUpdateChapterMutation,
  useUpdateLessonMutation,
} from "../../Slices/courseApiSlice";
import Loader from "../Loader/Loader";
import Modal from "../../shared/components/FrontendTools/Modal";

const CourseUpload = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const {
    data: courseData,
    isLoading: courseLoading,
    isError: courseError,
  } = useGetCourseDetailsQuery(courseId);
  const [course, setCourse] = useState({});
  const [chIndex,setChIndex]=useState(null);
  const [courseChapters, setCourseChapters] = useState([]);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [newChapter, setNewChapter] = useState({ name: "", description: "" });
  const [newLesson, setNewLesson] = useState({
    title: "",
    number: 0,
    description: "",
    videoFile: null,
  });

  useEffect(() => {
    if (courseData) {
      setCourse(courseData.course);
      setCourseChapters(courseData.course.chapters);
    }
  }, [courseData]);

  useEffect(() => {
    if (courseError) {
      console.error("Error fetching courses:", courseError);
    }
  }, [courseError]);

  const handleChapterNameChange = (index, value) => {
    setCourseChapters((prevChapters) => {
      const updatedChapters = [...prevChapters];
      updatedChapters[index].name = value;
      return updatedChapters;
    });
  };

  const handleChapterDescriptionChange = (index, value) => {
    setCourseChapters((prevChapters) => {
      const updatedChapters = [...prevChapters];
      updatedChapters[index].description = value;
      return updatedChapters;
    });
  };

  const handleLessonNameChange = (chapterIndex, lessonIndex, value) => {
    setCourseChapters((prevChapters) => {
      const updatedChapters = [...prevChapters];
      updatedChapters[chapterIndex].lessons[lessonIndex].title = value;
      return updatedChapters;
    });
  };

  const handleLessonDetailsChange = (
    chapterIndex,
    lessonIndex,
    field,
    value
  ) => {
    setCourseChapters((prevChapters) => {
      const updatedChapters = [...prevChapters];
      updatedChapters[chapterIndex].lessons[lessonIndex][field] = value;
      return updatedChapters;
    });
  };


  const [updateCourseMutation] = useUpdateCourseMutation();
  const [deleteLessonMutation] = useDeleteLessonMutation();
  const [addChapterMutation] = useAddChapterMutation();
  const [addLessonMutation] = useAddLessonMutation();
  const [updateChapterMutation] = useUpdateChapterMutation();
  const [updateLessonMutation] = useUpdateLessonMutation();

  const updateCourse = useCallback(async () => {
    try {
      const updatedCourse = await updateCourseMutation({
        courseId,
        course: {
          ...course,
          chapters: courseChapters,
        },
      });

      console.log("Course", updatedCourse);
      toast.success("Course Updated Successfully");
      navigate(`/courseContent/${courseId}`);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  }, [course, courseChapters, courseId, navigate, updateCourseMutation]);

  const handleSubmit = useCallback(() => {
    updateCourse();
  }, [updateCourse]);

  const handleAddChapter = async () => {
    setShowChapterModal(true);
  };

  const handleAddLesson = async (chapterIndex) => {
    setChIndex(chapterIndex);
    setShowLessonModal(true);
  };

  const handleChapterModalSubmit = async () => {
    try {
      const newChapterResponse = await addChapterMutation({
        courseId,
        chapter: {
          name: newChapter.name,
          description: newChapter.description,
          lessons: [],
        },
      });

      setCourseChapters((prevChapters) => [
        ...prevChapters,
        newChapterResponse,
      ]);
      setShowChapterModal(false);
      setNewChapter({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const handleLessonModalSubmit = async (chapterIndex) => {
    try {
      console.log(courseChapters);
      const newLessonResponse = await addLessonMutation({
        chapterId: courseChapters[chapterIndex]._id,
        lesson: {
          number: newLesson.number,
          title: newLesson.title,
          description: newLesson.description,
          videoFile: newLesson.videoFile,
          checked: 0,
        },
      });
      console.log(newLessonResponse);
      setCourseChapters((prevChapters) => {
        const updatedChapters = [...prevChapters];
        const updatedChapter = { ...updatedChapters[chapterIndex] };
      
        updatedChapter.lessons = [
          ...updatedChapter.lessons,
          newLessonResponse.lesson,
        ];
      
        updatedChapters[chapterIndex] = updatedChapter;
        return updatedChapters;
      });
      

      setShowLessonModal(false);
      setNewLesson({ title: "", number: 0, description: "", videoUrl: "" });
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const handleUpdateChapter = async (chapterIndex) => {
    try {
      const updatedChapter = await updateChapterMutation({
        chapterId: courseChapters[chapterIndex]._id,
        chapter: courseChapters[chapterIndex],
      });

      setCourseChapters((prevChapters) => {
        const updatedChapters = [...prevChapters];
        updatedChapters[chapterIndex] = updatedChapter;
        return updatedChapters;
      });
    } catch (error) {
      console.error("Error updating chapter:", error);
    }
  };

  const handleUpdateLesson = async (chapterIndex, lessonIndex) => {
    try {
      const updatedLesson = await updateLessonMutation({
        lessonId: courseChapters[chapterIndex].lessons[lessonIndex]._id,
        lesson: courseChapters[chapterIndex].lessons[lessonIndex],
      });

      setCourseChapters((prevChapters) => {
        const updatedChapters = [...prevChapters];
        updatedChapters[chapterIndex].lessons[lessonIndex] = updatedLesson;
        return updatedChapters;
      });
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const handleLessonDelete = async (chapterIndex, lessonIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (confirmDelete) {
      try {
        await deleteLessonMutation({
          lessonId: courseChapters[chapterIndex].lessons[lessonIndex]._id,
        });

        setCourseChapters((prevChapters) => {
          const updatedChapters = [...prevChapters];
          const updatedChapter = { ...updatedChapters[chapterIndex] };
        
          updatedChapter.lessons = updatedChapter.lessons.filter(
            (_, index) => index !== lessonIndex
          );
        
          updatedChapters[chapterIndex] = updatedChapter;
          return updatedChapters;
        });

        toast.success("Lesson deleted successfully");
      } catch (error) {
        console.error("Error deleting lesson:", error);
      }
    }
  };

  if (courseLoading) {
    return <Loader />;
  }

  return (
    <div className="course-form">
      <h1>{course.courseName}</h1>
      {courseChapters &&
        Array.isArray(courseChapters) &&
        courseChapters.map((chapter, chapterIndex) => (
          <div className="chapter" key={chapterIndex}>
            <div className="chapter-header">
              <div className="input-container">
                <label className="label">Chapter Name:</label>
                <input
                  className="input"
                  type="text"
                  value={chapter.name}
                  onChange={(e) =>
                    handleChapterNameChange(chapterIndex, e.target.value)
                  }
                />
              </div>
              <div className="input-container">
                <label className="label">Chapter Description:</label>
                <textarea
                  className="input"
                  value={chapter.description}
                  onChange={(e) =>
                    handleChapterDescriptionChange(chapterIndex, e.target.value)
                  }
                />
              </div>
            </div>
            <div className="lessons">
              {chapter.lessons.map((lesson, lessonIndex) => (
                <div className="lesson" key={lessonIndex}>
                  <button
                    className="delete-lesson-btn"
                    style={{ backgroundColor: "red", color: "white" }}
                    onClick={() =>
                      handleLessonDelete(chapterIndex, lessonIndex)
                    }
                  >
                    &#10006;
                  </button>
                  <div className="input-container">
                    <label className="label">Lesson Name:</label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonNameChange(
                          chapterIndex,
                          lessonIndex,
                          e.target.value
                        )
                      }
                      className="input"
                    />
                  </div>
                  <div className="input-container">
                    <label className="label">Lesson Number:</label>
                    <input
                      type="number"
                      value={lesson.number}
                      onChange={(e) =>
                        handleLessonDetailsChange(
                          chapterIndex,
                          lessonIndex,
                          "number",
                          e.target.value
                        )
                      }
                      className="input"
                    />
                  </div>
                  <div className="input-container">
                    <label className="label">Lesson Title:</label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonDetailsChange(
                          chapterIndex,
                          lessonIndex,
                          "title",
                          e.target.value
                        )
                      }
                      className="input"
                    />
                  </div>
                  <div className="input-container">
                    <label className="label">Lesson Description:</label>
                    <textarea
                      value={lesson.description}
                      onChange={(e) =>
                        handleLessonDetailsChange(
                          chapterIndex,
                          lessonIndex,
                          "description",
                          e.target.value
                        )
                      }
                      className="input"
                    />
                  </div>
                  <div className="input-container">
                    <label className="label">Video File:</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setNewLesson((prevLesson) => ({
                          ...prevLesson,
                          videoFile: e.target.files[0],
                        }))
                      }
                      className="input"
                    />
                  </div>

                  <button
                    className="update-lesson-btn"
                    onClick={() =>
                      handleUpdateLesson(chapterIndex, lessonIndex)
                    }
                  >
                    Update Lesson
                  </button>
                </div>
              ))}
              <button
                className="upload-btn"
                onClick={() => handleAddLesson(chapterIndex)}
              >
                Add Lesson
              </button>
              <button
                className="update-chapter-btn"
                onClick={() => handleUpdateChapter(chapterIndex)}
              >
                Update Chapter
              </button>
            </div>
          </div>
        ))}
      <button className="upload-btn" onClick={() => handleAddChapter()}>
        Add Chapter
      </button>
      <button className="upload-btn" onClick={handleSubmit}>
        Submit
      </button>

      <Modal
        show={showChapterModal}
        onCancel={() => setShowChapterModal(false)}
        header="Add Chapter"
        footerClass="modal__footer-profile"
        footer={
          <React.Fragment>
            <button
              className="cancel-button"
              onClick={() => setShowChapterModal(false)}
            >
              Cancel
            </button>
            <button className="add-button" onClick={handleChapterModalSubmit}>
              Add Chapter
            </button>
          </React.Fragment>
        }
      >
        <div className="input-container">
          <label className="label">Chapter Name:</label>
          <textarea
            className="input"
            value={newChapter.name}
            onChange={(e) =>
              setNewChapter((prevChapter) => ({
                ...prevChapter,
                name: e.target.value,
              }))
            }
          />
        </div>
        <div className="input-container">
          <label className="label">Chapter Description:</label>
          <textarea
            className="input"
            value={newChapter.description}
            onChange={(e) =>
              setNewChapter((prevChapter) => ({
                ...prevChapter,
                description: e.target.value,
              }))
            }
          />
        </div>
      </Modal>

      <Modal
        show={showLessonModal}
        onCancel={() => setShowLessonModal(false)}
        header="Add Lesson"
        footer={
          <React.Fragment>
            <button
              className="cancel-button"
              onClick={() => setShowLessonModal(false)}
            >
              Cancel
            </button>
            <button className="add-button" onClick={()=>handleLessonModalSubmit(chIndex)}>
              Add Lesson
            </button>
          </React.Fragment>
        }
      >
        <div className="input-container">
          <label className="label">Lesson Title:</label>
          <textarea
            value={newLesson.title}
            onChange={(e) =>
              setNewLesson((prevLesson) => ({
                ...prevLesson,
                title: e.target.value,
              }))
            }
            className="input"
          />
        </div>
        <div className="input-container">
          <label className="label">Lesson Number:</label>
          <input
            type="number"
            value={newLesson.number}
            onChange={(e) =>
              setNewLesson((prevLesson) => ({
                ...prevLesson,
                number: e.target.value,
              }))
            }
            className="input"
          />
        </div>
        <div className="input-container">
          <label className="label">Lesson Description:</label>
          <textarea
            value={newLesson.description}
            onChange={(e) =>
              setNewLesson((prevLesson) => ({
                ...prevLesson,
                description: e.target.value,
              }))
            }
            className="input"
          />
        </div>
        <div className="input-container">
          <label className="label">Video File:</label>
          <input
            type="file"
            onChange={(e) =>
              setNewLesson((prevLesson) => ({
                ...prevLesson,
                videoFile: e.target.files[0],
              }))
            }
            className="input"
          />
        </div>
      </Modal>
    </div>
  );
};

export default CourseUpload;