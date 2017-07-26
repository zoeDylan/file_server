/**
 * 排序
 */

const
    _sort = (() => {

        function letterUp(arr) {
            return arr.sort((a, b) => {
                return a.localeCompare(b);
            });
        }

        return {
            letterUp: letterUp
        }
    })();
module.exports = _sort;