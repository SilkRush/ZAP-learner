import { Storage } from "../core/storage.js"

const KEY = "streak"

/**
 * Daily activity streak tracking.
 */
export const Streak = {

update(){

    const today = new Date().toDateString()

    const data = Storage.get(KEY,{count:0,longest:0,last:null})

    if(data.last === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate()-1)

    if(data.last === yesterday.toDateString()){

        data.count++

    }
    else{

        data.count = 1

    }

    data.last = today
    data.longest = Math.max(data.longest || 0, data.count)

    Storage.set(KEY,data)

},

get(){

    return Storage.get(KEY,{count:0}).count

},

getLongest(){
    return Storage.get(KEY,{longest:0}).longest
},

getData(){
    return Storage.get(KEY,{count:0,longest:0,last:null})
}

}
