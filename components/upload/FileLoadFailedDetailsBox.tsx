import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { List, ListItem, ListItemText } from '@mui/material'
import { IUploadError } from 'types/upload'

function generateTestData(): IUploadError[] {
  const testErrors: IUploadError[] = []
  for (let i = 0; i < 100; i++) {
    testErrors.push({
      name: `Test User ${i}`,
      missing: [`m-item 1-${i}`, `m-item 2-${i}`],
      invalid: [`i-item 1-${i}`, `i-item 2-${i}`],
    })
  }
  return testErrors
}

const FileLoadFailedDetailsBox = (props: { errors: IUploadError[] }) => {
  let { errors } = props
  if (errors.length === 0) errors = generateTestData()

  const styles = {
    textAlign: 'center',
    mx: 'auto',
    mb: '1em',
    width: '80%',
    '& > :not(style)': {
      m: 1,
      width: 1.0,
      height: 300,
    },
  }

  const listToDisplay = errors.map((itm) => (
    <ListItem disablePadding>
      <ListItemText>
        {itm.name} - <strong>Missing:</strong> {itm.missing.join(', ')};{' '}
        <strong>Invalid:</strong> {itm.invalid.join(', ')}
      </ListItemText>
    </ListItem>
  ))

  return (
    // @ts-ignore
    <Box sx={styles}>
      <Paper elevation={2} sx={{ overflow: 'scroll' }}>
        <List>{listToDisplay}</List>
      </Paper>
    </Box>
  )
}

export default FileLoadFailedDetailsBox
