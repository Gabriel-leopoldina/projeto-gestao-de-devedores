// ../formatadores.js

// função pra formtar o cnpj ou o cpf
export function formatarDocumento(documento) {
  if (!documento) return ''

  const numero = documento.replace(/\D/g, '')

  if (numero.length === 11) {
    return numero.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    )
  }
  
  if (numero.length === 14) {
    return numero.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    )
  }

  return numero
}

//função pra formatar data no padrão brasileiro

export function formatarDataBrasileira(dataString) {
    if (!dataString) return '-'

    const dataBruta = String(dataString).trim()
    const apenasData = dataBruta.split('T')[0] 

    if (apenasData.includes('-')) {
      const [ano, mes, dia] = apenasData.split('-')
      return `${dia}/${mes}/${ano}`
    }

    return apenasData
  }
