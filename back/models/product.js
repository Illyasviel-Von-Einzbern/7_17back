import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '商品名稱必須填寫'],
      trim: true,
      minlength: [1, '商品名稱至少需要 1 個字元'],
      maxlength: [100, '商品名稱最多只能 100 個字元'],
    },
    price: {
      type: Number,
      required: [true, '價格必須填寫'],
      min: [0, '價格不能是負數'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, '描述最多只能 500 個字元'],
    },
    category: {
      type: String,
      required: [true, '分類必須填寫'],
      enum: {
        values: ['遊戲', '電子產品', '服裝', '家居用品', '書籍', '玩具', '食品', '其他'],
        message: '請選擇有效的分類',
      },
    },
    sell: {
      type: Boolean,
      default: true,
      required: [true, '是否上架必須填寫'],
    },
    image: {
      type: String,
      required: [true, '商品圖片必須放上'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('products', schema)
