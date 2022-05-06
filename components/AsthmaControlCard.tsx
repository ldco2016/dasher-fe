import React from 'react'
import { lighten, darken, useTheme } from '@mui/material/styles'
import {
  Card,
  Button,
  CardContent,
  CardActions,
  Typography,
  Grid,
} from '@mui/material'

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import clsx from 'clsx'
import { styled } from '@mui/system'
import { GeneralObject } from 'types'

const ControlCard = styled(Card)(({ theme }) => ({
  background: theme.palette.grey[100],
  border: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: 'none',
  minHeight: 210,
  '&.good': {
    background: lighten(theme.palette.info.light, 0.8),
    border: `1px solid ${theme.palette.info.main}`,
    '& header': {
      background: lighten(theme.palette.info.main, 0.3),
    },
    '& .MuiCardActions-root': {
      borderTop: `1px solid ${theme.palette.info.main}`,
    },
  },
  '&.notWell': {
    background: lighten(theme.palette.warning.light, 0.8),
    border: `1px solid ${theme.palette.warning.main}`,
    '& header': {
      background: darken(theme.palette.warning.main, 0.1),
    },
    '& .MuiCardActions-root': {
      borderTop: `1px solid ${theme.palette.warning.main}`,
    },
  },
  '&.poor': {
    background: lighten(theme.palette.error.light, 0.8),
    border: `1px solid ${theme.palette.error.main}`,
    '& header': {
      background: darken(theme.palette.error.main, 0.0),
    },
    '& .MuiCardActions-root': {
      borderTop: `1px solid ${theme.palette.error.main}`,
    },
  },
  '&.notes': {
    background: 'green',
    border: 'green',
    '& header': {
      background: 'green',
    },
    '& .MuiCardActions-root': {
      borderTop: `1px solid 'green'`,
    },
  },
}))

const ControlCardHeader = styled('header')(({ theme }) => ({
  background: theme.palette.grey[400],
  padding: `${theme.spacing(2.5)} ${theme.spacing(2)}`,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'nowrap',
}))

const CardActionsStyle = styled(CardActions)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.grey[300]}`,
}))

interface IAsthmaControlCard {
  patient: GeneralObject
  mode: 'notes' | 'status'
}

export default function AsthmaControlCard({
  patient,
  mode,
}: IAsthmaControlCard) {
  const [expanded, setExpanded] = React.useState(false)
  const theme = useTheme()

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <ControlCard
        className={
          clsx()
          // patient.asthmaControl === 'Not Good' && 'notWell',
          // patient.asthmaControl === 'Poor' && 'poor',
          // true && 'good'
        }
      >
        <ControlCardHeader>
          <Typography variant="h1" display="inline">
            <ReportProblemOutlinedIcon
              sx={{ verticalAlign: 'middle', marginTop: '-5px' }}
            />{' '}
            {/* {patient.asthmaControl} */}
            Good
          </Typography>
          <Typography
            variant="body1"
            display="inline"
            align="right"
            sx={{ flexGrow: 1, color: 'white' }}
          >
            Asthma Control Level
          </Typography>
        </ControlCardHeader>

        <CardContent>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant="h2" gutterBottom>
                5.52x
              </Typography>
              <Typography variant="caption" component="div">
                Rescue Used
              </Typography>
              <Typography variant="caption" component="div">
                Last 3 days
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h2" gutterBottom>
                4 days
              </Typography>
              <Typography variant="caption" component="div">
                FEV1 in Red Zone
              </Typography>
              <Typography variant="caption" component="div">
                Last 7 days
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h2" gutterBottom>
                5.52x
              </Typography>
              <Typography variant="caption" component="div">
                Severe Symptoms
              </Typography>
              <Typography variant="caption" component="div">
                Last 2 days
              </Typography>
            </Grid>{' '}
          </Grid>
        </CardContent>
        <CardActionsStyle>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ minWidth: 163 }}
          >
            Request&nbsp;Appointment
          </Button>
          {patient.asthmaControl === 'Poor' && (
            <Button color="primary" fullWidth variant="warn">
              Dismiss Warning
            </Button>
          )}
        </CardActionsStyle>
      </ControlCard>
    </>
  )
}
