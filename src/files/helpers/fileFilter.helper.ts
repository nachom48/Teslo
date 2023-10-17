

export const fileFilter = (req:Express.Request, file:Express.Multer.File,callback:Function) => {
    
    //Este fileFilter,evalua el archivo,y si no es permitod, devuelve un False

    if(!file) return callback(new Error('File is empty'),false);

    const fileExtension = file.mimetype.split('/')[1];

    const validExtensions=['jpg','jpeg','png','gif'];

    if(validExtensions.includes(fileExtension)){
        return callback(null,true)
    }

    return callback(null,false)


}