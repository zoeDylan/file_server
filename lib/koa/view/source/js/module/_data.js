/**
 * 数据
 */

const
    _data = (() => {
        let data = {
            lastPath: ''
        };

        let canGetDir = true;

        function getDir(path, fn) {
            if (canGetDir) {
                canGetDir = false;
                fn = fn || function() {};
                $.ajax({
                    //post | get
                    type: "post",
                    url: "./dir",
                    data: {
                        path: path
                    },
                    //txml | html | script | json | jsonp | text
                    dataType: "json",
                    success: function(res) {
                        fn(res);
                    },
                    error: function(err) {
                        fn({
                            status: false,
                            msg: '网络错误！'
                        })
                    },
                    complete: function(val) {
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
                    success: function(res) {
                        fn(res);
                    },
                    error: function(err) {
                        fn({
                            status: false,
                            msg: '网络错误!'
                        });
                    },
                    complete: function(val) {
                        canGetHistory = true;
                    }
                });
            }
        }

        return {
            getDir: getDir,
            getData: getData,
            getHistory: getHistory
        }
    })();



module.exports = _data;