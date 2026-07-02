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

  useEffect(() => {
    if (open) {
      setNome(initialData?.nome || '')

      // se tiver cpf usa cpf, se não usa cnpj
      setDocumento(initialData?.cpf || initialData?.cnpj || '')

      setTelefone(initialData?.telefone || '')

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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? 'Editar Devedor' : 'Novo Devedor'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {erro && <Alert severity="error">{erro}</Alert>}

          <TextField
            label="Nome"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <TextField
            label="CPF ou CNPJ"
            fullWidth
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />

          <TextField
            label="Telefone"
            fullWidth
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>

        <Button variant="contained" onClick={salvar}>
          {initialData ? 'Atualizar' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}