var fs = require('fs-extra');
var mv = require('mv');
var path = require('path');
var version = require('./package').version;
var nugget = require('nugget');
var homePath = require('home-path');
var mkdir = require('mkdirp');
var pathExists = require('path-exists');
var extract = require('extract-zip');

var libs = path.resolve(__dirname, 'deps', process.platform, process.arch,'lib');

var downloadUrl = 'http://repository.jibo.com/nlu/jibo-nlu-js/';
var platform = process.platform;
var arch = process.arch
if (platform == 'win32') {
    // Windows atom supports only 32 bits (as of 1.2.4)
    arch = 'ia32';
} else if (platform == 'linux') {
    // Linux atom supports only 64 bits (as of 1.2.4)
    arch = 'x64';
} else if (platform == 'darwin') {
    // darwin macos comes only in x64 flavor 
    arch = 'x64';
}
var target = 'jibo-nlu-js-v' + version + '-' + platform + '-' + arch + '.zip';
var targetDir = 'jibo-nlu-js';
downloadUrl += target;

var cacheDir = path.join(homePath(), '.jibo', 'tmp');

var opts = {
    target: target,
    dir: cacheDir,
    verbose: true,
    strictSSL: true,
    resume: true
};


fs.remove(cacheDir, function() {
    fs.mkdirsSync(cacheDir);
    nugget(downloadUrl, opts, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        extract(path.join(cacheDir, target), {dir: cacheDir}, function (err) {
            if (err) {
                console.error(err);
                return;
            }
            fs.copySync(path.join(cacheDir, targetDir), __dirname, {clobber: true});
            fs.remove(cacheDir, function() {});
        });
    });
});

