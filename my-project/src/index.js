import foo from './foo';
const test_prd_aaa = 1234567;
console.log(test_prd_aaa);
function max(a, b) {
    const c = 0;
    if (a>b) {
        c = a
    } else {
        c = b
    }
    return c;
}

console.log(max(2, 3));

export default function() {
    console.log(foo);
}