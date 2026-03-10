import { Storage } from "../core/storage.js"

const KEY = "notes"

/**
 * Notes storage per lesson.
 */
export const Notes = {

/**
 * Get notes for an item id.
 * @param {string} id
 */
get(id){

const notes = Storage.get(KEY,{})

return notes[id] || ""

},

/**
 * Save notes for an item id.
 * @param {string} id
 * @param {string} text
 */
save(id,text){

const notes = Storage.get(KEY,{})

notes[id] = text

Storage.set(KEY,notes)

}

}
