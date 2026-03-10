import { Storage } from "../core/storage.js"

const KEY = "bookmarks"

/**
 * Bookmark manager for lessons, guides, glossary, and labs.
 */
export const Bookmarks = {

getAll(){

    const list = Storage.get(KEY, [])
    return list.map(normalizeEntry).filter(Boolean)

},

add(type, id){

    if(!id){
        id = type
        type = "lesson"
    }

    const list = Storage.get(KEY,[])
    const entry = normalizeEntry({ type, id })

    if(!entry) return

    const exists = list
        .map(normalizeEntry)
        .some(item=>item && item.type === entry.type && item.id === entry.id)

    if(!exists){
        list.push(entry)
        Storage.set(KEY,list)
    }

},

remove(type, id){

    if(!id){
        id = type
        type = "lesson"
    }

    let list = Storage.get(KEY,[])

    list = list
        .map(normalizeEntry)
        .filter(item=>item && !(item.type === type && item.id === id))

    Storage.set(KEY,list)
},

isBookmarked(type, id){

    if(!id){
        id = type
        type = "lesson"
    }

    const list = Storage.get(KEY,[])

    return list
        .map(normalizeEntry)
        .some(item=>item && item.type === type && item.id === id)

}

}

function normalizeEntry(entry){
    if(!entry) return null
    if(typeof entry === "string"){
        return { type: "lesson", id: entry }
    }
    if(entry.type && entry.id){
        return { type: entry.type, id: entry.id }
    }
    return null
}
