import { LearningPaths } from "../core/learningPaths.js"
import { Progress } from "../app/progress.js"
import { escapeHTML } from "../core/utils.js"

/**
 * Render learning paths overview.
 */
export async function pathView(){

const app = document.getElementById("app")
if(!app) return

const paths = await LearningPaths.load()
const completed = new Set(Progress.getCompletedLessonIds())

app.innerHTML = `

    <section class="page-header">
        <div>
            <h1>Learning Paths</h1>
            <p>Structured journeys to build skills step by step.</p>
        </div>
    </section>
    <section class="card-grid">
        ${paths.map(path=>{
            const done = path.lessons.filter(id=>completed.has(id)).length
            const total = path.lessons.length
            const percent = total ? Math.round((done / total) * 100) : 0
            return `
                <article class="card">
                    <div class="card-meta">${escapeHTML(path.category || "path")}</div>
                    <h3>${escapeHTML(path.title)}</h3>
                    <p>${escapeHTML(path.description || "")}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${percent}%"></div>
                    </div>
                    <div class="card-actions">
                        <span class="badge">${done}/${total} lessons</span>
                        <a class="btn btn-secondary btn-small" href="#/lesson/${path.lessons[0]}">Start</a>
                    </div>
                </article>
            `
        }).join("")}
    </section>
`

}
