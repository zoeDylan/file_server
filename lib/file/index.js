const { readdirSync, stat, constants, accessSync } = require('fs');


/**
 * 获取指定文件夹下面的内容
 * @param {*string} path 文件夹路径
 */

async function getDir(path = __dirname) {
    return new Promise((res, rej) => {
        try {
            let
                files = readdirSync(path),
                data = [];
            files.length > 0 ? files.forEach((file, i) => {
                (i => {
                    let
                        fullPath = path + '\\' + file,
                        nowFile = { name: file, fullPath: fullPath, type: null, error: false };
                    stat(fullPath, (e, stats) => {
                        if (e) {
                            nowFile.error = e;
                        } else {

                            nowFile.type = stats.isFile() ? 'file' : stats.isDirectory() ? 'dir' : false;
                        }
                        data.push(nowFile);
                        data.length >= files.length ? res({
                            status: true,
                            data: data
                        }) : '';
                    });
                })(i);
            }) : res({
                status: false,
                msg: 'no file'
            });

        } catch (error) {
            rej({
                status: false,
                error: error
            });
        }
    });
}

module.exports = {
    getDir: getDir
};