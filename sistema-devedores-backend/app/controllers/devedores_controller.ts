import Devedor from '#models/devedor'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

// 🔹 Validators
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

// 🔹 Função para limpar máscara
function limparNumero(valor: string) {
  return valor.replace(/\D/g, '')
}

export default class DevedoresController {

  // 📄 LISTAR
  async index() {
    return await Devedor.all()
  }

  // 🔍 BUSCAR POR ID
  async show({ params, response }: HttpContext) {
    const devedor = await Devedor.find(params.id)

    if (!devedor) {
      return response.notFound({ message: 'Devedor não encontrado' })
    }

    return devedor
  }

  // ➕ CRIAR
  async store({ request, response }: HttpContext) {
    let { nome, cpf, cnpj, telefone } = await request.validateUsing(createDevedorValidator)

    // 🔹 regra: precisa ter CPF ou CNPJ
    if (!cpf && !cnpj) {
      return response.badRequest({ erro: 'Informe CPF ou CNPJ' })
    }

    // 🔹 regra: não pode ter os dois
    if (cpf && cnpj) {
      return response.badRequest({ erro: 'Informe apenas CPF ou CNPJ' })
    }

    // 🔹 limpar máscara
    cpf = cpf ? limparNumero(cpf) : undefined
    cnpj = cnpj ? limparNumero(cnpj) : undefined
    telefone = telefone ? limparNumero(telefone) : undefined

    // 🔹 valida tamanho
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

  // ✏️ EDITAR
  async update({ params, request, response }: HttpContext) {
    const devedor = await Devedor.find(params.id)

    if (!devedor) {
      return response.notFound({ message: 'Devedor não encontrado' })
    }

    let { nome, cpf, cnpj, telefone } = await request.validateUsing(updateDevedorValidator)

    // 🔹 só valida se veio CPF ou CNPJ
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

    // 🔹 limpar telefone
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

  // ❌ DELETAR
  async destroy({ params, response }: HttpContext) {
    const devedor = await Devedor.find(params.id)

    if (!devedor) {
      return response.notFound({ message: 'Devedor não encontrado' })
    }

    await devedor.delete()

    return response.ok({ message: 'Devedor deletado com sucesso' })
  }
}