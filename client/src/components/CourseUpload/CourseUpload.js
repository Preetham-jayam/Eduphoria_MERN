import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CourseUpload.css";
import { toast } from "react-toastify";
import {
  useGetCourseDetailsQuery,
  useDeleteLessonMutation,
  useUpdateChapterMutation,
  useUpdateLessonMutation,
} from "../../Slices/courseApiSlice";
import Button from "../../shared/components/FrontendTools/Button";
import {
  useAddChapterMutation,
  useAddLessonMutation,
} from "../../Slices/teacherApiSlice";
import Loader from "../Loader/Loader";
import Modal from "../../shared/components/FrontendTools/Modal";

const CourseUpload = () => {
  const { id: courseId } = useParams();
  const {
    data: courseData,
    isLoading: courseLoading,
    isError: courseError,
    refetch: refetchCourseData,
  } = useGetCourseDetailsQuery(courseId);
  const [course, setCourse] = useState({});
  const [chIndex, setChIndex] = useState(null);
  const [courseChapters, setCourseChapters] = useState([]);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showChapterUpdateModal,setShowChapterUpdateModal]=useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showLessonUpdateModal, setShowLessonUpdateModal] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [newChapter, setNewChapter] = useState({ name: "", description: "" });
  const [newLesson, setNewLesson] = useState({
    title: "",
    number: 0,
    description: "",
    videoFile: null,
  });
  const [editedChapter, setEditedChapter] = useState({
    name: "",
    description: "",
  });
  const [editedLesson, setEditedLesson] = useState({
    title: "",
    number: 0,
    description: "",
    videoFile: null,
  });

  const [deleteLessonMutation] = useDeleteLessonMutation();
  const [addChapterMutation] = useAddChapterMutation();
  const [addLessonMutation] = useAddLessonMutation();
  const [updateChapterMutation] = useUpdateChapterMutation();
  const [updateLessonMutation] = useUpdateLessonMutation();

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

  const handleEditChapter = (chapterIndex) => {
    const chapterToEdit = courseChapters[chapterIndex];
    setEditedChapter({
      name: chapterToEdit.name,
      description: chapterToEdit.description,
    });
    setCurrentChapterIndex(chapterIndex);
    setShowChapterUpdateModal(true);
  };

  const handleChapterUpdate = async () => {
    try {
      const updatedChapter = await updateChapterMutation({
        chapterId: courseChapters[currentChapterIndex]._id,
        chapter: {
          name: editedChapter.name,
          description: editedChapter.description,
        },
      });

      setCourseChapters((prevChapters) => {
        const updatedChapters = [...prevChapters];
        updatedChapters[currentChapterIndex] = updatedChapter;
        return updatedChapters;
      });

      toast.success("Chapter updated successfully");
      setShowChapterUpdateModal(false);
    } catch (error) {
      console.error("Error updating chapter:", error);
      toast.error("Failed to update chapter. Please try again.");
    }
  };

  const handleAddChapter = async () => {
    setShowChapterModal(true);
  };

  const handleChapterModalSubmit = async () => {
    try {
      await addChapterMutation({
        courseId,
        newChapter: {
          name: newChapter.name,
          description: newChapter.description,
          lessons: [],
        },
      });

      setCourseChapters((prevChapters) => [...prevChapters, newChapter]);

      toast.success("Chapter added succesfully");
      refetchCourseData();
      setShowChapterModal(false);
      setNewChapter({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const handleAddLesson = async (chapterIndex) => {
    setChIndex(chapterIndex);
    setShowLessonModal(true);
  };
  
  const handleLessonModalSubmit = async (chapterIndex) => {
    try {
      const formData = new FormData();
      formData.append("chapterId", courseChapters[chapterIndex]._id);
      formData.append("number", newLesson.number);
      formData.append("title", newLesson.title);
      formData.append("description", newLesson.description);
      formData.append("videoFile", newLesson.videoFile);
      formData.append("checked", 0);

      const response = await addLessonMutation({
        chapterId: courseChapters[chapterIndex]._id,
        lesson: formData,
      });

      const { data: newLessonData } = response;

      if (newLessonData) {
        setCourseChapters((prevChapters) => {
          const updatedChapters = [...prevChapters];
          const updatedChapter = { ...updatedChapters[chapterIndex] };

          updatedChapter.lessons = [
            ...updatedChapter.lessons,
            newLessonData.lesson,
          ];

          updatedChapters[chapterIndex] = updatedChapter;
          return updatedChapters;
        });

        toast.success("Lesson Added Successfully");
        setShowLessonModal(false);
        setNewLesson({ title: "", number: 0, description: "", videoUrl: "" });
      } else {
        console.error("Error: No data returned from addLessonMutation");
      }
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast.error("Error adding lesson. Please try again.");
    }
  };

  const handleEditLesson = (chapterIndex, lessonIndex) => {
    const lessonToEdit = courseChapters[chapterIndex].lessons[lessonIndex];
    setEditedLesson({
      title: lessonToEdit.title,
      number: lessonToEdit.number,
      description: lessonToEdit.description,
      videoFile: lessonToEdit.videoUrl,
    });
    setCurrentChapterIndex(chapterIndex);
    setCurrentLessonIndex(lessonIndex);
    setShowLessonUpdateModal(true);
  };

  const handleLessonUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("chapterId", courseChapters[currentChapterIndex]._id);
      formData.append("number", editedLesson.number);
      formData.append("title", editedLesson.title);
      formData.append("description", editedLesson.description);

      if (editedLesson.videoFile) {
        formData.append("videoFile", editedLesson.videoFile);
      } else {
        formData.append(
          "videoUrl",
          courseChapters[currentChapterIndex].lessons[currentLessonIndex]
            .videoUrl
        );
      }

      formData.append("checked", 0);

      const lessondata = formData;
      console.log(lessondata);

      const response = await updateLessonMutation({
        lessonId:
          courseChapters[currentChapterIndex].lessons[currentLessonIndex]._id,
        lesson: formData,
      });

      const { data: updatedLesson } = response;

      if (updatedLesson) {
        refetchCourseData();
        toast.success("Lesson updated successfully");
        setShowLessonUpdateModal(false);
      } else {
        console.error("Error: No data returned from updateLessonMutation");
        toast.error("Failed to update lesson. Please try again.");
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson. Please try again.");
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
                  readOnly
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
                  readOnly
                  className="input"
                  value={chapter.description}
                  onChange={(e) =>
                    handleChapterDescriptionChange(chapterIndex, e.target.value)
                  }
                />
              </div>
            </div>
            <div className="lessons">
              {chapter.lessons &&
                chapter.lessons.map((lesson, lessonIndex) => (
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
                        readOnly
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
                        readOnly
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
                        readOnly
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
                        readOnly
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

                    <div className="video-container">
                      <video
                        controls
                        style={{ width: "300px", height: "200px" }}
                      >
                        <source
                          src={`${lesson.videoUrl}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <button
                      className="update-lesson-btn"
                      onClick={() =>
                        handleEditLesson(chapterIndex, lessonIndex)
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
                onClick={() => handleEditChapter(chapterIndex)}
              >
                Update Chapter
              </button>
            </div>
          </div>
        ))}
      <button className="upload-btn" onClick={() => handleAddChapter()}>
        Add Chapter
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
        show={showChapterUpdateModal}
        onCancel={() => setShowChapterUpdateModal(false)}
        header="Edit Chapter"
        footerClass="modal__footer-profile"
        footer={
          <React.Fragment>
            <button
              className="cancel-button"
              onClick={() => setShowChapterUpdateModal(false)}
            >
              Cancel
            </button>
            <Button
              className="update-button"
              onClick={() => handleChapterUpdate()}
            >
              Update Chapter
            </Button>
          </React.Fragment>
        }
      >
        <div className="input-container">
          <label className="label">Chapter Name:</label>
          <textarea
            className="input"
            value={editedChapter.name}
            onChange={(e) =>
              setEditedChapter((prevChapter) => ({
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
            value={editedChapter.description}
            onChange={(e) =>
              setEditedChapter((prevChapter) => ({
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
            <button
              className="add-button"
              onClick={() => handleLessonModalSubmit(chIndex)}
            >
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
            name="video"
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

      <Modal
        show={showLessonUpdateModal}
        onCancel={() => setShowLessonUpdateModal(false)}
        header="Edit Lesson"
        footerClass="modal__footer-profile"
        footer={
          <React.Fragment>
            <button
              className="cancel-button"
              onClick={() => setShowLessonUpdateModal(false)}
            >
              Cancel
            </button>
            <Button className="update-button" onClick={handleLessonUpdate}>
              Update Lesson
            </Button>
          </React.Fragment>
        }
      >
        <div className="input-container">
          <label className="label">Lesson Title:</label>
          <input
            className="input"
            value={editedLesson.title}
            onChange={(e) =>
              setEditedLesson((prevLesson) => ({
                ...prevLesson,
                title: e.target.value,
              }))
            }
          />
        </div>
        <div className="input-container">
          <label className="label">Lesson Number:</label>
          <input
            className="input"
            type="number"
            value={editedLesson.number}
            onChange={(e) =>
              setEditedLesson((prevLesson) => ({
                ...prevLesson,
                number: e.target.value,
              }))
            }
          />
        </div>
        <div className="input-container">
          <label className="label">Lesson Description:</label>
          <textarea
            className="input"
            value={editedLesson.description}
            onChange={(e) =>
              setEditedLesson((prevLesson) => ({
                ...prevLesson,
                description: e.target.value,
              }))
            }
          />
        </div>
        <div className="input-container">
          <label className="label">Current Video:</label>
          <video controls style={{ width: "100%" }}>
            <source
              src={`${editedLesson.videoFile}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="input-container">
          <label className="label">Choose New Video:</label>
          <input
            name="video"
            type="file"
            accept="video/mp4"
            onChange={(e) =>
              setEditedLesson((prevLesson) => ({
                ...prevLesson,
                videoFile: e.target.files[0],
              }))
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default CourseUpload;
