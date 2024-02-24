import React, { useState, useEffect } from "react";
import CardTodo from "./CardTodo";

const ListTodo = ({ onDelete, onComplete, showCompleted }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("idUser");

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTodos = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/task/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data && data.status === "success" && Array.isArray(data.data)) {
          setTodos(data.data);
        } else {
          console.error("Invalid todos data:", data);
          setError("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching user's todos:", error);
        setError("Error fetching user's todos");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTodos();
  }, [userId, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Filter todos based on completion status
  const filteredTodos = showCompleted
    ? todos.filter((todo) => todo.is_completed)
    : todos.filter((todo) => !todo.is_completed);

  if (filteredTodos.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <div className="todo-list flex flex-col items-center w-full">
      {filteredTodos.map((item) => (
        <CardTodo
          key={item.id}
          todo={item}
          onDelete={() => onDelete(item.id)}
          onComplete={() => onComplete(item.id)}
        />
      ))}
    </div>
  );
};

export default ListTodo;
