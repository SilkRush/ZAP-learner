import { ContentIndex } from "../core/contentIndex.js"
import { LearningPaths } from "../core/learningPaths.js"
import { Progress } from "../app/progress.js"
import { XP } from "../app/xp.js"
import { Streak } from "../app/streak.js"
import { escapeHTML } from "../core/utils.js"

/**
 * Render progress dashboard.
 */
export async function progressView(){
    const app = document.getElementById("app")
    if(!app) return

    const index = await ContentIndex.load()
    const totals = index.totals || {}
    const progress = Progress.getAll()
    const completedLessons = Object.keys(progress.lessons || {}).length
    const totalLessons = totals.lessons || index.lessons?.length || 0
    const lessonPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0

    const quizIds = Object.keys(progress.quizzes || {})
    const quizAttempts = quizIds.reduce((sum, id)=>sum + (progress.quizzes[id].attempts || 0), 0)
    const quizBestSum = quizIds.reduce((sum, id)=>sum + (progress.quizzes[id].best || 0), 0)
    const quizTotalSum = quizIds.reduce((sum, id)=>sum + (progress.quizzes[id].total || 0), 0)
    const quizPercent = quizTotalSum ? Math.round((quizBestSum / quizTotalSum) * 100) : 0

    const paths = await LearningPaths.load()
    const completedSet = new Set(Object.keys(progress.lessons || {}))

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Progress</h1>
                <p>Track lessons completed, quiz performance, and streaks.</p>
            </div>
        </section>
        <section class="metrics">
            <article class="metric">
                <h3>${completedLessons}/${totalLessons}</h3>
                <p>Lessons Completed</p>
            </article>
            <article class="metric">
                <h3>${quizIds.length}</h3>
                <p>Quizzes Attempted</p>
            </article>
            <article class="metric">
                <h3>${quizPercent}%</h3>
                <p>Quiz Accuracy</p>
            </article>
            <article class="metric">
                <h3>${XP.get()}</h3>
                <p>Total XP</p>
            </article>
            <article class="metric">
                <h3>${Streak.get()}</h3>
                <p>Current Streak</p>
            </article>
            <article class="metric">
                <h3>${Streak.getLongest()}</h3>
                <p>Longest Streak</p>
            </article>
        </section>
        <section class="content-block">
            <h3>Lesson Progress</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${lessonPercent}%"></div>
            </div>
            <p>${lessonPercent}% completed</p>
        </section>
        <section class="content-block">
            <h3>Quiz Performance</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${quizPercent}%"></div>
            </div>
            <p>${quizAttempts} attempts · ${quizPercent}% accuracy</p>
        </section>
        <section class="content-block">
            <h3>Learning Paths</h3>
            <div class="card-grid">
                ${paths.map(path=>{
                    const done = path.lessons.filter(id=>completedSet.has(id)).length
                    const total = path.lessons.length
                    const percent = total ? Math.round((done / total) * 100) : 0
                    return `
                        <article class="card">
                            <div class="card-meta">${escapeHTML(path.category || "path")}</div>
                            <h3>${escapeHTML(path.title)}</h3>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width:${percent}%"></div>
                            </div>
                            <p>${done}/${total} lessons</p>
                        </article>
                    `
                }).join("")}
            </div>
        </section>
    `
}
