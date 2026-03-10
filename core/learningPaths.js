import { loadJSON } from "./loader.js"

const PATHS_PATH = "../data/learning-paths.json"

/**
 * Learning paths loader.
 */
export const LearningPaths = {
async load(){
    const data = await loadJSON(PATHS_PATH)
    if(!data){
        console.error("Paths failed to load")
        return []
    }
    return data
}
}
