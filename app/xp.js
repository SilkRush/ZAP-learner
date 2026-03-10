import { Storage } from "../core/storage.js"

const KEY = "xp"

/**
 * XP tracker for gamification.
 */
export const XP = {

/**
 * Get total XP.
 */
get(){

    return Storage.get(KEY,0)

},

/**
 * Add XP.
 * @param {number} amount
 */
add(amount){

    const xp = Storage.get(KEY,0)

    Storage.set(KEY,xp + amount)

},

/**
 * Award XP for completing a lesson.
 */
awardForLesson(){
    this.add(20)
},

/**
 * Award XP based on quiz performance.
 * @param {number} score
 * @param {number} total
 */
awardForQuiz(score, total){
    const ratio = total ? score / total : 0
    const points = Math.max(5, Math.round(30 * ratio))
    this.add(points)
},

/**
 * Award XP for finishing a learning path.
 */
awardForPath(){
    this.add(50)
},

reset(){

    Storage.set(KEY,0)

}

}
