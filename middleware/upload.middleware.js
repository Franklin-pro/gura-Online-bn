import multer from 'multer';
import path from 'path';
import fs from 'fs';  // Import the 'fs' module

// Create the 'uploads' directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // creates directory if it doesn't exist
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);  // Use the defined uploadDir variable
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp3|wav/;  //Regex of allowed file extensions
    const mimetypes = /image\/jpeg|image\/jpg|image\/png|image\/gif|audio\/mpeg|audio\/wav/; // Regex of allowed mime types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true); // No error, accept the file
    } else {
        // Create a more specific error message
        let errorMessage = 'Error: Only images (jpeg, jpg, png, gif) and audio files (mp3, wav) are allowed!';
        return cb(new Error(errorMessage)); // Pass the error to Multer
    }
}

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: { fileSize: 10 * 1024 * 1024 } // Example: 10MB limit (adjust as needed)
});

// Middleware to upload multiple files with specific names
const uploadMiddleware = (fields) => {
    return (req, res, next) => {
        const uploadFiles = upload.fields(fields);

        uploadFiles(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    // Handle Multer errors specifically (e.g., file size limit exceeded)
                    return res.status(400).json({ message: `Multer error: ${err.message}` });
                } else if (err) {
                    // Handle other errors (e.g., file type validation errors)
                    return res.status(400).json({ message: err.message }); // Access the error message
                }
                return res.status(500).json({ message: 'An unexpected error occurred during upload.' });
            }
            next();
        });
    };
};

export default uploadMiddleware;