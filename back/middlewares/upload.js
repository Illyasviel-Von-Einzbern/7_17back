import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
// 設定 cloudinary

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
  }),
  fileFilter(req, file, callback) {
    // req = 請求資訊
    // file = 檔案資訊
    // callback = (錯誤, 是否允許上傳)
    console.log('上傳檔案資訊：', file)
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      // 如果檔案類型是 JPEG 或 PNG，允許上傳
      callback(null, true)
    } else {
      // callback(new Error('只允許上傳 JPEG 或是 PNG 檔案'), false)
      callback(null, false)
    }
  },
  limits: {
    fileSize: 1024 * 1024,
    // 單位是Byte，限制檔案大小為 1MB
  },
})
// 上傳設定

export default (req, res, next) => {
  upload.single('image')(req, res, error => {
    if (error) {
      console.error('上傳錯誤：', error)
      res.status(StatusCodes.BAD_REQUEST).json({
        // 400 錯誤碼
        success: false,
        message: '檔案上傳失敗，請確保檔案類型為 JPEG 或 PNG，且大小不超過 1MB',
      })
      return
      // return 放 res 前或後都一樣
    }
    // if (!req.file) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     // 400 錯誤碼
    //     success: false,
    //     message: '請上傳檔案',
    //   })
    // }
    console.log('上傳成功：', req.file)
    next()
    // 繼續下一步
  })
}
