/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
<<<<<<< HEAD
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
=======
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
>>>>>>> alpha
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/js/public/atmodal.js":
/*!*****************************************!*\
  !*** ./assets/src/js/public/atmodal.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
        Name:  ATModal
        Version: 1.0
        Author: Sovware
        Author URI: https://sovware.com/
*/

/* disable-eslint */
var aazztechModal1 = function aazztechModal1(selector) {
  var element = document.querySelectorAll(selector);
  element.forEach(function (el, index) {
    el.style.display = 'none';
    document.addEventListener('click', function (event) {
      var current_elm = event.target;
      var target_id = current_elm.getAttribute('data-target');
      var el_id = el.getAttribute('id');

      if (target_id === el_id) {
        event.preventDefault();
        el.style.display = 'block';
        document.body.classList.add('atm-open');
        setTimeout(function () {
          el.classList.add('atm-show');
        }, 100);
        document.querySelector('html').style.overflow = 'hidden';
      }
    }, false);
    el.querySelector('a.at-modal-close').addEventListener('click', function (e) {
      e.preventDefault();
      el.classList.remove('atm-show');
      document.body.classList.remove('atm-open');
      setTimeout(function () {
        el.style.display = 'none';
      }, 100);
      document.querySelector('html').removeAttribute('style');
    });
    el.addEventListener('click', function (e) {
      if (e.target.closest('.atm-contents-inner')) return;
      el.classList.remove('atm-show');
      document.body.classList.remove('atm-open');
      setTimeout(function () {
        el.style.display = 'none';
      }, 100);
      document.querySelector('html').removeAttribute('style');
    });
  });
};

function initModal() {
  aazztechModal1('#dcl-claim-modal, #atbdp-report-abuse-modal, #atpp-plan-change-modal, #pyn-plan-change-modal');
}

window.addEventListener('load', function () {
  setTimeout(function () {
    initModal();
  }, 500);
});

/***/ }),

<<<<<<< HEAD
/***/ 11:
=======
/***/ 12:
>>>>>>> alpha
/*!***********************************************!*\
  !*** multi ./assets/src/js/public/atmodal.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./assets/src/js/public/atmodal.js */"./assets/src/js/public/atmodal.js");


/***/ })

/******/ });
//# sourceMappingURL=public-atmodal.js.map