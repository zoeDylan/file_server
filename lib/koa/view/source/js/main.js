let
    canGetDir = true;
const _dir = new Vue({
    el: '#__dir',
    data: {
        list: [],
        dirPath: __dirname,
        msg: '',
        error: false
    },
    methods: {
        getDir: function() {
            if (canGetDir) {
                canGetDir = false;
                document.location.hash = "#dir=" + this.dirPath;
                $.ajax({
                    //post | get
                    type: "post",
                    url: "./dir",
                    data: {
                        path: this.dirPath
                    },
                    //txml | html | script | json | jsonp | text
                    dataType: "json",
                    success: function(res) {
                        _dir.list.splice(0, _dir.list.length);
                        if (res.status) {
                            _dir.error = false;
                            _dir.msg = '';
                            res = res.data;
                            for (let i = 0; i < res.length; i++) {
                                let now = res[i];
                                _dir.list.push({
                                    name: now.name,
                                    path: now.fullPath,
                                    type: now.type,
                                    error: now.error
                                })
                            }
                        } else {
                            _dir.error = true;
                            _dir.msg = res.error || res.msg;
                        }
                    },
                    error: function(err) {
                        _dir.error = true;
                        _dir.msg = '网络错误!';
                    },
                    complete: function(val) {
                        canGetDir = true;
                    }
                });
            }
        },
        getFile: function(path) {
            document.location.href = '/file?path=' + path + '&dir=' + this.dirPath;
        }
    }
});

$('input').keydown((e) => {
    e.keyCode == 13 ? _dir.getDir() : '';
});

let canGetHistory = true;

function getHistory() {
    if (canGetHistory) {
        canGetHistory = false;
        $.ajax({
            //post | get
            type: "post",
            url: "/history",

            //txml | html | script | json | jsonp | text
            dataType: "json",
            success: function(res) {
                if (res.status) {
                    _dir.dirPath = res.data.dir;
                    _dir.getDir();
                }
            },
            error: function(err) {
                _dir.error = true;
                _dir.msg = '网络错误!';
            },
            complete: function(val) {
                canGetHistory = true;
            }
        });
    }
}
getHistory();

window.onhashchange = (e) => {
    _dir.dirPath = location.hash.replace('#dir=', '');
    _dir.getDir();
}
window._dir = _dir;