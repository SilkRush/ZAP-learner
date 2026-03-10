import { ContentIndex } from "../core/contentIndex.js"
import { XP } from "../app/xp.js"
import { Streak } from "../app/streak.js"
import { Progress } from "../app/progress.js"

/**
 * Render the home dashboard.
 */
export async function homeView(){
    const app = document.getElementById("app")
    if(!app) return

    const index = await ContentIndex.load()
    const totals = index.totals || {}
    const completedLessons = Progress.getCompletedLessonIds().length
    const totalLessons = totals.lessons || index.lessons?.length || 0
    const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0

    app.innerHTML = `
        <section class="hero">
            <div>
                <div class="eyebrow">OWASP ZAP field guide</div>
                <h1>ZAP Master Guide</h1>
                <p>Master OWASP ZAP with structured lessons, verified workflows, and hands-on labs built around real scanning, automation, and reporting tasks.</p>
                <div class="hero-actions">
                    <a class="btn btn-primary" href="#/lesson">Start with Fundamentals</a>
                    <a class="btn btn-secondary" href="#/paths">Browse Learning Paths</a>
                </div>
            </div>
            <div class="hero-stats">
                <div class="stat-card">
                    <span class="stat-label">XP</span>
                    <span class="stat-value">${XP.get()}</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Streak</span>
                    <span class="stat-value">${Streak.get()} days</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">Lesson Progress</span>
                    <span class="stat-value">${percent}%</span>
                </div>
            </div>
        </section>
        <section class="metrics">
            <article class="metric">
                <h3>${totals.lessons || 0}</h3>
                <p>Lessons</p>
            </article>
            <article class="metric">
                <h3>${totals.quizzes || 0}</h3>
                <p>Quizzes</p>
            </article>
            <article class="metric">
                <h3>${totals.guides || 0}</h3>
                <p>Guides</p>
            </article>
            <article class="metric">
                <h3>${totals.glossary || 0}</h3>
                <p>Glossary Terms</p>
            </article>
            <article class="metric">
                <h3>${totals.labs || 0}</h3>
                <p>Labs</p>
            </article>
            <article class="metric">
                <h3>${totals.references || 0}</h3>
                <p>References</p>
            </article>
        </section>
        <section class="card-grid">
            <article class="card">
                <div class="card-meta">Learning</div>
                <h3>Lessons</h3>
                <p>Step-by-step modules covering ZAP setup, proxying, scanning, and alert analysis.</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="#/lesson">Browse lessons</a>
                </div>
            </article>
            <article class="card">
                <div class="card-meta">Practice</div>
                <h3>Quizzes</h3>
                <p>Knowledge checks on ZAP modes, contexts, automation, and scan rules.</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="#/quiz">Take a quiz</a>
                </div>
            </article>
            <article class="card">
                <div class="card-meta">Deep Dives</div>
                <h3>Guides</h3>
                <p>Walkthroughs for Quick Start, authentication flows, automation YAML, and Docker runs.</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="#/guide">Explore guides</a>
                </div>
            </article>
            <article class="card">
                <div class="card-meta">Hands-on</div>
                <h3>Labs</h3>
                <p>Hands-on labs that mirror real ZAP workflows from discovery to reporting.</p>
                <div class="card-actions">
                    <a class="btn btn-secondary btn-small" href="#/labs">Open labs</a>
                </div>
            </article>
        </section>
    `
}
