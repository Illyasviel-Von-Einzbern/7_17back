import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as product from '../controllers/product.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.get('/', product.get)
router.get('/all', auth.token, auth.admin, product.getAll)
router.get('/:id', product.getId)
// 順序有差，先 all 再 id，才不會被 :id 把 all 當作 id
router.post('/', auth.token, upload, product.create)
router.patch('/:id', auth.token, auth.admin, upload, product.update)

export default router
