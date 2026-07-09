import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return { hello: 'world' }
})

router.get('/devedores', '#controllers/devedores_controller.index')
router.post('/devedores', '#controllers/devedores_controller.store')
router.get('/devedores/:id', '#controllers/devedores_controller.show')
router.put('/devedores/:id', '#controllers/devedores_controller.update')
router.delete('/devedores/:id', '#controllers/devedores_controller.destroy')
router.get('/dividas', '#controllers/dividas_controller.index')
router.get('/devedores/:id/dividas', '#controllers/dividas_controller.indexPorDevedor')
router.post('/devedores/:id/dividas', '#controllers/dividas_controller.storeParaDevedor')

router.put('/dividas/:id', '#controllers/dividas_controller.update')
router.delete('/dividas/:id', '#controllers/dividas_controller.destroy')