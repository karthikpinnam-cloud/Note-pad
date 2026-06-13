// PAGE NAVIGATION

const pages = document.querySelectorAll(".page");
const navBtns = document.querySelectorAll(".nav-btn");

navBtns.forEach(btn => {

  btn.addEventListener("click", () => {

    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    pages.forEach(p => p.classList.remove("active"));

    document
      .getElementById(btn.dataset.page)
      .classList.add("active");

  });

});

// STORAGE

let categories =
  JSON.parse(localStorage.getItem("categories")) || [
    "Personal",
    "Friends",
    "Family",
    "School",
    "Work"
  ];

let notes =
  JSON.parse(localStorage.getItem("notes")) || [
    {
      id:1,
      title:"John",
      category:"Friends",
      content:"",
      date:new Date().toLocaleDateString()
    },
    {
      id:2,
      title:"Anime List",
      category:"Personal",
      content:"",
      date:new Date().toLocaleDateString()
    },
    {
      id:3,
      title:"School Project",
      category:"School",
      content:"",
      date:new Date().toLocaleDateString()
    }
  ];

function saveData(){
  localStorage.setItem(
    "categories",
    JSON.stringify(categories)
  );

  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );
}

// CATEGORIES

const categoryList =
  document.getElementById("categoryList");

let selectedCategory = "All";

function renderCategories(){

  categoryList.innerHTML = "";

  const all = document.createElement("div");
  all.className = "category active";
  all.innerText = "All";

  all.onclick = () => {
    selectedCategory = "All";
    renderNotes();
  };

  categoryList.appendChild(all);

  categories.forEach(cat => {

    const div = document.createElement("div");

    div.className = "category";
    div.innerText = cat;

    div.onclick = () => {

      selectedCategory = cat;

      document
        .querySelectorAll(".category")
        .forEach(c => c.classList.remove("active"));

      div.classList.add("active");

      renderNotes();

    };

    div.oncontextmenu = (e) => {

      e.preventDefault();

      const action = prompt(
        "Type rename or delete"
      );

      if(action === "rename"){

        const newName = prompt("New name");

        if(newName){

          categories = categories.map(c =>
            c === cat ? newName : c
          );

          saveData();
          renderCategories();

        }

      }

      if(action === "delete"){

        categories = categories.filter(c => c !== cat);

        saveData();
        renderCategories();

      }

    };

    categoryList.appendChild(div);

  });

}

document
  .getElementById("addCategoryBtn")
  .onclick = () => {

    const name = prompt("Category name");

    if(name){

      categories.push(name);
      saveData();
      renderCategories();

    }

  };

// NOTES

const notesContainer =
  document.getElementById("notesContainer");

function renderNotes(){

  notesContainer.innerHTML = "";

  let filtered = notes;

  if(selectedCategory !== "All"){

    filtered = notes.filter(
      n => n.category === selectedCategory
    );

  }

  filtered.forEach(note => {

    const card = document.createElement("div");

    card.className = "note-card";

    card.innerHTML = `
      <div class="note-options">⋮</div>
      <h3>${note.title}</h3>
      <div class="note-meta">
        ${note.date}
      </div>
      <div>🧠 Mind Map Linked</div>
    `;

    card.onclick = () => openEditor(note.id);

    card.querySelector(".note-options")
      .onclick = (e) => {

      e.stopPropagation();

      const action = prompt(
        "edit / duplicate / delete"
      );

      if(action === "delete"){

        notes = notes.filter(n => n.id !== note.id);
        saveData();
        renderNotes();

      }

      if(action === "duplicate"){

        const copy = {
          ...note,
          id:Date.now(),
          title:note.title + " Copy"
        };

        notes.push(copy);

        saveData();
        renderNotes();

      }

      if(action === "edit"){

        openEditor(note.id);

      }

    };

    notesContainer.appendChild(card);

  });

}

// NEW NOTE

document
  .getElementById("newNoteBtn")
  .onclick = () => {

    const title = prompt("Note title");

    if(!title) return;

    const note = {
      id:Date.now(),
      title,
      category:selectedCategory === "All"
        ? "Personal"
        : selectedCategory,
      content:"",
      date:new Date().toLocaleDateString()
    };

    notes.push(note);

    saveData();
    renderNotes();

  };

// EDITOR

let currentNote = null;

const editor =
  document.getElementById("editor");

function openEditor(id){

  currentNote = notes.find(n => n.id === id);

  editor.innerHTML = currentNote.content;

  pages.forEach(p => p.classList.remove("active"));

  document
    .getElementById("editorPage")
    .classList.add("active");

}

document
  .getElementById("backBtn")
  .onclick = () => {

    pages.forEach(p => p.classList.remove("active"));

    document
      .getElementById("notepadPage")
      .classList.add("active");

  };

editor.addEventListener("input", () => {

  if(currentNote){

    currentNote.content = editor.innerHTML;
    currentNote.date =
      new Date().toLocaleDateString();

    saveData();

  }

});

function formatText(type){
  document.execCommand(type);
}

function insertLink(){

  const url = prompt("Enter URL");

  if(url){

    document.execCommand(
      "createLink",
      false,
      url
    );

  }

}

function insertImage(){

  const url = prompt("Image URL");

  if(url){

    document.execCommand(
      "insertImage",
      false,
      url
    );

  }

}

// CALENDAR

const monthTitle =
  document.getElementById("monthTitle");

const calendarGrid =
  document.getElementById("calendarGrid");

let currentDate = new Date();

function renderCalendar(){

  calendarGrid.innerHTML = "";

  const month =
    currentDate.getMonth();

  const year =
    currentDate.getFullYear();

  monthTitle.innerText =
    `${year} ${
      currentDate.toLocaleString(
        "default",
        {month:"long"}
      )
    }`;

  const days = [
    "SUN","MON","TUE",
    "WED","THU","FRI","SAT"
  ];

  days.forEach(day => {

    const div = document.createElement("div");

    div.className = "day-name";
    div.innerText = day;

    calendarGrid.appendChild(div);

  });

  const firstDay =
    new Date(year, month, 1).getDay();

  const totalDays =
    new Date(year, month + 1, 0).getDate();

  for(let i = 0; i < firstDay; i++){

    const blank =
      document.createElement("div");

    calendarGrid.appendChild(blank);

  }

  for(let day = 1; day <= totalDays; day++){

    const div = document.createElement("div");

    div.className = "day";
    div.innerText = day;

    const today = new Date();

    if(
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ){
      div.classList.add("today");
    }

    calendarGrid.appendChild(div);

  }

}

document
  .getElementById("prevMonth")
  .onclick = () => {

    currentDate.setMonth(
      currentDate.getMonth() - 1
    );

    renderCalendar();

  };

document
  .getElementById("nextMonth")
  .onclick = () => {

    currentDate.setMonth(
      currentDate.getMonth() + 1
    );

    renderCalendar();

  };

// EVENTS

const eventsList =
  document.getElementById("eventsList");

let events =
  JSON.parse(localStorage.getItem("events"))
  || [];

function renderEvents(){

  eventsList.innerHTML = "";

  events.forEach(ev => {

    const div =
      document.createElement("div");

    div.className = "event-card";

    div.innerHTML = `
      <strong>${ev.icon}</strong>
      ${ev.text}
    `;

    eventsList.appendChild(div);

  });

}

document
  .getElementById("addEventBtn")
  .onclick = () => {

    const text = prompt("Event name");

    if(!text) return;

    events.push({
      icon:"📌",
      text
    });

    localStorage.setItem(
      "events",
      JSON.stringify(events)
    );

    renderEvents();

  };

// MIND MAP

const canvas =
  document.getElementById("mindCanvas");

document
  .getElementById("addNodeBtn")
  .onclick = () => {

    const node =
      document.createElement("div");

    node.className = "node";

    node.style.left = "100px";
    node.style.top = "100px";

    node.contentEditable = true;

    node.innerText = "New Node";

    canvas.appendChild(node);

    dragNode(node);

  };

function dragNode(el){

  let offsetX = 0;
  let offsetY = 0;
  let isDown = false;

  el.addEventListener("mousedown", e => {

    isDown = true;

    offsetX =
      e.clientX - el.offsetLeft;

    offsetY =
      e.clientY - el.offsetTop;

  });

  document.addEventListener("mouseup", () => {
    isDown = false;
  });

  document.addEventListener("mousemove", e => {

    if(!isDown) return;

    el.style.left =
      e.clientX - offsetX + "px";

    el.style.top =
      e.clientY - offsetY + "px";

  });

}

// INITIALIZE

renderCategories();
renderNotes();
renderCalendar();
renderEvents();
