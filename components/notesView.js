import { Notes } from "../app/notes.js"
import { escapeHTML } from "../core/utils.js"

/**
 * Render a notes panel for a lesson.
 * @param {string} lessonId
 */
export function renderNotes(lessonId){

const container = document.createElement("div")

const text = escapeHTML(Notes.get(lessonId))

container.innerHTML = `

<h3>Your Notes</h3>

<textarea id="lessonNotes">${text}</textarea>

<button id="saveNotes">Save Notes</button>

`

container.querySelector("#saveNotes").onclick = ()=>{

const val = container.querySelector("#lessonNotes").value

Notes.save(lessonId,val)

alert("Notes saved")

}

return container

}
