const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware')
const { uploadImageController,fetchImagesController,deleteImageController} = require('../controllers/image-controller')

const router = express.Router()

// upload the image
router.post(
  '/upload',
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single('image'),  // ⚠️ field name must match
  uploadImageController
)
//to get all the images
router.get("/get",authMiddleware,fetchImagesController)

//delete image 69a6c13bd8ad1138df55c0f3
router.delete("/:id",authMiddleware,adminMiddleware,deleteImageController)

module.exports = router