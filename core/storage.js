const PREFIX = "zap_"

export const Storage = {

/**
 * Save a value to localStorage.
 * @param {string} key
 * @param {any} value
 */
set(key,value){

    try{
        localStorage.setItem(PREFIX + key, JSON.stringify(value))
    }
    catch(e){
        console.warn("Storage write failed", e)
    }

},

/**
 * Read a value from localStorage.
 * @param {string} key
 * @param {any} defaultValue
 */
get(key,defaultValue=null){

    try{

        const v = localStorage.getItem(PREFIX + key)

        if(v===null) return defaultValue

        return JSON.parse(v)

    }
    catch(e){

        console.warn("Storage read failed", e)
        return defaultValue

    }

},

/**
 * Remove a value from localStorage.
 * @param {string} key
 */
remove(key){

    try{
        localStorage.removeItem(PREFIX + key)
    }
    catch(e){
        console.warn("Storage remove failed", e)
    }

}

}
