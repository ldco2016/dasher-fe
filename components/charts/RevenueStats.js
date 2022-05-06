import React, { useState, useEffect } from 'react'
import { Typography, Grid, Chip, Box, Paper } from '@mui/material'
import MetricArrow from '../icons/MetricArrow'
import { useTheme } from '@mui/system'
import NumberFormat from 'react-number-format'
import ContentBlock from 'components/ContentBlock'

const RevenueStats = ({ data }) => {
  const theme = useTheme()
  const { legend, values } = data

  const [arrowDirection, setArrowDirection] = useState('')
  const [chipVariant, setChipVariant] = useState('')

  useEffect(() => {
    if (values[1]?.valueInt == 0) {
      setArrowDirection(null)
      setChipVariant('default')
    }
    if (values[1]?.valueInt > 0) {
      setArrowDirection('up')
      setChipVariant('success')
    }
    if (values[1]?.valueInt < 0) {
      setArrowDirection('down')
      setChipVariant('error')
    }
  }, [arrowDirection, chipVariant])

  return (
    <ContentBlock
      sx={{
        maxWidth: '400px',
        ...theme.typography.body2,
        boxShadow: 'none',

        '& h1': {
          fontSize: '3rem',
          fontWeight: 'normal',
        },
        '& h2': {
          whiteSpace: 'nowrap',
          display: 'block',
          width: '100%',
        },
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2" sx={{ mb: 1 }}>
            {legend}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ minWidth: '160px' }}>
          <Typography variant="h1">
            <Box
              sx={{
                display: 'inline-block',
                color: theme.palette.grey[400],
                fontWeight: 'light',
              }}
            >
              $
            </Box>
            <NumberFormat
              value={values[0]?.valueInt}
              displayType={'text'}
              thousandSeparator={true}
            />
          </Typography>
          <Typography variant="body2">This month</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h1">
            {/* passing null ensures that no invalid propType warning is thrown */}
            <Chip
              icon={
                arrowDirection ? (
                  <MetricArrow direction={arrowDirection} />
                ) : null
              }
              variant={chipVariant}
              label={values[1]?.valueString}
            />
          </Typography>
          <Typography variant="body2">compared to last month</Typography>
        </Grid>
      </Grid>
    </ContentBlock>
  )
}

export default RevenueStats
