const multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.match(/jpeg|jpeg|png|gif$i/)) {
            cb(new Error('File is not supported'), false)
        }
        cb(null, true)
    }
})
//   module.exports = multer.diskStorage({
//     destination: (req, file, cb) => {
//        cb(null, './files/images/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + '-' + file.originalname);
//     },
//     fileStorage : (req, file, cb) => {
//             if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
//                 cb(null, true);
//             } else {
//                 cb(null, false);
//             }
//         }
// })
