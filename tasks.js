function addTask(columnId) {
  const taskText = prompt("Enter task:");
  if (!taskText) return;

  const task = document.createElement("div");
  task.className = "task-card";
  task.draggable = true;
  task.textContent = taskText;

  task.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.textContent);
    e.dataTransfer.setData("source-column", columnId);
  });

  document.getElementById(`${columnId}-list`).appendChild(task);
  saveTasks();
}

// Enable drag and drop for task lists
document.querySelectorAll(".task-list").forEach(list => {
  list.addEventListener("dragover", (e) => e.preventDefault());

  list.addEventListener("drop", (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    const sourceColumn = e.dataTransfer.getData("source-column");

    if (!text || !list.id.endsWith("-list")) return;

    if (list.id === `${sourceColumn}-list`) return; // Same column, ignore

    const task = document.createElement("div");
    task.className = "task-card";
    task.textContent = text;
    task.draggable = true;

    task.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.textContent);
      e.dataTransfer.setData("source-column", list.id.replace("-list", ""));
    });

    list.appendChild(task);

    // Remove from source column
    const sourceList = document.getElementById(`${sourceColumn}-list`);
    [...sourceList.children].forEach(child => {
      if (child.textContent === text) child.remove();
    });

    saveTasks();
  });
});

// Save tasks to localStorage
function saveTasks() {
  const boardData = {};
  ["todo", "doing", "done"].forEach(col => {
    boardData[col] = [];
    const list = document.getElementById(`${col}-list`);
    list.querySelectorAll(".task-card").forEach(card => {
      boardData[col].push(card.textContent);
    });
  });
  localStorage.setItem("mindgrid-tasks", JSON.stringify(boardData));
}

// Load tasks from localStorage
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("mindgrid-tasks"));
  if (!data) return;
  ["todo", "doing", "done"].forEach(col => {
    const list = document.getElementById(`${col}-list`);
    list.innerHTML = "";
    data[col]?.forEach(taskText => {
      const task = document.createElement("div");
      task.className = "task-card";
      task.textContent = taskText;
      task.draggable = true;

      task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.textContent);
        e.dataTransfer.setData("source-column", col);
      });

      list.appendChild(task);
    });
  });
}

// Load tasks when the page loads
window.addEventListener("load", loadTasks);

// Save tasks automatically on tab close
window.addEventListener("beforeunload", saveTasks);
