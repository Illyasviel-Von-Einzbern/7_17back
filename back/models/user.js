import { Schema, Error, model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const cartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: [true, '商品必須填寫'],
    },
    quantity: {
      type: Number,
      required: [true, '數量必須填寫'],
      min: [1, '數量至少為 1'],
      default: 1,
    },
  },
  { versionKey: false },
)
const schema = new Schema(
  {
    account: {
      type: String,
      required: [true, '帳號必須填寫'],
      minlength: [4, '帳號至少需要 4 個字元'],
      maxlength: [20, '帳號最多只能 20 個字元'],
      unique: true,
      trim: true,
      validate: {
        validator(value) {
          return validator.isAlphanumeric(value)
        },
        message: '帳號只能包含英文字母和數字',
      },
    },
    email: {
      type: String,
      required: [true, '電子郵件必須填寫'],
      unique: true,
      trim: true,
      validate: {
        validator(value) {
          return validator.isEmail(value)
        },
        message: '請輸入有效的電子郵件地址',
      },
    },
    cart: {
      type: [cartSchema],
    },
    tokens: {
      type: [String],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, '密碼是必填的'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

schema.pre('save', function (next) {
  // 在保存前對密碼進行處理
  // 盡量用 function 不能用箭頭函式，因為箭頭函式沒有 this
  const user = this
  // this = 現在要保存的資料
  if (user.isModified('password')) {
    // 如果密碼欄位有修改，進行加密
    if (user.password.length < 4 || user.password.length > 20) {
      // 驗證密碼明文格式
      const error = new Error.validationError()
      // 如果密碼長度不符合要求，拋出 mongoose 的驗證錯誤
      // 用跟 mongoose 的 schema 驗證錯誤一樣的錯誤格式
      // 可以跟其他驗證錯誤一起處理
      error.addError(
        'password',
        new Error.validationError({ message: '密碼長度必須在 4 到 20 個字元之間' }),
      )
      // 設定密碼欄位錯誤
      next(error)
      // 繼續處理，把錯誤傳出去
      // mongoose 遇到錯誤就不會存資料庫
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
      // 密碼格式符合要求，使用 bcrypt 加密密碼
    }
  }

  if (user.isModified('tokens') && user.tokens.length > 10) {
    user.tokens.shift()
  }
  // 限制有效 token 數量

  next()
  // next = 讓 mongoose 繼續處理
  // https://mongoosejs.com/docs/middleware.html#middleware
})

schema.virtual('cartTotal').get(function () {
  // 虛擬的動態欄位
  // 盡量用 function 不要用箭頭
  // .get() 欄位資料的產生方式
  const user = this
  // this = 現在要保存的資料
  return user.cart.reduce((total, item) => {
    return total + item.quantity
  }, 0)
})

export default model('users', schema)
