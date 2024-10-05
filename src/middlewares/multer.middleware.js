import multer  from 'multer';

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/temp');
        //cb is callback.  cb(null,'./public/temp') means no error and the destination is ./public/temp
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})


export const upload=multer({
    storage,
}) 