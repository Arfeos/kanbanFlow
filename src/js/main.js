import { getAllTables, getAllTask } from './api.js';
import Sortable from 'sortablejs';


async function loadBoard() {

    const tables = await getAllTables();
    const tasks = await getAllTask();

    console.log('Tablas:', tables);
    console.log('Tareas:', tasks);

    renderTables(tables);
    renderTasks(tasks);

    initSortable();
}


function renderTables(tables) {

    const tableContainer = document.querySelector('.table-container');

    tableContainer.innerHTML = '';

    tables.forEach(table => {

        const tableElement = document.createElement('section');

        tableElement.classList.add('table');

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

                <button class="add-card-button">

                    <span class="material-symbols-outlined">
                        add
                    </span>

                </button>

            </section>

            <section class="task-list"></section>

            <button class="add-task-button">

                <span class="material-symbols-outlined">
                    add
                </span>

                Añadir tarjeta

            </button>
        `;

        tableContainer.appendChild(tableElement);
    });
}


function renderTasks(tasks) {

    tasks.forEach(task => {

        const table = document.querySelector(
            `.table[data-status-id="${task.statusId}"]`
        );

        if (!table) {
            return;
        }

        const taskList = table.querySelector('.task-list');

        const taskElement = document.createElement('article');

        taskElement.classList.add('task-card');

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

    const tables = document.querySelectorAll('.table');

    tables.forEach(table => {

        const taskList = table.querySelector('.task-list');

        const counter = table.querySelector('.task-count');

        counter.textContent = taskList.children.length;

    });
}


function initSortable() {

    const taskLists = document.querySelectorAll('.task-list');

    taskLists.forEach(taskList => {

        new Sortable(taskList, {

            group: 'kanban',

            animation: 150,

            ghostClass: 'task-ghost',

            chosenClass: 'task-chosen',

            dragClass: 'task-drag',

            onEnd: async function (event) {

                const taskElement = event.item;

                const taskId = taskElement.dataset.taskId;

                const newTable = event.to.closest('.table');

                const newStatusId = newTable.dataset.statusId;

                console.log(
                    `Tarea ${taskId} movida al estado ${newStatusId}`
                );

                await updateTaskStatus(taskId, newStatusId);

                updateTaskCounters();
            }
        });
    });
}


async function updateTaskStatus(taskId, statusId) {

    try {

        const response = await fetch(
            `http://localhost:3000/tasks/${taskId}`,
            {
                method: 'PATCH',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    statusId: statusId
                })
            }
        );

        if (!response.ok) {
            throw new Error('No se pudo actualizar la tarea');
        }

        console.log(
            `Tarea ${taskId} actualizada correctamente`
        );

    } catch (error) {

        console.error(
            'Error actualizando la tarea:',
            error
        );
    }
}


loadBoard();