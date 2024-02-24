import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

const CardTodo = ({ todo, onDelete, onComplete }) => {

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("idUser");

  const handleComplete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/task/${todo.id}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });
      const data = await response.json();
      onComplete(data.id);
    } catch (error) {
      console.error("Error completing todo:", error);
    }
  };

  return (
    <div className="todo-list-item flex w-full justify-between bg-gray-900 text-white p-3 rounded mb-3">
      <div>
        <h3 className="text-green-500 text-bold text-2xl">{todo.title}</h3>
        <p className="text-gray-300 mt-2">{todo.description}</p>
        {/* {todo.is_completed && (
          <p className="text-gray-300">
            <i>Completed at: {todo.is_completed}</i>
          </p>
        )} */}
      </div>
      <div className="flex items-center">
        <AiOutlineDelete title="Delete?" className="icon" onClick={() => onDelete(todo.id)} />
        {!todo.is_completed && (
          <BsCheckLg title="Completed?" className="check-icon" onClick={() => onComplete(todo.id)} />
        )}
      </div>
    </div>
  );
};

export default CardTodo;
