import axios from "axios";

const API_URL = "http://localhost:3000/";

export async function getAllTables() {
  const response = await axios.get(`${API_URL}tables`);

  return response.data;
}

export async function getAllTask() {
  const response = await axios.get(`${API_URL}tasks`);

  return response.data;
}

export async function getAllComments() {
  const response = await axios.get(`${API_URL}comments`);

  return response.data;
}
export async function getAllUsers() {
  const response = await axios.get(`${API_URL}users`);

  return response.data;
}
export async function getAllSubTasks() {
  const response = await axios.get(`${API_URL}SubTask`);

  return response.data;
}

export async function updateTaskStatus(taskId, statusId) {
  try {
    const response = await axios.patch(`${API_URL}tasks/${taskId}`, {
      statusId: statusId,
    });

    console.log(`Tarea ${taskId} actualizada correctamente`, response.data);
  } catch (error) {
    console.error("Error actualizando la tarea:", error);
  }
}
export async function createTable(name) {
  try {
    const responsePost = await axios.post(`${API_URL}tables`, {
      name: name,
    });

    return responsePost.data;
  } catch (error) {
    console.error("Error al crear tabla:", error);
  }
}
export async function createTask(params) {
  try {
    const response = await axios.post(`${API_URL}tasks`, {
      id: 0,
      title: params.title,
      priority: params.priority,
      statusId: params.statusId,
      dueDate: params.dueDate,
      description: params.description,
    });
    return response.data;
  } catch (error) {
    console.error("Error creando la tarea:", error);
  }
}
export async function updateTask(params, id) {
  try {
    const response = await axios.put(`${API_URL}tasks/${id}`, {
      title: params.title,
      priority: params.priority,
      statusId: params.statusId,
      dueDate: params.dueDate,
      description: params.description,
    });
    return response.data;
  } catch (error) {
    console.error("Error actualizar la tarea:", error);
  }
}

export async function createComment(comment) {
  try {
    const response = await axios.post(`${API_URL}comments`, comment);

    return response.data;
  } catch (error) {
    console.error("Error al crear el comentario:", error);
  }
}
export async function deleteTable(tableId) {
  try {
    await axios.delete(`${API_URL}tables/${tableId}`);

    console.log(`Tabla ${tableId} eliminada correctamente`);
  } catch (error) {
    console.error("Error al eliminar la tabla:", error);
  }
}
async function deleteCommentsByTask(taskId) {
  try {
    const response = await axios.get(`${API_URL}comments`);

    const comments = response.data.filter(
      (comment) => String(comment.taskId) === String(taskId),
    );

    for (const comment of comments) {
      await axios.delete(`${API_URL}comments/${comment.id}`);
    }

    console.log(`Comentarios de la tarea ${taskId} eliminados`);
  } catch (error) {
    console.error("Error eliminando los comentarios:", error);
    throw error;
  }
}
export async function deleteTask(taskId) {
  try {
    await deleteCommentsByTask(taskId);
    await deleteSubTasksByTask(taskId);
    await axios.delete(`${API_URL}tasks/${taskId}`);

    console.log(`Tarea ${taskId} eliminada correctamente`);
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
  }
}

export async function createSubTask(taskId, name) {
  try {
    const response = await axios.post(`${API_URL}SubTask`, {
      taskId: String(taskId),
      name: name,
      done: false,
    });

    return response.data;
  } catch (error) {
    console.error("Error creando subtarea:", error);
  }
}

export async function updateSubTask(subTaskId, data) {
  try {
    const response = await axios.patch(`${API_URL}SubTask/${subTaskId}`, data);

    return response.data;
  } catch (error) {
    console.error("Error actualizando subtarea:", error);
  }
}

export async function deleteSubTask(subTaskId) {
  try {
    await axios.delete(`${API_URL}SubTask/${subTaskId}`);

    console.log(`Subtarea ${subTaskId} eliminada correctamente`);
  } catch (error) {
    console.error("Error eliminando subtarea:", error);
  }
}

async function deleteSubTasksByTask(taskId) {
  try {
    const response = await axios.get(`${API_URL}SubTask`);

    const subTasks = response.data.filter(
      (subTask) => String(subTask.taskId) === String(taskId),
    );

    for (const subTask of subTasks) {
      await axios.delete(`${API_URL}SubTask/${subTask.id}`);
    }

    console.log(`Subtareas de la tarea ${taskId} eliminadas`);
  } catch (error) {
    console.error("Error eliminando las subtareas:", error);
    throw error;
  }
}
