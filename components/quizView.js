import { loadJSON } from "../core/loader.js"
import { ContentIndex } from "../core/contentIndex.js"
import { Progress } from "../app/progress.js"
import { XP } from "../app/xp.js"
import { Streak } from "../app/streak.js"
import { escapeHTML, truncate } from "../core/utils.js"

/**
 * Render quizzes list or quiz detail view.
 * @param {{params?: object}} ctx
 */
export async function quizView(ctx = {}){
    const app = document.getElementById("app")
    if(!app) return

    const quizId = ctx.params?.id
    if(!quizId){
        await renderQuizList(app)
        return
    }

    await renderQuizDetail(app, quizId)
}

async function renderQuizList(app){
    app.innerHTML = `<p class="muted">Loading quizzes...</p>`
    const index = await ContentIndex.load()
    const quizzes = index.quizzes || []

    app.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Quizzes</h1>
                <p>Practice with focused quizzes across all modules.</p>
            </div>
        </section>
        <section class="filters">
            <input id="quizSearch" placeholder="Search quizzes">
        </section>
        <section id="quizList" class="card-grid"></section>
    `

    const searchInput = document.getElementById("quizSearch")
    const render = ()=>{
        const q = searchInput.value.trim().toLowerCase()
        const filtered = quizzes.filter(quiz=>{
            if(!q) return true
            const haystack = `${quiz.title} ${quiz.module || ""}`.toLowerCase()
            return haystack.includes(q)
        })
        const container = document.getElementById("quizList")
        container.innerHTML = filtered.map(quiz=>{
            const progress = Progress.getQuizScore(quiz.id)
            return `
                <article class="card">
                    <div class="card-meta">${escapeHTML(quiz.module || "General")} · ${escapeHTML(quiz.difficulty || "mixed")}</div>
                    <h3>${escapeHTML(quiz.title)}</h3>
                    <p>${escapeHTML(truncate(quiz.summary || "", 120))}</p>
                    <div class="card-actions">
                        <a class="btn btn-secondary btn-small" href="#/quiz/${quiz.id}">Start</a>
                        ${progress ? `<span class="badge">Best ${progress.best}/${progress.total}</span>` : ""}
                    </div>
                </article>
            `
        }).join("") || `<p class="muted">No quizzes match your search.</p>`
    }

    render()
    searchInput.addEventListener("input", render)
}

async function renderQuizDetail(app, quizId){
    app.innerHTML = `<p class="muted">Loading quiz...</p>`
    const quiz = await loadJSON(`../data/quizzes/${quizId}.json`)
    if(!quiz){
        app.innerHTML = `
            <h2>Quiz not found</h2>
            <p>We could not load this quiz.</p>
            <a class="btn btn-secondary" href="#/quiz">Back to quizzes</a>
        `
        return
    }

    let currentIndex = 0
    let score = 0

    const renderQuestion = ()=>{
        const question = quiz.questions[currentIndex]
        if(!question){
            finishQuiz()
            return
        }

        app.innerHTML = `
            <section class="page-header">
                <div>
                    <div class="eyebrow">${escapeHTML(quiz.module || "General")} · ${escapeHTML(quiz.difficulty || "mixed")}</div>
                    <h1>${escapeHTML(quiz.title)}</h1>
                    <p>Question ${currentIndex + 1} of ${quiz.questions.length}</p>
                </div>
            </section>
            <section class="quiz-card">
                <h3>${escapeHTML(question.question)}</h3>
                <div class="choice-list">
                    ${question.choices.map(choice=>`
                        <button class="choice" data-choice="${escapeHTML(choice)}">${escapeHTML(choice)}</button>
                    `).join("")}
                </div>
                <div id="quizFeedback" class="quiz-feedback"></div>
                <div class="quiz-actions">
                    <button id="nextQuestion" class="btn btn-primary" disabled>Next</button>
                </div>
            </section>
        `

        const feedback = document.getElementById("quizFeedback")
        const nextButton = document.getElementById("nextQuestion")
        const choices = document.querySelectorAll(".choice")

        choices.forEach(btn=>{
            btn.addEventListener("click", ()=>{
                const selected = btn.getAttribute("data-choice")
                const correct = selected === question.correct_answer
                if(correct) score++

                choices.forEach(choice=>{
                    choice.disabled = true
                    if(choice.getAttribute("data-choice") === question.correct_answer){
                        choice.classList.add("correct")
                    }
                    else if(choice === btn){
                        choice.classList.add("incorrect")
                    }
                })

                feedback.innerHTML = `
                    <p class="${correct ? "success" : "danger"}">
                        ${correct ? "Correct!" : "Not quite."}
                    </p>
                    <p>${escapeHTML(question.explanation)}</p>
                `
                nextButton.disabled = false
            })
        })

        nextButton.addEventListener("click", ()=>{
            currentIndex++
            renderQuestion()
        })
    }

    const finishQuiz = ()=>{
        Progress.recordQuizScore(quizId, score, quiz.questions.length)
        XP.awardForQuiz(score, quiz.questions.length)
        Streak.update()

        app.innerHTML = `
            <section class="page-header">
                <h1>Quiz Complete</h1>
                <p>You scored ${score} out of ${quiz.questions.length}.</p>
            </section>
            <section class="card">
                <p>Review explanations or try another quiz to improve.</p>
                <div class="card-actions">
                    <button id="retryQuiz" class="btn btn-primary">Retry</button>
                    <a class="btn btn-secondary" href="#/quiz">Back to quizzes</a>
                </div>
            </section>
        `
        const retry = document.getElementById("retryQuiz")
        if(retry){
            retry.addEventListener("click", ()=>{
                currentIndex = 0
                score = 0
                renderQuestion()
            })
        }
    }

    renderQuestion()
}
