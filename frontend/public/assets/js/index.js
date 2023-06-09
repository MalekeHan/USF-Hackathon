let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
const baseURL = "https://notes-app-backend-usf-hack.herokuapp.com/api/openai/";

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}


// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};
show(saveNoteBtn);

let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });


  const saveNote = document.getElementById("saveNoteBtn").addEventListener("click", async () => {
    const noteContent = document.getElementById("noteInput").value;
    const noteTitle = document.getElementById("noteTitleInput").value;
  
    if (noteContent === "") {
      alert("Please enter some content for the note.");
      return;
    }
  
    try {
      const response = await fetch(`${baseURL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: noteContent}),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        alert("Note saved successfully.");
        document.getElementById("noteInput").value = ""; // Clear the textarea after saving
        document.getElementById("noteTitleInput").value = "";
      } else {
        alert("Error saving note: " + data.error);
      }
    } catch (error) {
      alert("Error saving note: " + error.message);
    }
  });
  

const fetchFolders = async () => {
  try {
    const response = await fetch(`${baseURL}/folders`);
    const data = await response.json();
    console.log(data.folders); // log the retrieved folders
    // Add your code to display the folders in the sidebar here
  } catch (error) {
    console.error('Error fetching folders:', error.message);
  }
};

const foldersButton = document.getElementById('foldBtn');
foldersButton.addEventListener('click', fetchFolders);


const enhanceNote = async () => {
  try {
    const noteInput = document.getElementById('noteInput');
    const response = await fetch(`${baseURL}/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: noteInput.value
      })
    });
    console.log("THIS WAS THE INPUT: " + noteInput.value);
    const data = await response.json();
    console.log(data.completion); // log the response from the API
    noteInput.value = data.completion; // update the note input with the response from the API
  } catch (error) {
    console.error('Error enhancing note:', error.message);
  }
};

const enhanceButton = document.getElementById('enhance');
enhanceButton.addEventListener('click', enhanceNote);


const limitNote = async () => {
  console.log("ENTERED IN THE LIMIT");
  try {
    const noteInput = document.getElementById('noteInput');
    const response = await fetch(`${baseURL}/eli5`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: noteInput.value
      })
    });
    console.log("THIS WAS THE INPUT: " + noteInput.value);
    const data = await response.json();
    console.log(data.completion); // log the response from the API
    noteInput.value = data.completion; // update the note input with the response from the API
  } catch (error) {
    console.error('Error limiting note:', error.message);
  }
};

const limitButton = document.getElementById('limit');
limitButton.addEventListener('click', limitNote);


const quizNote = async () => {
  console.log("ENTERED IN THE quizNote");
  try {
    const noteInput = document.getElementById('noteInput');
    const response = await fetch(`${baseURL}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: noteInput.value
      })
    });
    console.log("THIS WAS THE INPUT: " + noteInput.value);
    const data = await response.json();
    console.log(data.questions); // log the questions array from the API
    const quizOutput = data.questions.join('\n'); // join the questions array into a string with newlines
    noteInput.value = `${noteInput.value}\n\n${quizOutput}`; // update the note input with the questions
  } catch (error) {
    console.error('Error quizNote note:', error.message);
  }
};

const quizButton = document.getElementById('quiz');
quizButton.addEventListener('click', quizNote);


const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};


// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};


// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();


  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });
};

const getAndRenderNotes = () => getNotes().then(renderNoteList);



getAndRenderNotes();
