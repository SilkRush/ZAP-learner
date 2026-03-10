import { Storage } from "../core/storage.js"

const KEY = "progress"
const DEFAULT_STATE = { lessons: {}, quizzes: {}, paths: {} }

/**
 * Track lesson and quiz progress.
 */
export const Progress = {

getAll(){

    return normalize(Storage.get(KEY, DEFAULT_STATE))

},

completeLesson(id){

    const progress = normalize(Storage.get(KEY, DEFAULT_STATE))
    progress.lessons[id] = { completedAt: new Date().toISOString() }
    Storage.set(KEY, progress)

},

isCompleted(id){

    const progress = normalize(Storage.get(KEY, DEFAULT_STATE))
    return Boolean(progress.lessons[id])

},

recordQuizScore(id, score, total){
    const progress = normalize(Storage.get(KEY, DEFAULT_STATE))
    const current = progress.quizzes[id] || { best: 0, attempts: 0, total: total || 0 }
    const best = Math.max(current.best || 0, score)
    progress.quizzes[id] = {
        best,
        last: score,
        attempts: (current.attempts || 0) + 1,
        total: total || current.total || 0
    }
    Storage.set(KEY, progress)
},

getQuizScore(id){
    const progress = normalize(Storage.get(KEY, DEFAULT_STATE))
    return progress.quizzes[id] || null
},

getCompletedLessonIds(){
    const progress = normalize(Storage.get(KEY, DEFAULT_STATE))
    return Object.keys(progress.lessons || {})
}

}

function normalize(value){
    if(!value || typeof value !== "object"){
        return { ...DEFAULT_STATE }
    }
    if(value.lessons && value.quizzes){
        return value
    }
    const lessons = {}
    for(const key of Object.keys(value)){
        if(value[key] === true){
            lessons[key] = { completedAt: null }
        }
    }
    return { lessons, quizzes: {}, paths: {} }
}
