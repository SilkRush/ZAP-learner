import { loadJSON } from "./loader.js"

const INDEX_PATH = "../data/content-index.json"

/**
 * Content index loader with helper accessors.
 */
export const ContentIndex = {
data: null,

async load(){
    if(this.data) return this.data

    const data = await loadJSON(INDEX_PATH)
    if(!data){
        console.error("Index load failed")
        this.data = {
            lessons: [],
            quizzes: [],
            guides: [],
            glossary: [],
            references: [],
            labs: [],
            cheatsheets: [],
            paths: [],
            search: [],
            totals: {}
        }
        return this.data
    }

    this.data = data
    return this.data
},

/**
 * Find an item by type and id.
 * @param {string} type
 * @param {string} id
 */
async findById(type, id){
    const data = await this.load()
    const list = data[type] || []
    return list.find(item=>item.id === id || item.termId === id) || null
},

/**
 * Return totals for quick stats.
 */
async getTotals(){
    const data = await this.load()
    return data.totals || {}
}
}
