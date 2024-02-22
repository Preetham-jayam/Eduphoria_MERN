import React, { useState } from "react";
import { useAddChapterMutation } from "../../Slices/teacherApiSlice";
import {toast} from 'react-toastify';

const AddChapter = () => {

  const [newChapter, setNewChapter] = useState({ name: "", description: "" });
  const [addChapter] = useAddChapterMutation();

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(newChapter);
      await addChapter({
        courseId:'65a2c832e29c10e18344a721',
        newChapter: { ...newChapter },
      }).unwrap();
      setNewChapter({ name: "", description: "" });
     toast.success('Chapter added succesfully');
    } catch (error) {
     toast.error(error?.data?.message || "Error occured at adding chapter");
    }
  };

  return (
    <div>
      <h2>Add Chapter</h2>
      <form onSubmit={handleChapterSubmit}>
        <div className="input-container">
          <label className="label">Chapter Name:</label>
          <input
            type="text"
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
            value={newChapter.description}
            onChange={(e) =>
              setNewChapter((prevChapter) => ({
                ...prevChapter,
                description: e.target.value,
              }))
            }
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddChapter;
