let
    canGetDir = true,
    canGetFile = true;
const _dir = new Vue({
    el: '#__dir',
    data: {
        list: [],
        dirPath: '',
        msg: '',
        error: false
    },
    methods: {
        getDir: function() {
            if (canGetDir) {
                canGetDir = false;
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
                            _dir.msg = res.error;
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
            if (canGetFile) {
                canGetFile = false;
                document.location.href = '/file?path=' + path + '&dir=' + this.dirPath;
            }
        }
    }
});


window._dir = _dir;