const
    _data = require('./module/_data'),
    _sort = require('./module/_sort'),
    _path = require('./module/_path');
    
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
        dirPath: function(val) {
            _dir.dirArr = _path.dirArray(val);
            _dir.getDir();
        }
    },
    methods: {
        getDir: function(dir) {
            this.dirPath = dir || this.dirPath;
            document.location.hash = "#dir=" + this.dirPath;
            _dir.list = [];
            _dir.loading = true;
            _dir.msg = '加载中……';
            _data.getDir(this.dirPath, (res) => {
                if (res.status) {
                    _dir.error = false;
                    res = res.data;
                    let
                        data = {},
                        sort = [],
                        fileSort = [],
                        dirSort = [],
                        errSort = [];

                    res.forEach((now) => {
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
                    sort.forEach((now) => {
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
        getFile: function(path) {
            document.location.href = '/file?path=' + path + '&dir=' + this.dirPath;
        }
    }
});

let _downItemNum = 0;
$('input').keydown((e) => {
    switch (e.keyCode) {
        case 13:
            _dir.getDir($('input').val());
            _downItemNum = 0;
            break;
        case 38:
            _downItemNum--;
            _downItemNum = _downItemNum < 0 ? $('.history .list-group li').length - 1 : _downItemNum;
            $('input').val($('.history .list-group li').eq(_downItemNum).html());
            $('.history .list-group li').removeClass('list-group-item-success').eq(_downItemNum).addClass('list-group-item-success')
            break;
        case 40:
            _downItemNum = _downItemNum > $('.history .list-group li').length - 1 ? 0 : _downItemNum;
            $('input').val($('.history .list-group li').eq(_downItemNum).html());
            $('.history .list-group li').removeClass('list-group-item-success').eq(_downItemNum).addClass('list-group-item-success')
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

_data.getHistory((res) => {
    if (res.dir || location.hash.replace('#dir=', '')) {
        _dir.getDir(res.data.dir || location.hash.replace('#dir=', '') || res.data.savePath[0]);
    }
    _dir.savePath = res.data.savePath;
});
window.onhashchange = (e) => {
    _dir.dirPath = location.hash.replace('#dir=', '');
}
window._dir = _dir;