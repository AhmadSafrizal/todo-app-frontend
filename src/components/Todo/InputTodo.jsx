import React, { useState, useEffect } from "react";

const InputTodo = ({ onAdd }) => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("idUser");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [token]);

  // console.log("Categories : ", categories)

  const handleAddTodo = async () => {
    try {
      console.log("newTodoTitle:", newTodoTitle);
      console.log("newDescription:", newDescription);
      console.log("category:", category);
      console.log("dueDate:", dueDate);
  
      const response = await fetch(`http://localhost:5000/api/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          title: newTodoTitle.trim(),
          description: newDescription,
          category_id: parseInt(category, 10),
          due_date: new Date(dueDate).toISOString(),
        }),
      });
      const data = await response.json();
  
      onAdd(data);
      setNewTodoTitle("");
      setNewDescription("");
      setCategory("");
      setDueDate("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  

  return (
    <div className="todo-input flex items-center justify-center border-b-1 border-gray-500 pb-5 mb-5">
      <div className="todo-input-item mr-5 flex flex-col items-start">
        <label className="mb-2 font-bold">Title:</label>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="What's the title of your To Do?"
          className="border-none p-2 w-64 text-gray-500"
        />
      </div>
      <div className="todo-input-item mr-5 flex flex-col items-start">
        <label className="mb-2 font-bold">Description:</label>
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="What's the description of your To Do?"
          className="border-none p-2 w-64 text-gray-500"
        />
      </div>
      <div className="todo-input-item mr-5 flex flex-col items-start">
        <label className="mb-2 font-bold">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-none p-2 w-64 text-gray-500"
        >
          <option value="">Select category...</option>
          {Array.isArray(categories.data) && categories.data.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="todo-input-item mr-5 flex flex-col items-start">
        <label className="mb-2 font-bold">Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border-none p-2 text-gray-500"
        />
      </div>
      <div className="todo-input-item">
        <button
          className="bg-green-500 text-white border-none mt-7 p-2 w-16 cursor-pointer"
          type="button"
          onClick={handleAddTodo}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default InputTodo;
