/**
 * Escape HTML entities for safe rendering.
 * @param {string} value
 */
export function escapeHTML(value){
    return String(value || "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#39;")
}

/**
 * Convert a subset of Markdown to HTML.
 * @param {string} markdown
 */
export function markdownToHTML(markdown){
    if(!markdown) return ""
    const lines = String(markdown).split(/\r?\n/)
    let html = ""
    let inList = false
    let inCode = false

    const flushList = ()=>{
        if(inList){
            html += "</ul>"
            inList = false
        }
    }

    for(const rawLine of lines){
        const line = rawLine.trimEnd()
        if(line.startsWith("```")){
            if(inCode){
                html += "</code></pre>"
                inCode = false
            }
            else{
                flushList()
                inCode = true
                html += "<pre><code>"
            }
            continue
        }

        if(inCode){
            html += `${escapeHTML(line)}\n`
            continue
        }

        if(!line){
            flushList()
            continue
        }

        if(line.startsWith("### ")){
            flushList()
            html += `<h3>${formatInline(line.slice(4))}</h3>`
            continue
        }
        if(line.startsWith("## ")){
            flushList()
            html += `<h2>${formatInline(line.slice(3))}</h2>`
            continue
        }
        if(line.startsWith("# ")){
            flushList()
            html += `<h1>${formatInline(line.slice(2))}</h1>`
            continue
        }
        if(line.startsWith("- ")){
            if(!inList){
                html += "<ul>"
                inList = true
            }
            html += `<li>${formatInline(line.slice(2))}</li>`
            continue
        }

        flushList()
        html += `<p>${formatInline(line)}</p>`
    }

    flushList()
    if(inCode){
        html += "</code></pre>"
    }
    return html
}

/**
 * Truncate text with an ellipsis.
 * @param {string} text
 * @param {number} limit
 */
export function truncate(text, limit = 140){
    const value = String(text || "")
    if(value.length <= limit) return value
    if(limit <= 3) return value.slice(0, limit)
    return `${value.slice(0, limit - 3)}...`
}

/**
 * Create a URL-friendly slug.
 * @param {string} value
 */
export function slugify(value){
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/(^-|-$)/g,"")
}

/**
 * Capitalize the first letter.
 * @param {string} value
 */
export function capitalize(value){
    const text = String(value || "")
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : ""
}

/**
 * Ensure array output.
 * @param {any} value
 */
export function safeArray(value){
    return Array.isArray(value) ? value : []
}

/**
 * Parse comma-separated tags into an array.
 * @param {string} value
 */
export function parseTags(value){
    return String(value || "")
        .split(",")
        .map(tag=>tag.trim())
        .filter(Boolean)
}

function formatInline(text){
    let value = escapeHTML(text)
    value = value.replace(/`([^`]+)`/g,"<code>$1</code>")
    value = value.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")
    value = value.replace(/\*([^*]+)\*/g,"<em>$1</em>")
    return value
}
