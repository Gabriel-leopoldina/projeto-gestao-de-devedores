import Devedor from '#models/devedor'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'


const createDevedorValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3),
    cpf: vine.string().optional(),
    cnpj: vine.string().optional(),
    telefone: vine.string().optional(),
  })
)

const updateDevedorValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).optional(),
    cpf: vine.string().optional(),
    cnpj: vine.string().optional(),
    telefone: vine.string().optional(),
  })
)


function limparNumero(valor: string) {
  return valor.replace(/\D/g, '')
}

export default class DevedoresController {


async index({ request }: HttpContext) {
  const pesquisa = request.input('pesquisa')

  const query = Devedor.query()

  if (pesquisa) {
    query.where((builder) => {
      builder
        .whereILike('nome', `%${pesquisa}%`)
        .orWhereILike('cpf', `%${pesquisa}%`)
        .orWhereILike('cnpj', `%${pesquisa}%`)
        .orWhereILike('telefone', `%${pesquisa}%`)
    })
  }

  return await query.orderBy('nome')
}

  
  async show({ params, response }: HttpContext) {
    const devedor = await Devedor.find(params.id)

    if (!devedor) {
      return response.notFound({ message: 'Devedor não encontrado' })
    }

    return devedor
  }

  
  async store({ request, response }: HttpContext) {
    let { nome, cpf, cnpj, telefone } = await request.validateUsing(createDevedorValidator)

  
    if (!cpf && !cnpj) {
      return response.badRequest({ erro: 'Informe CPF ou CNPJ' })
    }

    if (cpf && cnpj) {
      return response.badRequest({ erro: 'Informe apenas CPF ou CNPJ' })
    }

    
    cpf = cpf ? limparNumero(cpf) : undefined
    cnpj = cnpj ? limparNumero(cnpj) : undefined
    telefone = telefone ? limparNumero(telefone) : undefined

    
    if (cpf && cpf.length !== 11) {
      return response.badRequest({ erro: 'CPF inválido' })
    }

    if (cnpj && cnpj.length !== 14) {
      return response.badRequest({ erro: 'CNPJ inválido' })
    }

    const devedor = await Devedor.create({
      nome,
      cpf,
      cnpj,
      telefone,
    })

    return devedor
  }


  async update({ params, request, response }: HttpContext) {
    const devedor = await Devedor.find(params.id)

    if (!devedor) {
      return response.notFound({ message: 'Devedor não encontrado' })
    }

    let { nome, cpf, cnpj, telefone } = await request.validateUsing(updateDevedorValidator)


    if (cpf || cnpj) {
      if (cpf && cnpj) {
        return response.badRequest({ erro: 'Informe apenas CPF ou CNPJ' })
      }

      cpf = cpf ? limparNumero(cpf) : undefined
      cnpj = cnpj ? limparNumero(cnpj) : undefined

      if (cpf && cpf.length !== 11) {
        return response.badRequest({ erro: 'CPF inválido' })
      }

      if (cnpj && cnpj.length !== 14) {
        return response.badRequest({ erro: 'CNPJ inválido' })
      }
    }

  
    telefone = telefone ? limparNumero(telefone) : undefined

    devedor.merge({
      nome,
      cpf,
      cnpj,
      telefone,
    })

    await devedor.save()

    return devedor
  }

  async destroy({ params, response }: HttpContext) {
    const devedor = await Devedor.find(params.id)

    if (!devedor) {
      return response.notFound({ message: 'Devedor não encontrado' })
    }

    await devedor.delete()

    return response.ok({ message: 'Devedor deletado com sucesso' })
  }
}