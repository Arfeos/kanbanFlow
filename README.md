# KanbanFlow

KanbanFlow es una aplicación web de gestión de tareas basada en un tablero Kanban. Permite organizar las tareas en diferentes columnas, modificar su estado mediante drag & drop, establecer prioridades, añadir descripciones, comentarios y subtareas.



## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Axios
- SortableJS
- JSON Server
- Material Symbols
- Google Fonts - Inter

## Funcionalidades

### Gestión de tablas

- Crear nuevas columnas.
- Visualizar las columnas del tablero.
- Eliminar columnas.
- Visualización adaptada para dispositivos móviles.

### Gestión de tareas

- Crear tareas.
- Editar tareas.
- Eliminar tareas.
- Asignar una prioridad:
  - Alta
  - Media
  - Baja
- Asignar una fecha límite.
- Añadir una descripción.
- Cambiar el estado de una tarea.
- Mover tareas entre columnas mediante drag & drop.

### Búsqueda y filtros

- Buscar tareas por título.
- Filtrar tareas según su prioridad.
- Contador de tareas en cada columna.

### Subtareas

- Crear subtareas dentro de una tarea.
- Marcar subtareas como completadas.
- Editar el nombre de las subtareas.
- Eliminar subtareas.
- Contador de subtareas.

### Comentarios

- Añadir comentarios a las tareas.
- Visualizar los comentarios existentes.
- Mostrar el autor y la fecha de cada comentario.

### Diseño responsive

La aplicación está adaptada para diferentes tamaños de pantalla.

En dispositivos móviles:

- Las columnas se muestran individualmente.
- Se incluye un menú para cambiar entre columnas.
- Se desactiva el drag & drop para facilitar la interacción táctil.

---

## Instalación

### 1. Clonar el repositorio

Clona el repositorio desde GitHub:

```bash
git clone https://github.com/Arfeos/kanbanFlow.git
```

Accede a la carpeta del proyecto:

```bash
cd kambanFlow
```

### 2. Instalar las dependencias

Instala las dependencias del proyecto mediante:

```bash
npm install
```

Esto instalará las dependencias necesarias para ejecutar el proyecto.

---

## Configuración de JSON Server

La aplicación utiliza **JSON Server** como API REST simulada para almacenar las tablas, tareas, subtareas, comentarios y usuarios.

La información se encuentra almacenada en:

```text
db.json
```

La aplicación está configurada para conectarse a:

```text
http://localhost:3000/
```

### Instalar JSON Server

Si JSON Server no está instalado en el proyecto, puedes instalarlo mediante:

```bash
npm install json-server
```

También puedes instalarlo como dependencia de desarrollo:

```bash
npm install --save-dev json-server
```

### Ejecutar JSON Server

Desde la carpeta raíz del proyecto ejecuta:

```bash
npx json-server db.json
```

Por defecto, JSON Server estará disponible en:

```text
http://localhost:3000
```

Las diferentes colecciones de la API estarán disponibles en rutas como:

```text
http://localhost:3000/tables
http://localhost:3000/tasks
http://localhost:3000/comments
http://localhost:3000/SubTask
http://localhost:3000/users
```

Es necesario mantener JSON Server ejecutándose mientras se utiliza la aplicación.

---

## Ejecutar la aplicación

Una vez iniciado JSON Server, hay que ejecutar también la aplicación web.

Se recomienda utilizar una extensión como **Live Server** en Visual Studio Code.

### Con Live Server

1. Abrir el proyecto en Visual Studio Code.
2. Iniciar JSON Server:

```bash
npx json-server db.json
```

3. Abrir `index.html`.
4. Pulsar **Open with Live Server**.

La aplicación se abrirá en una dirección similar a:

```text
http://127.0.0.1:5500/
```

> **Importante:** JSON Server debe continuar ejecutándose en `http://localhost:3000` para que la aplicación pueda acceder a los datos.

---

## Estructura del proyecto

```text
KanbanFlow/
│
├── src/
│   ├── css/
│   │   └── style.css
│   │
│   ├── img/
│   │   └── logo.png
│   │
│   └── js/
│       ├── api.js
│       └── main.js
│
├── db.json
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

### Archivos principales

#### `index.html`

Contiene la estructura HTML de la aplicación, incluyendo:

- Cabecera.
- Buscador.
- Filtros de prioridad.
- Tablero Kanban.
- Modal de tareas.
- Subtareas.
- Comentarios.
- Modal para crear columnas.

#### `src/js/main.js`

Contiene la lógica principal de la aplicación:

- Renderizado del tablero.
- Gestión de tareas.
- Filtros.
- Drag & drop.
- Gestión de subtareas.
- Gestión de comentarios.
- Gestión de los modales.

#### `src/js/api.js`

Contiene las funciones encargadas de comunicarse con JSON Server mediante Axios.

#### `src/css/style.css`

Contiene los estilos de la aplicación y las reglas responsive.

#### `db.json`

Actúa como base de datos simulada para JSON Server.

Contiene las colecciones:

- `tables`
- `tasks`
- `comments`
- `SubTask`
- `users`

---

## API

La aplicación utiliza Axios para realizar peticiones HTTP a JSON Server.

La URL base configurada es:

```text
http://localhost:3000/
```

Entre las operaciones utilizadas se encuentran:

- `GET` para obtener tablas, tareas, comentarios, usuarios y subtareas.
- `POST` para crear nuevos elementos.
- `PUT` para actualizar tareas.
- `PATCH` para actualizar estados y subtareas.
- `DELETE` para eliminar tareas, subtareas, comentarios y tablas.

---

## Subtareas

Las subtareas se relacionan con una tarea mediante el campo `taskId`.

Ejemplo:

```json
{
  "taskId": "gutN4KDPCgM",
  "name": "Comprobar que funciona",
  "done": false,
  "id": "104"
}
```

El campo `done` permite determinar si la subtarea está completada.

---

## Requisitos

Para ejecutar el proyecto necesitas:

- Node.js
- npm
- Visual Studio Code (recomendado)
- Live Server (recomendado)

No es necesario utilizar una base de datos externa, ya que el proyecto utiliza JSON Server para simular la API.


