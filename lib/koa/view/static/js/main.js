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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***************************!*\
  !*** ./source/js/main.js ***!
  \***************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

const _data = __webpack_require__(/*! ./module/_data */ 1),
      _sort = __webpack_require__(/*! ./module/_sort */ 2),
      _path = __webpack_require__(/*! ./module/_path */ 3);

const _dir = new Vue({
    el: '#__dir',
    data: {
        list: [],
        dirPath: '',
        dirArr: [],
        savePath: [],
        msg: '',
        error: false,
        loading: true
    },
    watch: {
        dirPath: function (val) {
            _dir.dirArr = _path.dirArray(val);
            _dir.getDir();
        }
    },
    methods: {
        getDir: function (dir) {
            this.dirPath = dir || this.dirPath;
            document.location.hash = "#dir=" + this.dirPath;
            _dir.list = [];
            _dir.loading = true;
            _dir.msg = '加载中……';
            _data.getDir(this.dirPath, res => {
                if (res.status) {
                    _dir.error = false;
                    res = res.data;
                    let data = {},
                        sort = [],
                        fileSort = [],
                        dirSort = [],
                        errSort = [];

                    res.forEach(now => {
                        data[now.name] = now;
                        if (now.type == 'file') {
                            fileSort.push(now.name);
                        } else if (now.type == 'dir') {
                            dirSort.push(now.name);
                        } else {
                            errSort.push(now.name);
                        }
                    });

                    fileSort = _sort.letterUp(fileSort);
                    dirSort = _sort.letterUp(dirSort);
                    errSort = _sort.letterUp(errSort);
                    sort = sort.concat(dirSort, errSort, fileSort);
                    sort.forEach(now => {
                        now = data[now];
                        _dir.list.push({
                            name: now.name,
                            path: now.fullPath,
                            type: now.type,
                            error: now.error
                        });
                    });

                    //存储历史访问地址
                    if (_dir.savePath.indexOf(_dir.dirPath) > -1) {
                        let index = _dir.savePath.indexOf(_dir.dirPath);
                        _dir.savePath.splice(index, 1);
                    }
                    _dir.savePath.unshift(_dir.dirPath);
                    _dir.savePath.splice(10);
                    _dir.loading = false;
                    _dir.msg = `文件夹:【${dirSort.length}】 文件:【${fileSort.length}】 错误:【${errSort.length}】`;
                } else {
                    _dir.error = true;
                    _dir.msg = res.msg;
                }
            });
        },
        getFile: function (path) {
            document.location.href = '/file?path=' + path + '&dir=' + this.dirPath;
        }
    }
});

let _downItemNum = 0;
$('input').keydown(e => {
    switch (e.keyCode) {
        case 13:
            _dir.getDir($('input').val());
            _downItemNum = 0;
            break;
        case 38:
            _downItemNum--;
            _downItemNum = _downItemNum < 0 ? $('.history .list-group li').length - 1 : _downItemNum;
            $('input').val($('.history .list-group li').eq(_downItemNum).html());
            $('.history .list-group li').removeClass('list-group-item-success').eq(_downItemNum).addClass('list-group-item-success');
            break;
        case 40:
            _downItemNum = _downItemNum > $('.history .list-group li').length - 1 ? 0 : _downItemNum;
            $('input').val($('.history .list-group li').eq(_downItemNum).html());
            $('.history .list-group li').removeClass('list-group-item-success').eq(_downItemNum).addClass('list-group-item-success');
            _downItemNum++;
            break;

        default:
            break;
    }
});

$('input').on('focus', () => {
    _downItemNum = 0;
    $('.history .list-group li').removeClass('list-group-item-success');
    $('.history').addClass('active');
});

$('input').on('blur', () => {
    setTimeout(() => {
        $('.history').removeClass('active');
    }, 100);
});

_data.getHistory(res => {
    if (res.dir || location.hash.replace('#dir=', '')) {
        _dir.getDir(res.data.dir || location.hash.replace('#dir=', '') || res.data.savePath[0]);
    }
    _dir.savePath = res.data.savePath;
});
window.onhashchange = e => {
    _dir.dirPath = location.hash.replace('#dir=', '');
};
window._dir = _dir;

/***/ }),
/* 1 */
/*!***********************************!*\
  !*** ./source/js/module/_data.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

/**
 * 数据
 */

const _data = (() => {
    let data = {
        lastPath: ''
    };

    let canGetDir = true;

    function getDir(path, fn) {
        if (canGetDir) {
            canGetDir = false;
            fn = fn || function () {};
            $.ajax({
                //post | get
                type: "post",
                url: "./dir",
                data: {
                    path: path
                },
                //txml | html | script | json | jsonp | text
                dataType: "json",
                success: function (res) {
                    fn(res);
                },
                error: function (err) {
                    fn({
                        status: false,
                        msg: '网络错误！'
                    });
                },
                complete: function (val) {
                    canGetDir = true;
                }
            });
        }
    }

    function getData() {
        return data;
    }

    let canGetHistory = true;

    function getHistory(fn) {
        if (canGetHistory) {
            canGetHistory = false;
            $.ajax({
                //post | get
                type: "post",
                url: "/history",
                //txml | html | script | json | jsonp | text
                dataType: "json",
                success: function (res) {
                    fn(res);
                },
                error: function (err) {
                    fn({
                        status: false,
                        msg: '网络错误!'
                    });
                },
                complete: function (val) {
                    canGetHistory = true;
                }
            });
        }
    }

    return {
        getDir: getDir,
        getData: getData,
        getHistory: getHistory
    };
})();

module.exports = _data;

/***/ }),
/* 2 */
/*!***********************************!*\
  !*** ./source/js/module/_sort.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

/**
 * 排序
 */

const _sort = (() => {

    function letterUp(arr) {
        return arr.sort((a, b) => {
            return a.localeCompare(b);
        });
    }

    return {
        letterUp: letterUp
    };
})();
module.exports = _sort;

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** ./source/js/module/_path.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

const _path = (() => {
    function dirArray(path = '') {
        let nowPath = path.replace(/\\/g, '/').split(/\/|\\/g),
            arr = [],
            str = '';
        nowPath.forEach(v => {
            if (v) {
                str += v + '/';
                arr.push(str);
            }
        });
        arr.pop();
        return arr;
    }

    return {
        dirArray: dirArray
    };
})();

module.exports = _path;

/***/ })
/******/ ]);
//# sourceMappingURL=maps/main.js.map