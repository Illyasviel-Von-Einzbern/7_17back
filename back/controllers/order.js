import Order from '../models/order.js'
import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    // 檢查購物車有沒有東西
    if (req.user.cart.length === 0) throw new Error('EMPTY')

    // 檢查購物車有沒有下架商品
    const user = await User.findById(req.user._id, 'cart').populate('cart.product', 'sell')
    const hasUnsell = user.cart.some(item => !item.product.sell)
    if (hasUnsell) throw new Error('UNSELL')

    // 建立訂單
    await Order.create({
      user: req.user._id,
      cart: user.cart,
    })
    // 清空購物車
    req.user.cart = []
    await req.user.save()

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '訂單建立成功',
    })
  } catch (error) {
    console.error(error)
    if (error.message === 'EMPTY') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '購物車是空的',
      })
    } else if (error.message === 'UNSELL') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '購物車中有下架商品',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

export const getMy = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'account')
      .populate('cart.product')
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: orders,
    })
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'account')
      .populate('cart.product')
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: orders,
    })
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}
