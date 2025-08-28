
import multer from "multer";

const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, "./public/temp");
    },

    // 'filename' defines the name the file will have after being saved
    filename: function (req, file, cb) {
        // Using the original name of the uploaded file
        cb(null, file.originalname);
    }
});

// Creating an instance of multer with the specified storage configuration
export const upload = multer({
    storage,
});
