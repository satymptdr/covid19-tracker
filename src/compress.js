const brotli = require('brotli');
const zlib = require('zlib');
var fs = require('fs');

// compressing files
const brotliSettings = {
    extension: 'br',
    skipLarger: true,
    mode: 1, // 0 = generic, 1 = text, 2 = font (WOFF2)
    quality: 10, // 0 - 11,
    lgwin: 12 // default
};
var dirs = ['public/css', 'public/image', 'public/js', 'public/assets/bundles', 'public/assets/css', 'public/assets/images', 'public/assets/js', 'views', 'views/assets/bundles', 'views/assets/css', 'views/assets/js'];
dirs.forEach(dir => {
    fs.readdirSync(dir).forEach(fl => {
        if (fl.endsWith('.js') || fl.endsWith('.css') || fl.endsWith('.hbs') || fl.endsWith('.html') || fl.endsWith('.svg') || fl.endsWith('.jpg') || fl.endsWith('.png') || fl.endsWith('.gif')) {
            // brotli
            const result = brotli.compress(fs.readFileSync(dir + '/' + fl), brotliSettings);
            fs.writeFileSync(dir + '/' + fl + '.br', result);
            // gzip
            const fileContents = fs.createReadStream(dir + '/' + fl);
            const writeStream = fs.createWriteStream(dir + '/' + fl + '.gz');
            const zip = zlib.createGzip();
            fileContents
                .pipe(zip)
                .on('error', err => console.error(err))
                .pipe(writeStream)
                .on('error', err => console.error(err));
        }
        // console.log(file)
        // if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.hbs') || file.endsWith('.html')) {
        //     // brotli
        //     const result = brotli.compress(fs.readFileSync(dir + '/' + file), brotliSettings);
        //     fs.writeFileSync(dir + '/' + file + '.br', result);
        //     // gzip
        //     const fileContents = fs.createReadStream(dir + '/' + file);
        //     const writeStream = fs.createWriteStream(dir + '/' + file + '.gz');
        //     const zip = zlib.createGzip();
        //     fileContents
        //         .pipe(zip)
        //         .on('error', err => console.error(err))
        //         .pipe(writeStream)
        //         .on('error', err => console.error(err));
        // }
    })
});