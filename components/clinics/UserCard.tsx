import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material'
import Moment from 'react-moment'
import { useTheme } from '@mui/material/styles'
import { lighten } from '@mui/system'

import { IUserCard } from 'types'

const UserCard = ({ user, editInvite }: IUserCard) => {
  const theme = useTheme()
  const { title, email, firstName, middleName, lastName, phone } =
    user.viewHealthWorkerDto

  return (
    <Box
      sx={{
        borderRadius: '5px',
        backgroundColor:
          user.roleDescription !== 'admin'
            ? theme.palette.grey[100]
            : lighten(theme.palette.warning.main, 0.8),
        padding: `${theme.spacing(1.5)} ${theme.spacing(2)} ${theme.spacing(
          1.5
        )} ${theme.spacing(2)} `,
        position: 'relative',
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h2"
          sx={{ lineHeight: theme.spacing(4), fontSize: '12px' }}
          display="inline"
        >
          {user.roleDescription.toUpperCase()}{' '}
          {user.roleDescription.toUpperCase() === 'ADMIN' && '/ DOCTOR'}
        </Typography>

        <Button
          size="small"
          onClick={() => {
            editInvite(user)
          }}
          fullWidth={false}
          sx={{ minWidth: '35px', fontWeight: 'bold' }}
        >
          Edit
        </Button>
      </Box>

      <Typography variant="h2" sx={{ mb: 1, mt: 1 }}>
        {title} {firstName} {middleName} {lastName}
      </Typography>
      <Typography variant="body2">{email}</Typography>
      <Typography variant="body2">{phone}</Typography>
      {!user.completedOn && (
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.vibrantOrange.main,
            textAlign: 'right',
            position: 'absolute',
            fontWeight: 'bold',
            right: theme.spacing(2),
            bottom: theme.spacing(1.5),
          }}
        >
          Pending ...
        </Typography>
      )}
    </Box>
  )
}

export default UserCard
