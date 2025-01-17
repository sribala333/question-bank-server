const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Dynamically set folder based on file field name
    let folder = 'uploads/';
    if (file.fieldname === 'profilePicture') {
      folder += 'profile_pictures';
    } else if (file.fieldname === 'document') {
      folder += 'documents';
    } else {
      folder += 'others';
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
