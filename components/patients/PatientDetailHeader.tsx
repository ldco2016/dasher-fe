import React from 'react'
import { Typography, Grid, Button, Link, Box } from '@mui/material'
import { styled } from '@mui/system'
import Moment from 'react-moment'
import moment from 'moment'
import env from '@beam-australia/react-env'
import { GeneralObject } from 'types'
import NumberFormat from 'react-number-format'
import usePermissions from 'hooks/usePermissions'
import nameAdapter from '../../libs/nameAdapter'

const SpecList = styled('dl')(({ theme }) => ({
  margin: 0,
  display: 'inline-block',
  marginBottom: theme.spacing(1),
  '& dt': {
    display: 'inline-block',
    color: theme.palette.grey[800],
    fontSize: '0.8em',
    margin: '0 10px 0 0',
    textTransform: 'capitalize',
  },
  '& dd': {
    display: 'inline-block',
    margin: '0 0 0 0',
    '&:after': {
      content: "'|'",
      display: 'inline-block',
      margin: '0 10px',
    },
    '&:last-child': {
      marginRight: theme.spacing(2),
      '&:after': {
        display: 'none',
      },
    },
  },
}))

const SpecList2 = styled(SpecList)(({ theme }) => ({
  '& dt': {
    display: 'block',
  },
  '& dd': {
    fontWeight: 'bold',
    fontSize: '0.9em',
    '&:after': {
      content: "''",
    },
  },
}))

interface IPateientDetailHeader {
  patient: GeneralObject
  medications: GeneralObject
}

const PateientDetailHeader = ({
  patient,
  medications,
}: IPateientDetailHeader) => {
  const { permissionPublicUserId }: { permissionPublicUserId: boolean } =
    usePermissions()

  const {
    firstName,
    lastName,
    pui,
    dob,
    gender,
    heightInInches,
    ethnicity,
    email,
    phone,
    doctorDto,
  } = patient

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography data-cy="patient-name" variant="h2" sx={{ mb: 3 }}>
          {lastName?.trim()
            ? `${lastName?.trim()}, ${firstName?.trim()}`
            : nameAdapter(firstName)}
          {false && //For now, intentionally always hide
            permissionPublicUserId && (
              <Typography sx={{ display: 'inline' }}>
                <Box component="span" sx={{ mr: 1, ml: 1, display: 'inline' }}>
                  |
                </Box>{' '}
                {pui}
              </Typography>
            )}
        </Typography>
        <SpecList>
          <dt>DOB: </dt>
          <dd>
            {' '}
            <Moment format="MM/DD/YYYY" date={`${dob}`}></Moment>
          </dd>

          <dt>Sex:</dt>
          <dd>{gender}</dd>

          <dt>Age:</dt>
          <dd>
            <Moment diff={dob} unit="years">
              {moment.utc().toISOString()}
            </Moment>
          </dd>

          <dt>Height:</dt>
          <dd>
            {heightInInches && Math.floor(heightInInches / 12)}'{' '}
            {heightInInches && heightInInches % 12}"
          </dd>

          <dt>Ethnicity:</dt>
          <dd>{ethnicity}</dd>
        </SpecList>
        <Box sx={{ display: 'inline-block' }}>
          {phone && (
            <Button variant="roundPrimary" sx={{ mr: 2 }}>
              Call:{'  '}&nbsp;
              <NumberFormat
                value={phone}
                displayType={'text'}
                format={
                  parseInt(phone.match(/\d+/)[0][0]) === 1
                    ? '#+ (###) ###-####'
                    : '(###) ###-####'
                }
              />
            </Button>
          )}

          {email && (
            <Link href={`mailto:${email}`} target={email}>
              {email}
            </Link>
          )}
        </Box>
      </Grid>
      {medications?.map((med) => {
        return (
          <Grid item xs="auto" key={med.id}>
            <SpecList2>
              <dt>{med.medicationType} Medication: </dt>
              <dd>{med.tradeName}</dd>
            </SpecList2>
          </Grid>
        )
      })}

      {!medications?.length && (
        <>
          <Grid item xs="auto">
            <SpecList2>
              <dt>Controller Medication: </dt>
              <dd>none</dd>
            </SpecList2>
          </Grid>
          <Grid item xs="auto">
            <SpecList2>
              <dt>Rescue Medication: </dt>
              <dd>none</dd>
            </SpecList2>
          </Grid>
          <Grid item xs="auto">
            <SpecList2>
              <dt>Other Medication: </dt>
              <dd>none</dd>
            </SpecList2>
          </Grid>
        </>
      )}

      {doctorDto && (
        <Grid item xs="auto">
          <SpecList2>
            <dt>Physician: </dt>
            <dd>
              {doctorDto.firstName} {doctorDto.lastName}
            </dd>
          </SpecList2>
        </Grid>
      )}
    </Grid>
  )
}

export default PateientDetailHeader
