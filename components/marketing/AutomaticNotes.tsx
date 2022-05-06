import { Typography } from '@mui/material'
import { styled } from '@mui/system'

const PaperA = styled('div')(({ theme }) => ({
  margin: theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: 423,
  minWidth: 250,
  zIndex: 1,
}))

const InfoImg = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(6),
  width: '100%',
}))

const InfoTipHeading = styled(Typography)(({ theme }) => ({
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  marginBottom: theme.spacing(1),
}))

const InfoTipCopy = styled(Typography)(() => ({
  color: 'white',
  textAlign: 'center',
}))

const AutomaticNotes = () => {
  return (
    <PaperA>
      <InfoImg src="/images/add-notes.png" alt="note type dropdown graphic" />
      <InfoTipHeading variant="h2">
        Save Time With Automatic Notes{' '}
      </InfoTipHeading>

      <InfoTipCopy>
        Use the dropdown to select the 'note type'. This automatically populates
        the note field with a summary of your activities.
      </InfoTipCopy>
    </PaperA>
  )
}

export default AutomaticNotes
