// Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputTodo from "./Todo/InputTodo";
import ListTodo from "./Todo/ListTodo";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('idUser');

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
    }
  }, [token, userId, navigate]);

  const [allTodos, setAllTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  const handleAddNewToDo = async (newTodo) => {
    try {
      const response = await fetch("http://localhost:5000/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTodo.title,
          description: newTodo.description,
        }),
      });
      const data = await response.json();

      let updatedTodoArr = [...allTodos, data];
      setAllTodos(updatedTodoArr);
      localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
    } catch (error) {
      console.error("Error adding new todo:", error);
    }
  };

  useEffect(() => {
    let savedTodos = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedToDos = JSON.parse(
      localStorage.getItem("completedTodos")
    );
    if (savedTodos) {
      setAllTodos(savedTodos);
    }

    if (savedCompletedToDos) {
      setCompletedTodos(savedCompletedToDos);
    }
  }, []);

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/task/${id}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_completed: true,
        }),
      });

      if (response.ok) {
        let updatedCompletedList = [...completedTodos, id];
        setCompletedTodos(updatedCompletedList);
        localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedList));

        // Filter out the completed todo from allTodos
        let updatedTodoArr = allTodos.filter(todo => todo.id !== id);
        localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
        setAllTodos(updatedTodoArr);
      } else {
        console.error("Failed to mark task as complete:", response.statusText);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleToDoDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/task/${id}/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Filter out the deleted todo from allTodos
        let reducedTodos = allTodos.filter(todo => todo.id !== id);
        localStorage.setItem("todolist", JSON.stringify(reducedTodos));
        setAllTodos(reducedTodos);
      } else {
        console.error("Failed to delete task:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen overflow-hidden">
      <h1 className="text-center pt-3">My Todos</h1>

      <div className="todo-wrapper bg-gray-700 p-2 w-fit m-auto mt-3 max-h-80vh overflow-y-auto shadow-md rounded p-5">
        <InputTodo onAdd={(newTodo) => handleAddNewToDo(newTodo)} />
        <div className="btn-area mb-5 flex justify-center">
          <button
            className={`bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded ${!isCompletedScreen ? 'bg-green-500' : ''}`} 
            onClick={() => setIsCompletedScreen(false)}
          >
            To Do
          </button>
          <button
            className={`bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded ml-2 ${isCompletedScreen ? 'bg-green-500' : ''}`} 
            onClick={() => setIsCompletedScreen(true)}
          >
            Completed
          </button>
        </div>
        <ListTodo
          todos={isCompletedScreen ? completedTodos : allTodos}
          onDelete={(id) => handleToDoDelete(id)}
          onComplete={(id) => handleComplete(id, isCompletedScreen)}
          showCompleted={isCompletedScreen}
        />
      </div>
    </div>
  );
}

export default Home;
