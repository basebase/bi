/**
 * Created by Joker on 18/1/9.
 */

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


/***
 * 小试牛刀

let p = new Promise((resolve, reject) => {
    resolve(42)
    reject(33)
})

p.then((value) => {
    console.log(1)
    console.log(value)
}, (error) => {
    console.log(2)
    console.log(error)
}).catch((error) => {
    console.log(error)
})

 ***/


function getURL(url) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('GET', url, true)
        req.onload = () => {
            if (req.status === 200)
                resolve(req.responseText)
            else
                reject(new Error(req.statusText))
        }

        req.onerror = () => {
            reject(new Error(req.statusText))
        }

        req.send()
    })
}

let url = "http://httpbin.org/get"
getURL(url).then((value) => {
    console.log(value)
}).catch((error) => {
    console.log(error)
})