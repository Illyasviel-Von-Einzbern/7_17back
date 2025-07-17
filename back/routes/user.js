import { Router } from 'express'
// import { create } from '../controllers/user.js'
import * as user from '../controllers/user.js'
// 方法二：可以改成 import * as user from '../controllers/user.js'
// import auth from '../middlewares/auth.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

// router.post('/', create)
router.post('/', user.create)
// 用方法二，create 要改成 user.create

// router.post('/login', auth.login, login)
router.post('/login', auth.login, user.login)
// 用方法二，login 要改成 user.login

router.get('/profile', auth.token, user.profile)

router.patch('/refresh', auth.token, user.refresh)

router.delete('/logout', auth.token, user.logout)

router.patch('/cart', auth.token, user.cart)

router.get('/cart', auth.token, user.getCart)

export default router
