import { loadJSON } from "../core/loader.js"
import { ContentIndex } from "../core/contentIndex.js"
import { Progress } from "../app/progress.js"
import { XP } from "../app/xp.js"
import { Streak } from "../app/streak.js"
import { Bookmarks } from "../app/bookmarks.js"
import { renderNotes } from "./notesView.js"
import { markdownToHTML, escapeHTML, truncate } from "../core/utils.js"

/**
 * Render lesson list or detail view.
 * @param {{params?: object, query?: object}} ctx
 */
export async function lessonView(ctx = {}){
    const app = document.getElementById("app")
    if(!app) return

    const lessonId = ctx.params?.id
    if(!lessonId){
        await renderLessonList(app, ctx.query || {})
        return
    }

    await renderLessonDetail(app, lessonId)
}

async function renderLessonList(app, query){
    app.innerHTML = `<p class="muted">Loading lessons...</p>`
    const index = await ContentIndex.load()
    const lessons = index.lessons || []
    const modules = Array.from(new Set(lessons.map(l=>l.module))).sort()
    const difficulties = ["beginner","intermediate","advanced"]

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Lessons Library</h1>
                <p>Browse lessons by module, difficulty, or keyword.</p>
            </div>
        </section>
        <section class="filters">
            <input id="lessonSearch" placeholder="Search lessons">
            <select id="moduleFilter">
                <option value="">All modules</option>
                ${modules.map(module=>`<option value="${escapeHTML(module)}">${escapeHTML(module)}</option>`).join("")}
            </select>
            <select id="difficultyFilter">
                <option value="">All levels</option>
                ${difficulties.map(level=>`<option value="${level}">${level}</option>`).join("")}
            </select>
        </section>
        <section id="lessonList" class="card-grid"></section>
    `

    const searchInput = document.getElementById("lessonSearch")
    const moduleFilter = document.getElementById("moduleFilter")
    const difficultyFilter = document.getElementById("difficultyFilter")

    if(query.module){
        moduleFilter.value = query.module
    }
    if(query.level){
        difficultyFilter.value = query.level
    }

    const render = ()=>{
        const q = searchInput.value.trim().toLowerCase()
        const moduleValue = moduleFilter.value
        const difficultyValue = difficultyFilter.value

        const filtered = lessons.filter(lesson=>{
            if(moduleValue && lesson.module !== moduleValue) return false
            if(difficultyValue && lesson.difficulty !== difficultyValue) return false
            if(q){
                const haystack = `${lesson.title} ${lesson.summary || ""} ${lesson.tags?.join(" ") || ""}`.toLowerCase()
                if(!haystack.includes(q)) return false
            }
            return true
        })

        const container = document.getElementById("lessonList")
        container.innerHTML = filtered.map(lesson=>{
            const completed = Progress.isCompleted(lesson.id)
            return `
                <article class="card">
                    <div class="card-meta">${escapeHTML(lesson.module)} · ${escapeHTML(lesson.difficulty)}</div>
                    <h3>${escapeHTML(lesson.title)}</h3>
                    <p>${escapeHTML(truncate(lesson.summary || "", 120))}</p>
                    <div class="card-actions">
                        <a class="btn btn-secondary btn-small" href="#/lesson/${lesson.id}">Open</a>
                        ${completed ? `<span class="badge">Completed</span>` : ""}
                    </div>
                </article>
            `
        }).join("") || `<p class="muted">No lessons match your filters.</p>`
    }

    render()
    searchInput.addEventListener("input", render)
    moduleFilter.addEventListener("change", render)
    difficultyFilter.addEventListener("change", render)
}

async function renderLessonDetail(app, lessonId){
    app.innerHTML = `<p class="muted">Loading lesson...</p>`
    const lesson = await loadJSON(`../data/lessons/${lessonId}.json`)
    if(!lesson){
        app.innerHTML = `
            <h2>Lesson not found</h2>
            <p>We could not load this lesson. Try another one.</p>
            <a class="btn btn-secondary" href="#/lesson">Back to lessons</a>
        `
        return
    }

    const index = await ContentIndex.load()
    const quizLookup = new Map((index.quizzes || []).map(quiz=>[quiz.id, quiz.title]))
    const isCompleted = Progress.isCompleted(lessonId)
    const isBookmarked = Bookmarks.isBookmarked("lesson", lessonId)

    app.innerHTML = `
        <section class="page-header">
            <div>
                <div class="eyebrow">${escapeHTML(lesson.module)} · ${escapeHTML(lesson.difficulty)}</div>
                <h1>${escapeHTML(lesson.title)}</h1>
                <p>${escapeHTML(lesson.topic)}</p>
            </div>
            <div class="header-actions">
                <button id="bookmarkLesson" class="btn btn-secondary">
                    ${isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
                <button id="completeLesson" class="btn btn-primary">
                    ${isCompleted ? "Completed" : "Mark Complete"}
                </button>
            </div>
        </section>
        <section class="content-block">
            <h3>Learning Objectives</h3>
            <ul>
                ${(lesson.objectives || []).map(obj=>`<li>${escapeHTML(obj)}</li>`).join("")}
            </ul>
        </section>
        <section class="content-block markdown">
            ${markdownToHTML(lesson.content)}
        </section>
        <section class="content-block">
            <h3>Examples</h3>
            <ul>
                ${(lesson.examples || []).map(ex=>`<li>${escapeHTML(ex)}</li>`).join("")}
            </ul>
        </section>
        <section class="content-block">
            <h3>Code Samples</h3>
            ${(lesson.codeSamples || []).map(sample=>`
                <div class="code-sample">
                    <div class="code-label">${escapeHTML(sample.language || "Code")}</div>
                    <pre><code>${escapeHTML(sample.code || "")}</code></pre>
                </div>
            `).join("")}
        </section>
        <section class="content-block">
            <h3>Practice Tasks</h3>
            <ol>
                ${(lesson.practice || []).map(task=>`<li>${escapeHTML(task)}</li>`).join("")}
            </ol>
        </section>
        <section class="content-block">
            <h3>Summary</h3>
            <div class="markdown">
                ${markdownToHTML(lesson.summary)}
            </div>
        </section>
        <section class="content-block">
            <h3>References</h3>
            <ul>
                ${(lesson.references || []).map(ref=>`<li>${escapeHTML(ref)}</li>`).join("")}
            </ul>
        </section>
        <section class="content-block">
            <h3>Quizzes</h3>
            <div class="pill-row">
                ${(lesson.quizzes || []).map(id=>`
                    <a class="pill" href="#/quiz/${id}">${escapeHTML(quizLookup.get(id) || id)}</a>
                `).join("")}
            </div>
        </section>
        <section class="content-block">
            <div class="notes-slot"></div>
        </section>
    `

    const bookmarkBtn = document.getElementById("bookmarkLesson")
    const completeBtn = document.getElementById("completeLesson")

    if(bookmarkBtn){
        bookmarkBtn.addEventListener("click", ()=>{
            const nowBookmarked = !Bookmarks.isBookmarked("lesson", lessonId)
            if(nowBookmarked){
                Bookmarks.add("lesson", lessonId)
            }
            else{
                Bookmarks.remove("lesson", lessonId)
            }
            bookmarkBtn.textContent = nowBookmarked ? "Bookmarked" : "Bookmark"
        })
    }

    if(completeBtn){
        completeBtn.addEventListener("click", ()=>{
            if(!Progress.isCompleted(lessonId)){
                Progress.completeLesson(lessonId)
                XP.awardForLesson()
                Streak.update()
            }
            completeBtn.textContent = "Completed"
        })
    }

    const notesSlot = app.querySelector(".notes-slot")
    if(notesSlot){
        notesSlot.appendChild(renderNotes(lessonId))
    }
}
