import { Typography, Grid } from '@mui/material'
import ContentBlock from './ContentBlock'
import { styled } from '@mui/system'

const SpirometerStyle = styled('img')(({ theme }) => ({
  width: '95%',
  maxWidth: '170px',
  margin: `${theme.spacing(3)} 0 ${theme.spacing(1)} 0`,
}))

const BriefIntro = () => {
  return (
    <>
      <ContentBlock>
        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              A Brief Introduction
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Aluna is a portable, digital spirometry platform that:
            </Typography>
            <Typography variant="h3">Decreases Risk</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              By measuring patients lung function, medication use, symptoms,
              environmental factors, and exercise activities for a comprehensive
              lung health profile.
            </Typography>
            <Typography variant="h3">Increases Control </Typography>
            <Typography variant="body2">
              For practitioners through real-time, remote access to lung health
              data.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <SpirometerStyle
              src="/images/spirometer-blue-circle.png"
              alt="aluna spirometer"
            />
          </Grid>
        </Grid>
      </ContentBlock>
    </>
  )
}

export default BriefIntro
