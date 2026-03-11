const COPY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"/></svg>`
const CHECK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>`

function normalizeCodeText(text){
    return String(text || "")
        .replace(/\r\n/g, "\n")
        .replace(/\n$/, "")
}

function normalizeCodeDisplay(code){
    if(!code || typeof code.textContent !== "string") return
    const raw = code.textContent
    if(raw.includes("\\n") && !raw.includes("\n")){
        code.textContent = raw.replace(/\\n/g, "\n")
    }
    if(code.textContent.includes("\\t") && !code.textContent.includes("\t")){
        code.textContent = code.textContent.replace(/\\t/g, "\t")
    }
}

function escapeHTML(value){
    return String(value || "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#39;")
}

function highlightYaml(text){
    const lines = String(text || "").split("\n")
    return lines.map(line=>{
        const trimmed = line.trimStart()
        const indent = line.slice(0, line.length - trimmed.length)
        const listMatch = trimmed.match(/^-\\s+/)
        let lineContent = trimmed
        let prefix = escapeHTML(indent)
        if(listMatch){
            prefix = `${escapeHTML(indent)}<span class="yaml-punct">-</span>${escapeHTML(listMatch[0].slice(1))}`
            lineContent = trimmed.slice(listMatch[0].length)
        }

        const keyMatch = lineContent.match(/^([^:#]+?)(\\s*):(.*)$/)
        if(keyMatch){
            const key = keyMatch[1]
            const colon = keyMatch[2] || ":"
            const value = keyMatch[3] || ""
            return `${prefix}<span class="yaml-key">${escapeHTML(key)}</span><span class="yaml-colon">${escapeHTML(colon)}</span>${highlightYamlValue(value)}`
        }
        return `${prefix}${highlightYamlValue(lineContent)}`
    }).join("\n")
}

function splitComment(value){
    let inSingle = false
    let inDouble = false
    for(let i = 0; i < value.length; i++){
        const char = value[i]
        const prev = value[i - 1]
        if(char === "'" && !inDouble && prev !== "\\"){
            inSingle = !inSingle
        }
        else if(char === "\"" && !inSingle && prev !== "\\"){
            inDouble = !inDouble
        }
        if(char === "#" && !inSingle && !inDouble){
            return [value.slice(0, i), value.slice(i)]
        }
    }
    return [value, ""]
}

function highlightYamlValue(value){
    const [rawValue, comment] = splitComment(value || "")
    let result = escapeHTML(rawValue)
    result = result.replace(/(\"([^\"\\\\]|\\\\.)*\")/g,'<span class="yaml-string">$1</span>')
    result = result.replace(/('([^'\\\\]|\\\\.)*')/g,"<span class=\"yaml-string\">$1</span>")
    result = result.replace(/\\b(true|false|yes|no|on|off|null|~)\\b/gi,'<span class="yaml-boolean">$1</span>')
    result = result.replace(/\\b-?\\d+(?:\\.\\d+)?\\b/g,'<span class="yaml-number">$&</span>')
    const commentHtml = comment ? `<span class="yaml-comment">${escapeHTML(comment)}</span>` : ""
    return `${result}${commentHtml}`
}

function applySyntaxHighlight(code, language){
    if(code.dataset.syntaxApplied) return
    const lang = String(language || "").toLowerCase()
    if(lang.includes("yaml") || lang.includes("yml")){
        code.innerHTML = highlightYaml(code.textContent)
        code.dataset.syntaxApplied = "yaml"
    }
}

async function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
        try{
            await navigator.clipboard.writeText(text)
            return true
        }
        catch(err){
            console.warn("Clipboard write failed:", err)
        }
    }

    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly","")
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    textarea.style.pointerEvents = "none"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.select()
    let success = false
    try{
        success = document.execCommand("copy")
    }
    catch(err){
        console.warn("Fallback copy failed:", err)
    }
    textarea.remove()
    return success
}

function ensureCopyButton(wrapper){
    const directChildren = Array.from(wrapper.children)
    let header = directChildren.find(child=>child.classList.contains("code-header"))
    if(!header){
        header = document.createElement("div")
        header.className = "code-header"
        const label = directChildren.find(child=>child.classList.contains("code-label"))
        if(label){
            header.appendChild(label)
        }
        wrapper.insertBefore(header, wrapper.firstChild)
    }

    let button = header.querySelector(".code-copy")
    if(!button){
        button = document.createElement("button")
        button.type = "button"
        button.className = "btn btn-ghost btn-small code-copy"
        button.setAttribute("aria-label","Copy code")
        button.innerHTML = `${COPY_ICON}<span class="sr-only">Copy</span>`
        header.appendChild(button)
    }

    if(button.dataset.copyBound){
        return
    }

    button.dataset.copyBound = "true"
    button.addEventListener("click", async ()=>{
        const code = wrapper.querySelector("pre > code")
        if(!code) return
        const text = normalizeCodeText(code.textContent)
        const success = await copyText(text)
        const previous = button.innerHTML
        button.innerHTML = success ? `${CHECK_ICON}<span class="sr-only">Copied</span>` : `${COPY_ICON}<span class="sr-only">Copy</span>`
        if(success){
            button.classList.add("is-copied")
            setTimeout(()=>{
                button.classList.remove("is-copied")
                button.innerHTML = previous
            }, 1400)
        }
    })
}

export function enhanceCodeBlocks(root = document){
    const blocks = root.querySelectorAll("pre > code")
    blocks.forEach(code=>{
        normalizeCodeDisplay(code)
        const wrapper = code.closest(".code-sample, .code-block")
        const label = wrapper ? wrapper.querySelector(".code-label") : null
        const language = label ? label.textContent : ""
        applySyntaxHighlight(code, language)
        const pre = code.parentElement
        if(!pre) return
        let container = pre.parentElement
        if(!container){
            return
        }

        if(container.classList.contains("code-sample") || container.classList.contains("code-block")){
            ensureCopyButton(container)
            return
        }

        const block = document.createElement("div")
        block.className = "code-block"
        pre.parentNode.insertBefore(block, pre)
        block.appendChild(pre)
        ensureCopyButton(block)
    })
}
