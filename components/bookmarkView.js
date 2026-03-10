import { Bookmarks } from "../app/bookmarks.js"
import { ContentIndex } from "../core/contentIndex.js"
import { escapeHTML, truncate } from "../core/utils.js"

/**
 * Render bookmarks list.
 */
export async function bookmarkView(){
    const app = document.getElementById("app")
    if(!app) return

    const index = await ContentIndex.load()

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Bookmarks</h1>
                <p>Keep track of your favorite lessons and guides.</p>
            </div>
        </section>
        <section id="bookmarkList" class="card-grid"></section>
    `

    const render = ()=>{
        const container = document.getElementById("bookmarkList")
        const bookmarks = Bookmarks.getAll()
        if(!bookmarks.length){
            container.innerHTML = `<p class="muted">No bookmarks yet.</p>`
            return
        }

        container.innerHTML = bookmarks.map(bookmark=>{
            const item = findItem(index, bookmark.type, bookmark.id)
            const title = item?.title || item?.term || bookmark.id
            const summary = item?.summary || item?.definition || ""
            const route = routeFor(bookmark.type, bookmark.id)
            return `
                <article class="card">
                    <div class="card-meta">${escapeHTML(bookmark.type)}</div>
                    <h3>${escapeHTML(title)}</h3>
                    <p>${escapeHTML(truncate(summary, 120))}</p>
                    <div class="card-actions">
                        <a class="btn btn-secondary btn-small" href="${escapeHTML(route)}">Open</a>
                        <button class="btn btn-ghost btn-small" data-remove="${escapeHTML(bookmark.type)}::${escapeHTML(bookmark.id)}">Remove</button>
                    </div>
                </article>
            `
        }).join("")

        container.querySelectorAll("[data-remove]").forEach(button=>{
            button.addEventListener("click", ()=>{
                const [type, id] = button.getAttribute("data-remove").split("::")
                Bookmarks.remove(type, id)
                render()
            })
        })
    }

    render()
}

function findItem(index, type, id){
    switch(type){
        case "lesson":
            return index.lessons?.find(item=>item.id === id)
        case "quiz":
            return index.quizzes?.find(item=>item.id === id)
        case "guide":
            return index.guides?.find(item=>item.id === id)
        case "glossary":
            return index.glossary?.find(item=>item.id === id)
        case "lab":
            return index.labs?.find(item=>item.id === id)
        default:
            return null
    }
}

function routeFor(type, id){
    switch(type){
        case "lesson":
            return `#/lesson/${id}`
        case "quiz":
            return `#/quiz/${id}`
        case "guide":
            return `#/guide/${id}`
        case "glossary":
            return `#/glossary/${id}`
        case "lab":
            return `#/labs/${id}`
        default:
            return "#/"
    }
}
