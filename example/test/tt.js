/**
 * Created by Joker on 18/1/20.
 */

let a = {"name": "a", "age": 1}
let b = JSON.parse(JSON.stringify(a))

for (let asa in b) {
    console.log(asa + " " + b[asa])
}

