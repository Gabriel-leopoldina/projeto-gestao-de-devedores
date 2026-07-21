import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])

router.group(() => {
  
  
  router.get('/devedores', '#controllers/devedores_controller.index')
  router.post('/devedores', '#controllers/devedores_controller.store')
  router.get('/devedores/:id', '#controllers/devedores_controller.show')
  router.put('/devedores/:id', '#controllers/devedores_controller.update')
  router.delete('/devedores/:id', '#controllers/devedores_controller.destroy')
  
  
  router.get('/dividas', '#controllers/dividas_controller.index')
  router.put('/dividas/:id', '#controllers/dividas_controller.update')
  router.delete('/dividas/:id', '#controllers/dividas_controller.destroy')
  
  router.get('/devedores/:id/dividas', '#controllers/dividas_controller.indexPorDevedor')
  router.post('/devedores/:id/dividas', '#controllers/dividas_controller.storeParaDevedor')

}).use(middleware.auth())