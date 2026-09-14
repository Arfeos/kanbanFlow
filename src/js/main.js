import {
  getAllTables,
  getAllTask,
  getAllComments,
  getAllUsers,
  updateTaskStatus,
  createTask,
  createTable,
  updateTask,
  createComment,
  deleteTable,
  deleteTask,
  getAllSubTasks,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "./api.js";

import Sortable from "sortablejs";

let tasks = [];
let tables = [];
let subTasks = [];
let activeTableId = null;
let searchText = "";
let selectedPriority = "Todas";
// MODALES
const tableModal = document.getElementById("tableModal");
const taskModal = document.getElementById("taskModal");

const closeTableModal = document.getElementById("closeTableModal");
const createTableButton = document.getElementById("createTable");
const closeTaskModal = document.getElementById("closeTaskModal");
const createTaskBtn = document.getElementById("createTaskBtn");
const saveButton = document.getElementById("saveData");
const publishCommentButton = document.getElementById("publishComment");
const deleteTaskButton = document.getElementById("deleteTask");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileTableName = document.getElementById("mobileTableName");
const mobileTableOptions = document.getElementById("mobileTableOptions");
const priorityButtons = document.querySelectorAll(".priority");
const addSubTaskButton = document.getElementById("addSubTask");
const subtaskSection= document.querySelector(".subtasks-section")
async function loadBoard() {
  tables = await getAllTables();
  tasks = await getAllTask();
  subTasks = await getAllSubTasks();

  renderTables(tables);
  renderTasks(tasks);
  initSortable();

  setupMobileMenu();
}
function setupMobileMenu() {
  if (!tables.length) return;

  if (
    !activeTableId ||
    !tables.some((table) => String(table.id) === String(activeTableId))
  ) {
    activeTableId = tables[0].id;
  }

  mobileTableOptions.innerHTML = "";

  tables.forEach((table) => {
    const option = document.createElement("button");

    option.type = "button";
    option.textContent = table.name;

    option.addEventListener("click", () => {
      showMobileTable(table.id);
      mobileTableOptions.classList.remove("open");
    });

    mobileTableOptions.appendChild(option);
  });

  showMobileTable(activeTableId);
}
function showMobileTable(tableId) {
  activeTableId = String(tableId);

  const selectedTable = tables.find(
    (table) => String(table.id) === activeTableId,
  );

  if (!selectedTable) return;

  mobileTableName.textContent = selectedTable.name;

  document.querySelectorAll(".table-container .table").forEach((table) => {
    table.classList.toggle(
      "mobile-active",
      String(table.dataset.statusId) === activeTableId,
    );
  });
}
mobileMenuButton.addEventListener("click", () => {
  mobileTableOptions.classList.toggle("open");
});
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
    const addTaskButton = tableElement.querySelector(".add-task-button");

    addTaskButton.addEventListener("click", () => {
      openTaskModal(null, table.id);
    });
    const deleteTableButton = tableElement.querySelector(
      ".delete-table-button",
    );
    deleteTableButton.addEventListener("click", async () => {
      const confirmDelete = confirm(
        `¿Seguro que quieres eliminar la tabla "${table.name}"?`,
      );

      if (!confirmDelete) {
        return;
      }
      const allTasks = await getAllTask();
      const tableTasks = allTasks.filter(
        (task) => String(task.statusId) === String(table.id),
      );

      // Eliminar cada tarea y sus comentarios
      for (const task of tableTasks) {
        await deleteTask(task.id);
      }
      await deleteTable(table.id);
      await loadBoard();
    });
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
      `.table[data-status-id="${task.statusId}"]`,
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

          ${formatDateToTask(task.dueDate)}

        </div>

      </div>
    `;

    taskList.appendChild(taskElement);
    taskElement.addEventListener("click", () => {
      openTaskModal(task);
    });
  });

  updateTaskCounters();
}
function filterTasks() {
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesPriority =
      selectedPriority === "Todas" || task.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });
  document.querySelectorAll(".task-list").forEach((taskList) => {
    taskList.innerHTML = "";
  });

  renderTasks(filteredTasks);
  initSortable();
}
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
  searchText = searchInput.value.trim();
  filterTasks();
});

priorityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    priorityButtons.forEach((button) => {
      button.classList.remove("active");
    });

    button.classList.add("active");

    selectedPriority = button.textContent.trim();

    filterTasks();
  });
});

function updateTaskCounters() {
  const tables = document.querySelectorAll(".table");

  tables.forEach((table) => {
    const taskList = table.querySelector(".task-list");

    const counter = table.querySelector(".task-count");

    counter.textContent = taskList.children.length;
  });
}

function initSortable() {
  if (window.innerWidth <= 600) {
    return;
  }
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

        console.log(`Tarea ${taskId} movida al estado ${newStatusId}`);

        await updateTaskStatus(taskId, newStatusId);
        const task = tasks.find((task) => String(task.id) === String(taskId));

        if (task) {
          task.statusId = newStatusId;
        }
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
  const tableNameInput = document.getElementById("newTable");

  const tableName = tableNameInput.value.trim();

  if (!tableName) {
    alert("debes asignarle un nombre");
    return;
  }
  if (
    tables.find((table) => tableName.toLowerCase() === table.name.toLowerCase())
  ) {
    alert("Ese nombre ya esta en uso");
    return;
  }
  await createTable(tableName);

  resetModal(tableModal);

  tableModal.close();

  await loadBoard();
});

function resetModal(modal) {
  const inputs = modal.querySelectorAll("input, textarea, select");

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

closeTaskModal.addEventListener("click", () => {
  resetModal(taskModal);
  taskModal.close();
});

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
createTaskBtn.addEventListener("click", () => {
  openTaskModal();
});
async function openTaskModal(task = null, statusId = null) {
  const isEditing = task !== null;
  console.log("Tarea seleccionada:", task);

  const titleInput = document.getElementById("modal-task-title");
  const priorityInput = document.getElementById("modal-priority");
  const statusInput = document.getElementById("modal-status");
  const dateInput = document.getElementById("modal-date");
  const descriptionInput = document.getElementById("modal-description");

  const deleteButton = document.getElementById("deleteTask");
  const commentsField = document.getElementById("comments-field");
  const commentsSection = document.getElementById("comments-section");

  loadStatusOptions();
  if (!isEditing) {
    if (statusId !== null) {
      statusInput.value = String(statusId);
    } else {
      statusInput.selectedIndex = 0;
    }
    deleteButton.style.display = "none";
    commentsSection.style.display = "none";
    commentsField.style.display = "none";
    subtaskSection.style.display= "none";
    saveButton.textContent = "Crear Tarea";
    taskModal.showModal();
  } else {
    deleteButton.style.display = "flex";
    commentsSection.style.display = "block";
    commentsField.style.display = "block";
    subtaskSection.style.display= "block";
    titleInput.value = task.title || "";

    priorityInput.value = task.priority || "Media";
    statusInput.value = String(task.statusId);

    dateInput.value = task.dueDate || "";

    descriptionInput.value = task.description || "";

    // Mostrar eliminar
    deleteButton.style.display = "flex";

    // Cambiar texto
    saveButton.textContent = "Guardar Cambios";

    await loadComments(task.id);
    await loadSubTasks(task.id);
  }

  taskModal.dataset.taskId = isEditing ? task.id : "";

  taskModal.showModal();
}
saveButton.addEventListener("click", async () => {
  const taskId = taskModal.dataset.taskId;

  const title = document.getElementById("modal-task-title").value;
  const priority = document.getElementById("modal-priority").value;
  const statusId = document.getElementById("modal-status").value;
  const dueDate = document.getElementById("modal-date").value;
  const description = document.getElementById("modal-description").value;
  if (!title || !priority || !statusId || !dueDate) {
    alert("Debes rellenar todos los campos.");
    return;
  }

  let newTask = {
    title: title,
    priority: priority,
    statusId: statusId,
    dueDate: dueDate,
    description: description,
  };

  if (taskId) {
    console.log("Editando tarea:", taskId);
    console.log(newTask);
    await updateTask(newTask, taskId);
  } else {
    console.log("creando tarea:", newTask);
    await createTask(newTask);
  }
  taskModal.close();
  resetModal(taskModal);
  loadBoard();
});
publishCommentButton.addEventListener("click", async () => {
  const commentInput = document.getElementById("new-comment");

  const text = commentInput.value.trim();

  const taskId = taskModal.dataset.taskId;

  // Comprobar que haya texto
  if (!text) {
    alert("Escribe un comentario antes de publicarlo.");
    return;
  }

  // Comprobar que estamos editando una tarea
  if (!taskId) {
    return;
  }

  const newComment = {
    taskId: String(taskId),
    authorId: "10001",
    text: text,
    createdAt: new Date().toISOString(),
  };
  console.log("Creando comentario:", newComment);
  await createComment(newComment);
  commentInput.value = "";
  await loadComments(taskId);
});
deleteTaskButton.addEventListener("click", async () => {
  const taskId = taskModal.dataset.taskId;
  console.log(taskId);
  if (!taskId) {
    return;
  }
  const confirmDelete = confirm("¿Seguro que quieres eliminar esta tarea?");
  if (!confirmDelete) {
    return;
  }
  await deleteTask(taskId);
  taskModal.close();
  resetModal(taskModal);
  await loadBoard();
});

async function loadSubTasks(taskId) {
  const subTasksField = document.getElementById("subtasks-field");
  const subTasksCount = document.getElementById("subtasks-count");

  subTasksField.innerHTML = "";

  const taskSubTasks = subTasks.filter(
    (subTask) => String(subTask.taskId) === String(taskId),
  );

  subTasksCount.textContent = taskSubTasks.length;

  taskSubTasks.forEach((subTask) => {
    const subTaskElement = document.createElement("div");

    subTaskElement.classList.add("subtask");

    subTaskElement.innerHTML = `
      <input
        type="checkbox"
        class="subtask-checkbox"
        ${subTask.done ? "checked" : ""}
      >

      <input
        type="text"
        class="subtask-name"
        value="${subTask.name}"
      >

      <button
        type="button"
        class="delete-subtask"
      >
        <span class="material-symbols-outlined">
          delete
        </span>
      </button>
    `;

    const checkbox = subTaskElement.querySelector(".subtask-checkbox");

    checkbox.addEventListener("change", async () => {
      const updatedSubTask = await updateSubTask(subTask.id, {
        done: checkbox.checked,
      });

      if (updatedSubTask) {
        subTask.done = checkbox.checked;
      }
    });

    const nameInput = subTaskElement.querySelector(".subtask-name");

    nameInput.addEventListener("change", async () => {
      const name = nameInput.value.trim();

      if (!name) {
        nameInput.value = subTask.name;
        return;
      }

      const updatedSubTask = await updateSubTask(subTask.id, {
        name: name,
      });

      if (updatedSubTask) {
        subTask.name = name;
      }
    });

    const deleteButton = subTaskElement.querySelector(".delete-subtask");

    deleteButton.addEventListener("click", async (event) => {
      event.stopPropagation();

      await deleteSubTask(subTask.id);

      subTasks = subTasks.filter(
        (item) => String(item.id) !== String(subTask.id),
      );

      await loadSubTasks(taskId);
    });

    subTasksField.appendChild(subTaskElement);
  });
}
addSubTaskButton.addEventListener("click", async () => {

  const taskId = taskModal.dataset.taskId;

  if (!taskId) {
    return;
  }

  const nameInput = document.getElementById("new-subtask");

  const name = nameInput.value.trim();

  if (!name) {
    return;
  }

  const newSubTask = await createSubTask(taskId, name);

  if (newSubTask) {

    subTasks.push(newSubTask);

    nameInput.value = "";

    await loadSubTasks(taskId);
  }
});
// ==============================
// INICIALIZAR
// ==============================

loadBoard();

// ==============================
// LOADERS
// ==============================

async function loadComments(taskId) {
  const commentsField = document.getElementById("comments-field");
  const commentsCount = document.querySelector(".comments-count");

  commentsField.innerHTML = "";

  const comments = await getAllComments();
  const users = await getAllUsers();

  const taskComments = comments.filter(
    (comment) => String(comment.taskId) === String(taskId),
  );

  commentsCount.textContent = taskComments.length;

  taskComments.forEach((comment) => {
    const user = users.find(
      (user) => String(user.id) === String(comment.authorId),
    );

    const commentElement = document.createElement("article");

    commentElement.classList.add("comment");

    commentElement.innerHTML = `
      <div class="comment-avatar">
        ${user ? user.name.substring(0, 2).toUpperCase() : "??"}
      </div>

      <div class="comment-content">

        <div class="comment-header">
          <strong>${user ? user.name : "Usuario desconocido"}</strong>

          <span>
            ${formatDateToComment(comment.createdAt)}
          </span>
        </div>

        <p>
          ${comment.text}
        </p>
      </div>
    `;

    commentsField.appendChild(commentElement);
  });
}
function formatDateToComment(date) {
  return new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function formatDateToTask(date) {
  return new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
