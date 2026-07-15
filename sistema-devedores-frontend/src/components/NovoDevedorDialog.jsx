import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Button,
  Alert,
  Typography,
  Divider,
  CircularProgress,
  InputAdornment, 
  IconButton, 
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search' 

function formatarCep(valor) {
  const apenasNumeros = valor.replace(/\D/g, '')
  const limitado = apenasNumeros.slice(0, 8)     
  
  if (limitado.length > 5) {
    return `${limitado.slice(0, 5)}-${limitado.slice(5)}`
  }
  return limitado
}

export default function NovoDevedorDialog({
  open,
  onClose,
  onSave,
  erro,
  setErro,
  initialData,
}) {
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [telefone, setTelefone] = useState('')

  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')

  const [loadingCep, setLoadingCep] = useState(false)
  const [erroCep, setErroCep] = useState('')

  const [openCepDialog, setOpenCepDialog] = useState(false)
  const [cepData, setCepData] = useState(null)

  useEffect(() => {
    if (open) {
      setNome(initialData?.nome || '')
      setDocumento(initialData?.cpf || initialData?.cnpj || '')
      setTelefone(initialData?.telefone || '')

      setCep(initialData?.cep ? formatarCep(initialData.cep) : '')
      setRua(initialData?.rua || '')
      setNumero(initialData?.numero || '')
      setComplemento(initialData?.complemento || '')
      setBairro(initialData?.bairro || '')
      setCidade(initialData?.cidade || '')
      setUf(initialData?.uf || '')

      setErro('')
      setErroCep('')
    }
  }, [open, initialData, setErro])

  const buscarCep = async (valorCep) => {
    const cepLimpo = valorCep.replace(/\D/g, '')

    if (cepLimpo.length !== 8) {
      setErroCep('Digite um CEP válido (8 dígitos).')
      return
    }

    setLoadingCep(true)
    setErroCep('')

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        setErroCep('CEP não encontrado.')
      } else {
        setCepData({
          cep: data.cep,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          uf: data.uf || ''
        })
        setOpenCepDialog(true)
      }
    } catch (err) {
      setErroCep('Erro ao conectar com a busca de CEP.')
    } finally {
      setLoadingCep(false)
    }
  }


  const confirmarCep = () => {
    if (cepData) {
      setRua(cepData.logradouro)
      setBairro(cepData.bairro)
      setCidade(cepData.localidade)
      setUf(cepData.uf)
    }
    setOpenCepDialog(false)
    setCepData(null)
  }

  const cancelarCep = () => {
    setOpenCepDialog(false)
    setCepData(null)
  }

  const handleCepChange = (e) => {
    const valorFormatado = formatarCep(e.target.value)
    setCep(valorFormatado)
  }

  function validar() {
    if (!nome || !documento) {
      setErro('Preencha os campos obrigatórios')
      return false
    }

    const documentoLimpo = documento.replace(/\D/g, '')

    if (documentoLimpo.length < 11) {
      setErro('Documento inválido')
      return false
    }

    const payload = {
      nome,
      telefone,
      cep: cep.replace(/\D/g, ''), 
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
    }

    if (documentoLimpo.length <= 11) {
      payload.cpf = documentoLimpo
    } else {
      payload.cnpj = documentoLimpo
    }

    setErro('')
    return payload
  }

  function salvar() {
    const payload = validar()
    if (!payload) return
    onSave(payload)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {initialData ? 'Editar Devedor' : 'Novo Devedor'}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>

            {erro && (
              <Alert severity="error">
                {erro}
              </Alert>
            )}

            <Typography variant="h6">
              Dados do Devedor
            </Typography>

            <Divider />

            <TextField
              label="Nome *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="CPF ou CNPJ *"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                fullWidth
              />

              <TextField
                label="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                fullWidth
              />
            </Stack>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Endereço
            </Typography>

            <Divider />

            <Stack direction="row" spacing={2}>
              <TextField
                label="CEP"
                value={cep}
                onChange={handleCepChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    buscarCep(cep)
                  }
                }}
                error={!!erroCep}
                helperText={erroCep}
                sx={{ width: 180 }}
                inputProps={{ maxLength: 9 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loadingCep ? (
                        <CircularProgress size={20} />
                      ) : (
                        <IconButton 
                          onClick={() => buscarCep(cep)} 
                          edge="end"
                          title="Buscar CEP"
                        >
                          <SearchIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Rua"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: !!rua }}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Número"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                sx={{ width: 150 }}
                inputProps={{
                  maxLength: 5
                }}
              />

              <TextField
                label="Complemento"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: !!bairro }}
              />

              <TextField
                label="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: !!cidade }}
              />

              <TextField
                label="UF"
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                sx={{ width: 120 }}
                inputProps={{ maxLength: 2 }}
                InputLabelProps={{ shrink: !!uf }}
              />
            </Stack>

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={salvar}
          >
            {initialData ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

     
      <Dialog 
        open={openCepDialog} 
        onClose={cancelarCep}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Consulta Via CEP
        </DialogTitle>
        <DialogContent>
          {cepData && (
            <Stack spacing={0.5} sx={{ mt: 1, color: 'text.secondary' }}>
              <Typography>
                CEP: <strong>{cepData.cep}</strong>
              </Typography>
              <Typography>
                UF: <strong>{cepData.uf}</strong>
              </Typography>
              <Typography>
                Cidade: <strong>{cepData.localidade}</strong>
              </Typography>
              <Typography>
                Bairro: {cepData.bairro}
              </Typography>
              <Typography>
                Rua: {cepData.logradouro}
              </Typography>

              <Typography variant="body1" sx={{ mt: 3, pt: 2, color: 'text.primary' }}>
                Deseja atualizar o endereço?
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={cancelarCep} color="inherit">
            CANCELAR
          </Button>
          <Button onClick={confirmarCep} color="info">
            CONFIRMAR
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}