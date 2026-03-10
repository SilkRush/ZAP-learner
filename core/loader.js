const jsonCache = new Map()
const textCache = new Map()

/**
 * Load a JSON file with optional in-memory caching.
 * @param {string} path
 * @param {{cache?: boolean}} [options]
 */
export async function loadJSON(path, options = {}){
    const useCache = options.cache !== false
    const resolvedPath = normalizePath(path)
    if(useCache && jsonCache.has(resolvedPath)){
        return jsonCache.get(resolvedPath)
    }

    try{
        const res = await fetch(resolvedPath)
        if(!res.ok){
            throw new Error(`Data not found: ${resolvedPath}`)
        }
        const data = await res.json()
        if(useCache){
            jsonCache.set(resolvedPath, data)
        }
        return data
    }
    catch(err){
        console.error("Loader error:", err)
        return null
    }
}

/**
 * Load a text file with optional in-memory caching.
 * @param {string} path
 * @param {{cache?: boolean}} [options]
 */
export async function loadText(path, options = {}){
    const useCache = options.cache !== false
    const resolvedPath = normalizePath(path)
    if(useCache && textCache.has(resolvedPath)){
        return textCache.get(resolvedPath)
    }

    try{
        const res = await fetch(resolvedPath)
        if(!res.ok){
            throw new Error(`Data not found: ${resolvedPath}`)
        }
        const data = await res.text()
        if(useCache){
            textCache.set(resolvedPath, data)
        }
        return data
    }
    catch(err){
        console.error("Loader error:", err)
        return null
    }
}

function normalizePath(path){
    if(!path) return path
    if(path.startsWith("../data/")){
        return path.replace("../data/","./data/")
    }
    return path
}
