const
    _path = (() => {
        function dirArray(path = '') {
            let
                nowPath = path.replace(/\\/g, '/').split(/\/|\\/g),
                arr = [],
                str = '';
            nowPath.forEach((v) => {
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
        }
    })();




module.exports = _path;