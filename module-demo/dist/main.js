/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/*!*****************************!*\
  !*** ./src/esmodule/lib.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   counter1: () => (/* binding */ counter1),
/* harmony export */   incCounter1: () => (/* binding */ incCounter1)
/* harmony export */ });
var counter1 = 3;
function incCounter1() {
    counter1++;
}

/***/ }),
/* 2 */
/*!*****************************!*\
  !*** ./src/commonjs/lib.js ***!
  \*****************************/
/***/ ((module) => {

var count = 3;
function incCounter() {
    count++;
};

module.exports = {
    count,
    incCounter
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esmodule_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esmodule/lib */ 1);

var mod = __webpack_require__(/*! ./commonjs/lib */ 2);

console.log(mod.count, 'first');
mod.incCounter();
console.log(mod.count, 'second');

console.log(_esmodule_lib__WEBPACK_IMPORTED_MODULE_0__.counter1, 'start');
_esmodule_lib__WEBPACK_IMPORTED_MODULE_0__.incCounter1();
console.log(_esmodule_lib__WEBPACK_IMPORTED_MODULE_0__.counter1, 'end');


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


})();

/******/ })()
;