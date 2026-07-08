import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material'

export default function HomePage() {
  return (
    <>
      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total de Devedores
              </Typography>

              <Typography variant="h3">
                --
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Dívidas
              </Typography>

              <Typography variant="h3">
                --
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Valor Total
              </Typography>

              <Typography variant="h3">
                R$ --
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}