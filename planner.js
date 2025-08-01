const timetableBody = document.getElementById("timetable-body");

// Generate times from 6:00 AM to 12:00 AM (midnight)
const times = Array.from({ length: 19 }, (_, i) => {
  const hour = 6 + i;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${suffix}`;
});

// Days of the week
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Build timetable rows
times.forEach(time => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${time}</td>` + days.map(day => {
    const key = `${day}-${time}`;
    const savedValue = localStorage.getItem(key) || "";
    return `<td onclick="openModal(this, '${time}', '${day}')" data-day="${day}" data-time="${time}">${savedValue}</td>`;
  }).join('');
  timetableBody.appendChild(row);
});

let activeCell = null;
let activeDay = "";
let activeTime = "";

function openModal(cell, timeLabel, dayLabel) {
  activeCell = cell;
  activeDay = dayLabel;
  activeTime = timeLabel;

  document.getElementById("modal-input").value = cell.textContent.trim();
  document.getElementById("modal-time-label").textContent = `Editing ${dayLabel}, ${timeLabel}`;
  document.getElementById("cell-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("cell-modal").classList.add("hidden");
  activeCell = null;
  activeDay = "";
  activeTime = "";
}

function saveCell() {
  const value = document.getElementById("modal-input").value.trim();
  if (activeCell) {
    activeCell.textContent = value;

    const key = `${activeDay}-${activeTime}`;
    localStorage.setItem(key, value);
  }
  closeModal();
}

function deleteCell() {
  if (activeCell) {
    activeCell.textContent = "";

    const key = `${activeDay}-${activeTime}`;
    localStorage.removeItem(key);
  }
  closeModal();
}

function resetTimetable() {
  if (confirm("Are you sure you want to reset the entire timetable?")) {
    // Clear localStorage entries related to timetable
    times.forEach(time => {
      days.forEach(day => {
        const key = `${day}-${time}`;
        localStorage.removeItem(key);
      });
    });

    // Clear all cells visually
    const allCells = document.querySelectorAll("#timetable-body td[data-day]");
    allCells.forEach(cell => {
      cell.textContent = "";
    });
  }
}
