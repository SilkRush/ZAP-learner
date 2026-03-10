function normalizeCodeText(text){
    return String(text || "").replace(/\n$/, "")
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
        button.textContent = "Copy"
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
        const previous = button.textContent
        button.textContent = success ? "Copied" : "Copy"
        if(success){
            button.classList.add("is-copied")
            setTimeout(()=>{
                button.classList.remove("is-copied")
                button.textContent = previous
            }, 1400)
        }
    })
}

export function enhanceCodeBlocks(root = document){
    const blocks = root.querySelectorAll("pre > code")
    blocks.forEach(code=>{
        const pre = code.parentElement
        if(!pre) return
        let wrapper = pre.parentElement
        if(!wrapper){
            return
        }

        if(wrapper.classList.contains("code-sample") || wrapper.classList.contains("code-block")){
            ensureCopyButton(wrapper)
            return
        }

        const container = document.createElement("div")
        container.className = "code-block"
        pre.parentNode.insertBefore(container, pre)
        container.appendChild(pre)
        ensureCopyButton(container)
    })
}
