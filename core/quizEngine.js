/**
 * Return a random subset from a question pool.
 * @param {Array<object>} pool
 * @param {number} count
 */
export function randomQuestions(pool, count){
    const shuffled = [...(pool || [])]

    for(let i = shuffled.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1))
        const temp = shuffled[i]
        shuffled[i] = shuffled[j]
        shuffled[j] = temp
    }

    return shuffled.slice(0, count)
}
