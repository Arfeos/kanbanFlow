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
            name: name
        });

        return responsePost.data;

    } catch (error) {
        console.error("Error al crear tabla:", error);
    }
}
// export async function DeleteTable(id) {
//   const response= axios.get(`${API_URL}`)
  
// }
