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
} from '@mui/material'

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

  useEffect(() => {
    if (open) {
      setNome(initialData?.nome || '')
      setDocumento(initialData?.cpf || initialData?.cnpj || '')
      setTelefone(initialData?.telefone || '')

      setCep(initialData?.cep || '')
      setRua(initialData?.rua || '')
      setNumero(initialData?.numero || '')
      setComplemento(initialData?.complemento || '')
      setBairro(initialData?.bairro || '')
      setCidade(initialData?.cidade || '')
      setUf(initialData?.uf || '')

      setErro('')
    }
  }, [open, initialData])

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
      cep,
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
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="CPF ou CNPJ"
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
              onChange={(e) => setCep(e.target.value)}
              sx={{ width: 180 }}
            />

            <TextField
              label="Rua"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              fullWidth
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
            />

            <TextField
              label="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              fullWidth
            />

            <TextField
              label="UF"
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              sx={{ width: 120 }}
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
  )
}