import Split from "react-split";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Editor from "./Editor";

function App() {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ""
  );

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: `# Enter title here \n\n`,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes((oldNotes) => {
      let arr = [];
      for (let i = 0; i < oldNotes.length; i++) {
        if (oldNotes[i].id === currentNoteId) {
          arr.unshift({ ...oldNotes[i], body: text });
        } else {
          arr.push(oldNotes[i]);
        }
      }
      return arr;
    });
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId));
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <>
      {notes.length > 0 ? (
        <Split sizes={[15, 85]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            setCurrentNoteId={setCurrentNoteId}
            currentNote={findCurrentNote()}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor updateNote={updateNote} currentNote={findCurrentNote()} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </>
  );
}

export default App;
