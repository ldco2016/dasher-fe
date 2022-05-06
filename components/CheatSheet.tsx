import { Typography, Grid, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ContentBlock from './ContentBlock'

const CheatSheet = () => {
  const theme = useTheme()
  return (
    <Grid item xs={12}>
      <ContentBlock>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Access the Cheat Sheet
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="body2">
              Get help onboarding patients, managing billing, and get answers to
              your most frequently asked questions.
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" color="primary" fullWidth>
              Get Cheat Sheet
            </Button>
          </Grid>
        </Grid>
      </ContentBlock>
    </Grid>
  )
}

export default CheatSheet
