import * as mod1 from "./esmodule/lib";
var mod = require('./commonjs/lib');

console.log(mod.count, 'first');
mod.incCounter();
console.log(mod.count, 'second');

console.log(mod1.counter1, 'start');
mod1.incCounter1();
console.log(mod1.counter1, 'end');


async function async1() {
    await async2();
    console.log('async1end');
}

async function async2() {
    console.log('async2 end');
}
async1();

setTimeout(function() {
    console.log('settimeout');
}, 0);

new Promise(resolve => {
    console.log('promise');
    resolve();
}).then(function() {
    console.log('promise1');
}).then(function() {
    console.log('promise2');
})

