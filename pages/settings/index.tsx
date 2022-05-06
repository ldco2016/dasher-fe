import React, { useContext, useEffect } from 'react'
import { useAppContext } from 'context'
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material'
import usePermissions from 'hooks/usePermissions'
import { styled } from '@mui/system'
import { useSession } from 'next-auth/client'
import env from '@beam-australia/react-env'
import packageJson from 'package.json'

const ListItemStyle = styled(ListItem)(() => ({
  paddingLeft: 0,
}))

function Settings() {
  const { state, dispatch } = useAppContext()
  const { permissions } = usePermissions()
  const [session] = useSession()

  useEffect(() => {
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: {
        pageHeading1: '',
        pageHeading2: 'My Settings',
      },
    })
  }, [])

  return (
    <Grid item>
      <Typography variant="h1" gutterBottom>
        Personal Information
      </Typography>

      <List dense={true}>
        <ListItemStyle>
          <ListItemText>
            <Typography variant="body2" display="inline">
              Name &nbsp;
            </Typography>
            <Typography variant="body1" display="inline">
              {session && session.user.firstName}{' '}
              {session && session.user.lastName}
            </Typography>
          </ListItemText>
        </ListItemStyle>
        <ListItemStyle>
          <ListItemText>
            <Typography variant="body2" display="inline">
              Email &nbsp;
            </Typography>
            <Typography variant="body1" display="inline">
              {session.user.email}
            </Typography>
          </ListItemText>
        </ListItemStyle>
      </List>

      <Typography variant="h1" sx={{ mt: 3 }} gutterBottom>
        Password Reset
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: '450px' }}>
        To reset your password, contact your sales representative or submit a
        request to{' '}
        <Link href="mailto:providers@alunacare.com">
          providers@alunacare.com
        </Link>
      </Typography>

      <Typography variant="h1" sx={{ mt: 4 }} gutterBottom>
        Add Staff Members
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: '450px' }}>
        To add staff members to your dashboard, contact your sales
        representative or submit a request to&nbsp;
        <Link href="mailto:providers@alunacare.com">
          providers@alunacare.com
        </Link>
      </Typography>

      <Typography variant="h1" sx={{ mt: 4 }} gutterBottom>
        Legal Documents
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: '450px' }}>
        Review our&nbsp;
        <Link href="/legal/privacy">Privacy Policy</Link>
        &nbsp;and&nbsp;
        <Link href="/legal/terms">Terms of Use</Link>
      </Typography>

      {/* {window.location.hostname === 'localhost' && ( */}
      <>
        <Typography variant="h1" sx={{ mt: 4 }} gutterBottom>
          User Permissions
        </Typography>
        <List dense={true}>
          {permissions?.map((permission, index) => (
            <ListItemStyle key={index}>
              <ListItemText primary={permission} />
            </ListItemStyle>
          ))}
        </List>
        <Typography variant="h1" sx={{ mt: 4 }} gutterBottom>
          Version Info:{' '}
          {packageJson && packageJson.version
            ? packageJson.version
            : '[unknown]'}
        </Typography>
        <Typography variant="body1">
          <b>Current commit sha1 </b>
          {env('CURRENT_COMMIT_SHA1')}
        </Typography>
      </>
      {/* )} */}
    </Grid>
  )
}

Settings.layout = 'default'
Settings.auth = true
export default Settings
