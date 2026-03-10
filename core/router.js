/**
 * Hash-based router with support for named parameters.
 */
import { enhanceCodeBlocks } from "./codeBlocks.js"

export const Router = {
routes: [],
notFoundHandler: null,

/**
 * Register a route pattern and handler.
 * @param {string} pattern
 * @param {(ctx: {params: object, query: object, path: string}) => void | Promise<void>} handler
 */
register(pattern, handler){
    const compiled = compilePattern(pattern)
    this.routes.push({ pattern, handler, ...compiled })
},

/**
 * Set a handler used when no routes match.
 * @param {(ctx: {path: string}) => void} handler
 */
setNotFound(handler){
    this.notFoundHandler = handler
},

start(){
    window.addEventListener("hashchange", ()=>this.resolve())

    if(!location.hash){
        location.hash = "#/"
    }

    this.resolve()
},

/**
 * Navigate to a path (without leading #).
 * @param {string} path
 */
navigate(path){
    location.hash = `#${path}`
},

resolve(){
    const { path, query } = parseHash(location.hash)

    for(const route of this.routes){
        const match = route.regex.exec(path)
        if(match){
            const params = {}
            route.keys.forEach((key, index)=>{
                params[key] = decodeURIComponent(match[index + 1])
            })
            try{
                const result = route.handler({ params, query, path })
                if(result && typeof result.then === "function"){
                    result.then(()=>enhanceCodeBlocks()).catch(err=>{
                        console.error("Route Error:", err)
                        renderError("Something went wrong while loading.")
                    })
                }
                else{
                    enhanceCodeBlocks()
                }
            }
            catch(err){
                console.error("Route Error:", err)
                renderError("Something went wrong while loading.")
            }
            return
        }
    }

    if(this.notFoundHandler){
        this.notFoundHandler({ path })
        return
    }

    renderError("404 Page")
}
}

function compilePattern(pattern){
    const keys = []
    if(pattern === "*"){
        return { regex: /^.*$/, keys }
    }
    if(pattern === "/"){
        return { regex: /^\/$/, keys }
    }
    const segments = pattern.replace(/\/+$/,"").split("/").filter(Boolean)
    const regexParts = segments.map(segment=>{
        if(segment.startsWith(":")){
            keys.push(segment.slice(1))
            return "([^/]+)"
        }
        return segment.replace(/[.+?^${}()|[\]\\]/g,"\\$&")
    })
    const regex = new RegExp(`^/${regexParts.join("/")}$`)
    return { regex, keys }
}

function parseHash(hash){
    const raw = (hash || "").replace(/^#/, "") || "/"
    const [pathPart, queryPart] = raw.split("?")
    const cleanedPath = pathPart.replace(/\/+$/,"") || "/"
    const path = cleanedPath.startsWith("/") ? cleanedPath : `/${cleanedPath}`
    const query = {}
    if(queryPart){
        const params = new URLSearchParams(queryPart)
        for(const [key, value] of params.entries()){
            query[key] = value
        }
    }
    return { path, query }
}

function renderError(message){
    const container = document.getElementById("app")
    if(container){
        container.innerHTML = `<h2>${message}</h2>`
    }
}
