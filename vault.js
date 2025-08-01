const noteForm = document.getElementById("note-form");
const notesList = document.getElementById("notes-list");
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const modalClose = document.getElementById("modal-close");

let notes = JSON.parse(localStorage.getItem("mindgrid-notes")) || [];

function saveNotesToStorage() {
  localStorage.setItem("mindgrid-notes", JSON.stringify(notes));
}

function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";

    let mediaElement = "";
    if (note.fileURL) {
      if (note.fileType.startsWith("image")) {
        mediaElement = `<img src="${note.fileURL}" class="note-image" alt="${note.title}" />`;
      } else if (note.fileType === "application/pdf") {
        mediaElement = `<a href="${note.fileURL}" target="_blank" class="note-link">View PDF</a>`;
      }
    }

    noteElement.innerHTML = `
      <h3>${note.title}</h3>
      <p><strong>Tag:</strong> ${note.subject}</p>
      <p>${note.content}</p>
      ${mediaElement}
      <button class="delete-note" data-index="${index}">Delete</button>
    `;

    const img = noteElement.querySelector("img");
    if (img) {
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        modal.classList.remove("hidden");
      });
    }

    noteElement.querySelector(".delete-note").addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      notes.splice(idx, 1);
      saveNotesToStorage();
      renderNotes();
    });

    notesList.appendChild(noteElement);
  });
}

noteForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const file = document.getElementById("note-file").files[0];
  const title = document.getElementById("note-title").value;
  const subject = document.getElementById("note-subject").value;
  const content = document.getElementById("note-content").value;

  let fileURL = "";
  let fileType = "";

  if (file) {
    fileURL = URL.createObjectURL(file);
    fileType = file.type;
  }

  notes.push({
    title,
    subject,
    content,
    fileURL,
    fileType,
  });

  saveNotesToStorage();
  renderNotes();
  noteForm.reset();
});

// Modal close
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  modalImg.src = "";
});

// Load on page
window.addEventListener("load", renderNotes);
