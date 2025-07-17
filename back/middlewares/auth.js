import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

export const login = (req, res, next) => {
  // 使用 passport 的 login 驗證方法
  passport.authenticate('login', { session: false }, (error, user, info) => {
    // passport.authenticate(驗證方法, 設定, 處理function)
    // session: false = 停用 cookie
    // 處理function 的 (error, user, info) 對應 done() 的三個東西
    if (!user || error) {
      // 如果沒有收到使用者資料，或發生錯誤
      if (info?.message === 'Missing credentials') {
        // Local 驗證策略內建的錯誤，缺少帳號密碼欄位時會發生
        return res.status(StatusCodes.BAD_REQUEST).json({
          // 對應 400 狀態碼，表示請求錯誤
          success: false,
          message: '請提供帳號密碼',
        })
      } else if (!error && info) {
        // 不是發生錯誤，但是驗證失敗，例如收到 "使用者不存在" 或 "密碼錯誤" 的訊息
        return res.status(StatusCodes.BAD_REQUEST).json({
          // 對應 400 狀態碼，表示請求錯誤
          success: false,
          message: info.message,
        })
      } else {
        // 其他錯誤
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          // 對應 500 狀態碼，表示伺服器內部錯誤
          success: false,
          message: '伺服器內部錯誤',
        })
      }
    }
    req.user = user
    // 如果驗證成功
    // 將查詢到的使用者資料放入 req 給後續的 middleware 或 controller 使用
    next()
    // 繼續下一步
  })(req, res, next)
}

export const token = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    console.log('passport.js token')
    console.log(error, data, info)
    if (!data || error) {
      if (info instanceof jwt.JsonWebTokenError) {
        // 是不是 JWT 錯誤，可能是過期、格式錯誤、SECRET 錯誤等
        return res.status(StatusCodes.BAD_REQUEST).json({
          // 400 錯誤碼
          success: false,
          message: '無效的 token',
        })
      }
      //
      else if (info) {
        // 其他 info，可能是查無使用者
        return res.status(StatusCodes.BAD_REQUEST).json({
          // 400 錯誤碼
          success: false,
          message: info.message || '無效的 token',
        })
      }
      //
      else {
        // 沒有 info，但是有錯誤
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          // 500 錯誤碼
          success: false,
          message: '伺服器內部錯誤',
        })
      }
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}

export const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    // 檢查使用者是否為管理員
    return res.status(StatusCodes.FORBIDDEN).json({
      // 403 錯誤碼
      success: false,
      message: '沒有權限存取此資源',
    })
  }
  next()
}
