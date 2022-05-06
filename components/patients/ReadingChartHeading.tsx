import { Box, Typography } from '@mui/material'

interface IFlowVolumeKeyMetrics {
  flowVolume: {
    info: {
      fev1Raw: string
      gli: string
      fev1RawPef: string
      fev1Percentage: string //fev1Percentage is the gli per https://alunacare.atlassian.net/browse/AR-304
    }
  }
}

const ReadingChartHeading = ({
  flowVolume: {
    info: {
      fev1Raw = '--',
      gli = '--',
      fev1RawPef = '--',
      fev1Percentage = '--',
    },
  },
}: IFlowVolumeKeyMetrics) => {
  try {
    return (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-start',
          gap: 4,
          pb: 1,
        }}
      >
        <div>
          <Typography variant="body2">GLI %</Typography>
          <Typography variant="body1">
            <b>{fev1Percentage}</b>
          </Typography>
        </div>

        <div>
          <Typography variant="body2">FEV1</Typography>
          <Typography variant="body1">
            <b>{parseFloat(fev1Raw).toFixed(2)}</b> L
          </Typography>
        </div>
        <div>
          <Typography variant="body2">PEF</Typography>
          <Typography variant="body1">
            <b>{parseFloat(fev1RawPef).toFixed(2)}</b> L/sec
          </Typography>
        </div>
      </Box>
    )
  } catch (error) {
    return null
  }
}

export default ReadingChartHeading
