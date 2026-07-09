import Divida from '#models/divida'
import Devedor from '#models/devedor'
import type { HttpContext } from '@adonisjs/core/http'

export default class DividasController {
  async indexPorDevedor({ params, response }: HttpContext) {
    const devedor = await Devedor.find(params.id)

    if (!devedor) {
      return response.notFound({ message: 'Devedor não encontrado' })
    }

    await devedor.load('dividas')

    return devedor.dividas
  }

  async index() {
    return await Divida.query()
      .preload('devedor')
      .orderBy('id', 'desc')
  }

  async storeParaDevedor({ params, request, response }: HttpContext) {
    const devedor = await Devedor.find(params.id)

    if (!devedor) {
      return response.notFound({ message: 'Devedor não encontrado' })
    }

    const data = request.only([
      'descricao',
      'valor',
      'data_vencimento',
      'status',
    ])

    return await Divida.create({
      ...data,
      devedorId: devedor.id,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const divida = await Divida.find(params.id)

    if (!divida) {
      return response.notFound({ message: 'Dívida não encontrada' })
    }

    const data = request.only([
      'descricao',
      'valor',
      'data_vencimento',
      'status',
    ])

    divida.merge(data)
    await divida.save()

    return divida
  }

  async destroy({ params, response }: HttpContext) {
    const divida = await Divida.find(params.id)

    if (!divida) {
      return response.notFound({ message: 'Dívida não encontrada' })
    }

    await divida.delete()

    return response.ok({
      message: 'Dívida deletada com sucesso',
    })
  }
}