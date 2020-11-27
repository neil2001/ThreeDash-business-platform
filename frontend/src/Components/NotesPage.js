import { useHistory, useRouteMatch } from "react-router-dom";
import React, { useState, useEffect } from "react";

import axios from "axios";

const dataURL = "http://localhost:4000/notes";

const NotesPage = (props) => {
  const { path, url } = useRouteMatch();

  const history = useHistory();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState([]);
  const [message, setMessage] = useState([]);

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  /**
   * gets the notes from the backend
   */
  const getNotes = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(dataURL, config).then((result) => {
      //console.dir(result);
      setNotes(result.data);
    });
  };

  useEffect(() => {
    // console.log("Functional Component has mounted")

    getNotes();
  }, []);

  /**
   * deletes the note with number num using the backend
   * @param {int} num
   */
  const deleteClick = (num) => {
    alert("Are you sure you want to delete this note?");
    axios.delete(dataURL + "/" + num).then((result) => {
      console.log("note has been deleted");
      getNotes();
    });
  };

  /**
   * creates a new note using the backend
   */
  const noteSubmit = () => {
    const data = { name: title, note: message };
    axios
      .post(dataURL, data)
      .then((result) => {
        //console.dir(result)
        //alert("result = " + result);
        //console.log('Data send');
        setTitle("");
        setMessage("");
        getNotes();
        //history.push("/wcw/manageOrders/current");
      })
      .catch((err) => {
        console.dir(err);
      });
  };

  /**
   * returns all the notes by iterating backwards through the notes table
   */
  const renderNotes = () => {
    const rows = [];
    for (let i = notes.length - 1; i >= 0; i--) {
      rows.push(
        <div className="noteBox">
          <h3>{notes[i].name}</h3>
          <p>{notes[i].note}</p>
          <div>
            <p>Posted: {notes[i].postDate}</p>
            <button
              className="noteDeleteButton"
              onClick={() => {
                deleteClick(notes[i].noteID);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      );
    }

    return rows;
  };

  /**
   * returns the html elements necessary to display the notes
   */
  return (
    <div>
      <h1 className="titleDiv2">Notes and Updates:</h1>
      <div className="noteRow">
        <div className="newNoteBox">
          <form>
            Title:
            <div>
              <input
                className="longInput"
                type="text"
                value={title}
                onChange={onTitleChange}
              />
            </div>
            <div>
              Message:
              <div>
                <textarea
                  className="tallInput"
                  value={message}
                  onChange={onMessageChange}
                />
              </div>
            </div>
          </form>
          <button className="buttonMargin" onClick={noteSubmit}>
            Submit
          </button>
        </div>
        {renderNotes()}
      </div>
    </div>
  );
};
export default NotesPage;
