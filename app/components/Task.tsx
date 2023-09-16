"use client";
import { ITask } from "@/types/tasks";
import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { useState, FormEventHandler } from "react";
import Swal from "sweetalert2";
import { deleteTodo, editTodo } from "@/api";

interface TaskProps {
  task: ITask;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.text);

  const handleEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await editTodo({
      id: task.id,
      text: taskToEdit
    })

    setTaskToEdit("");
    setOpenModalEdit(false);

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: "Saving to task",
    }).then(() => {
      window.location.reload();
    });
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id)
    setOpenModalDelete(false)
    window.location.reload();
  }

  return (
    <tr key={task.id}>
      <td className="text-lg w-full">{task.text}</td>
      <td className="flex gap-5">
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor="pointer"
          size={25}
          className="text-blue-500"
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleEdit}>
            <h3 className="font-bold text-lg">Edit task</h3>
            <div className="modal-action">
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type="text"
                placeholder="Type here"
                className="input input-bordered input-info w-full"
              />
              <button type="submit" className="btn">
                Add
              </button>
            </div>
          </form>
        </Modal>

        <FiTrash2 onClick={()=> setOpenModalDelete(true)} cursor="pointer" size={25} className="text-red-500" />
        <Modal modalOpen={openModalDelete} setModalOpen={setOpenModalDelete}>
            <h3 className="text-lg">ต้องการลบใช่หรือไม่?</h3>
            <div className="modal-action">
              <button onClick={()=>handleDelete(task.id)} className="btn bg-red-500">Yes</button>
            </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
