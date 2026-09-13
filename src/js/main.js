import {
  getAllTables,
  getAllTask,
  updateTaskStatus,
  createTable,
} from "./api.js";

import Sortable from "sortablejs";


let tasks = [];
let tables = []

// MODALES
const tableModal = document.getElementById("tableModal");
const taskModal = document.getElementById("taskModal");

const closeTableModal = document.getElementById("closeTableModal");
const createTableButton = document.getElementById("createTable");
const closeTaskModal= document.getElementById("closeTaskModal")


async function loadBoard() {

  tables = await getAllTables();

  tasks = await getAllTask();

  renderTables(tables);

  renderTasks(tasks);

  initSortable();
}

function renderTables(tables) {

  const tableContainer = document.querySelector(".table-container");

  tableContainer.innerHTML = "";


  tables.forEach((table) => {

    const tableElement = document.createElement("section");

    tableElement.classList.add("table");

    tableElement.dataset.statusId = table.id;


    tableElement.innerHTML = `
      <section class="table-header">

        <div class="table-header-details">

          <span class="table-title">
            ${table.name}
          </span>

          <span class="task-count">
            0
          </span>

        </div>


        <button
          type="button"
          class="delete-table-button"
        >

          <span class="material-symbols-outlined">
            delete
          </span>

        </button>

      </section>


      <section class="task-list"></section>


      <button
        type="button"
        class="add-task-button"
      >

        <span class="material-symbols-outlined">
          add
        </span>

        Añadir tarjeta

      </button>
    `;


    tableContainer.appendChild(tableElement);

  });



  const addColumn = document.createElement("section");

  addColumn.classList.add("add-column");

  addColumn.id = "openTableModal";


  addColumn.innerHTML = `
    <button
      type="button"
      class="add-column-button"
    >

      <span class="material-symbols-outlined">
        view_column
      </span>

    </button>

    <span class="add-column-title">
      + Añadir Columna
    </span>
  `;


  tableContainer.appendChild(addColumn);



  addColumn.addEventListener("click", () => {

    tableModal.showModal();

  });

}



function renderTasks(tasks) {

  tasks.forEach((task) => {

    const table = document.querySelector(
      `.table[data-status-id="${task.statusId}"]`
    );

    if (!table) {
      return;
    }


    const taskList = table.querySelector(".task-list");


    const taskElement = document.createElement("article");

    taskElement.classList.add("task-card");

    taskElement.dataset.taskId = task.id;


    taskElement.innerHTML = `
      <div class="task-priority ${task.priority.toLowerCase()}">

        <span class="dot"></span>

        ${task.priority}

      </div>


      <div class="task-title">
        ${task.title}
      </div>


      <div class="task-description">
        ${task.description}
      </div>


      <div class="task-footer">

        <div class="task-date">

          <span class="material-symbols-outlined">
            calendar_today
          </span>

          ${task.dueDate}

        </div>

      </div>
    `;


    taskList.appendChild(taskElement);

  });


  updateTaskCounters();

}

function updateTaskCounters() {

  const tables = document.querySelectorAll(".table");


  tables.forEach((table) => {

    const taskList = table.querySelector(".task-list");

    const counter = table.querySelector(".task-count");


    counter.textContent = taskList.children.length;

  });

}

function initSortable() {

  const taskLists = document.querySelectorAll(".task-list");


  taskLists.forEach((taskList) => {

    new Sortable(taskList, {

      group: "kanban",

      animation: 150,

      ghostClass: "task-ghost",

      chosenClass: "task-chosen",

      dragClass: "task-drag",


      onEnd: async function (event) {

        const taskElement = event.item;

        const taskId = taskElement.dataset.taskId;


        const newTable = event.to.closest(".table");

        const newStatusId = newTable.dataset.statusId;


        console.log(
          `Tarea ${taskId} movida al estado ${newStatusId}`
        );


        await updateTaskStatus(
          taskId,
          newStatusId
        );


        updateTaskCounters();

      },

    });

  });

}


// ==============================
// MODAL TABLA
// ==============================


closeTableModal.addEventListener("click", () => {
  resetModal(tableModal);

  tableModal.close();

});


// Crear tabla

createTableButton.addEventListener("click", async () => {

  const tableNameInput =
    document.getElementById("newTable");


  const tableName =
    tableNameInput.value.trim();


  // Evitar crear una tabla vacía

  if (!tableName) {
    return;
  }


  await createTable(tableName);


  resetModal(tableModal);


  tableModal.close();


  // Volver a cargar el tablero

  await loadBoard();

});



function resetModal(modal) {

  const inputs = modal.querySelectorAll(
    "input, textarea, select"
  );

  inputs.forEach((input) => {

    if (input.tagName === "SELECT") {

      input.selectedIndex = 0;

    } else {

      input.value = "";

    }

  });

}

// ==============================
// MODAL TAREA
// ==============================

function initTaskModal() {

  const tableContainer =
    document.querySelector(".table-container");


  tableContainer.addEventListener("click", (event) => {

    const taskCard =
      event.target.closest(".task-card");


    if (!taskCard) {
      return;
    }


    const taskId =
      taskCard.dataset.taskId;


    const task =
      tasks.find(
        (task) =>
          String(task.id) === String(taskId)
      );


    if (!task) {
      return;
    }


    openTaskModal(task);

  });

}
closeTaskModal.addEventListener("click",()=>{
  resetModal(taskModal);
  taskModal.close();
})


function loadStatusOptions() {

  const statusInput = document.getElementById("modal-status");

  statusInput.innerHTML = "";

  tables.forEach((table) => {

    const option = document.createElement("option");

    option.value = String(table.id);
    option.textContent = table.name;

    statusInput.appendChild(option);

  });
}

function openTaskModal(task= null, statusId= null) {
 const isEditing = task !== null;
  console.log("Tarea seleccionada:", task);
 const titleInput = document.getElementById("modal-task-title");
  const priorityInput = document.getElementById("modal-priority");
  const statusInput = document.getElementById("modal-status");
  const dateInput = document.getElementById("modal-date");
  const descriptionInput = document.getElementById("modal-description");

  const deleteButton = document.getElementById("deleteTask");
  const saveButton = document.getElementById("saveTask");

    loadStatusOptions();
 if (!isEditing) {
    if (statusId !== null) {
      statusInput.value = String(statusId);
    } else {
      statusInput.selectedIndex = 0;
    }
    deleteButton.style.display = "none";
    saveButton.textContent = "Crear Tarea";
      taskModal.showModal();
  }
else{
      titleInput.value = task.title || "";

    priorityInput.value = task.priority || "Media";
    statusInput.value = String(task.statusId);

    dateInput.value = task.dueDate || "";

    descriptionInput.value = task.description || "";

    // Mostrar eliminar
    deleteButton.style.display = "flex";

    // Cambiar texto
    saveButton.textContent = "Guardar Cambios";
  }

  taskModal.dataset.taskId = isEditing
    ? task.id
    : "";

  taskModal.showModal();
}






// ==============================
// INICIALIZAR
// ==============================

initTaskModal();

loadBoard();