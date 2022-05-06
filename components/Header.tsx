import React, { useState } from 'react'
import {
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Avatar,
  Button,
} from '@mui/material'
import { signOut, useSession } from 'next-auth/client'
import { MAIN_NAV_WIDTH_SM, MAIN_NAV_WIDTH } from 'constants/'
import MenuIcon from '@mui/icons-material/Menu'
import { styled } from '@mui/system'
import fetch from 'libs/fetch'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import env from '@beam-australia/react-env'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import { CountUpTimer } from './patients/Timers'
import AlunaLogger from 'libs/AlunaLogger'
import { useAppContext } from 'context'
import BasicSupportDialog from './BasicSupportDialog'

const AppBarStyle = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  width: `calc(100%)px`,

  [theme.breakpoints.up('sm')]: {
    width: `calc(100% - ${MAIN_NAV_WIDTH_SM}px)`,
    marginLeft: `${MAIN_NAV_WIDTH_SM}px`,
  },
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${MAIN_NAV_WIDTH}px)`,
    marginLeft: `${MAIN_NAV_WIDTH}px`,
  },
}))

export default function Header({ handleDrawerToggle }) {
  const { state, dispatch } = useAppContext()
  const [anchorEl, setAnchorEl] = useState(null)
  const [session] = useSession()
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
  const [displaySupportDialog, setDisplaySupportDialog] = useState(false)
  const isMenuOpen = Boolean(anchorEl)
  const router = useRouter()
  const theme = useTheme()
  const logger = AlunaLogger('components:Header')

  const { token } = state

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const signOutAndInvalidate = async () => {
    if (state.timer.running) {
      logger.debug('stopping timer in Header')
      await state.timer.stopTimer()
    }

    // Invalidate the Aluna API token
    await fetch(`${env('PUBLIC_ALUNA_API')}/auth/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.accessToken}`,
      },
    })
      .then((response) => response.text())
      .then((result) => console.log('result: ', result))
      .catch((error) => {
        console.log('error', error)
        logger.error('Fetch error upon logout API', error)
      })

    // Sign out with next-auth
    signOut({ redirect: false, callbackUrl: '/auth/signin' })
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      data-cy="usermenu"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {session && (
        <Box sx={{ mt: 2, mb: 2, mr: 4, ml: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            {session && session.user.firstName}{' '}
            {session && session.user.lastName}
          </Typography>
          <Typography variant="body2">{session.user.email}</Typography>
        </Box>
      )}
      <Divider />
      {/* <MenuItem onClick={handleMenuClose}>Add new team member</MenuItem>
      <MenuItem onClick={handleMenuClose}>Office settings</MenuItem> */}
      <MenuItem
        data-cy="getSupport"
        onClick={() => {
          setDisplaySupportDialog(true)
        }}
      >
        Get support
      </MenuItem>
      <Divider />
      <MenuItem
        data-cy="mySettings"
        onClick={() => {
          router.push('/settings')
        }}
      >
        My Settings
      </MenuItem>
      {session && (
        <MenuItem data-cy={'signOutMenuItem'} onClick={signOutAndInvalidate}>
          Sign Out
        </MenuItem>
      )}
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'

  return (
    <Box sx={{ flexGrow: 1 }}>
      <BasicSupportDialog
        displayed={displaySupportDialog}
        closeDialog={() => setDisplaySupportDialog(false)}
      />

      <AppBarStyle position="sticky" color="transparent" elevation={0}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} data-cy="headerTitle">
            {state?.pageHeading.pageHeading1 && (
              // TODO: move to a styled component
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.grey[600],
                  fontWeight: 'normal',
                  display: 'inline',
                }}
              >
                {state.pageHeading.pageHeading1}{' '}
                <Box sx={{ display: 'inline', ml: 1, mr: 1 }}>/</Box>
              </Typography>
            )}

            {state?.pageHeading.pageHeading2 && (
              <Typography
                variant="h2"
                sx={{ fontWeight: 'normal', display: 'inline' }}
                noWrap
              >
                {state.pageHeading.pageHeading2}
              </Typography>
            )}
          </Box>

          <Box>
            {state?.pageHeading.component && state.pageHeading.component}

            {/* Show if on patients page */}
            {state.timer.running && (
              <Button
                data-cy="patientTimer"
                variant="mediumGreyOutlined"
                startIcon={<TimerOutlinedIcon />}
                sx={{ mr: 2 }}
              >
                <CountUpTimer />
              </Button>
            )}
            <IconButton
              data-cy="usermenubutton"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {session && (
                <Avatar
                  alt={session.user.name}
                  src={session.user.image}
                  sx={{
                    backgroundColor: theme.palette.vibrantOrange.main,
                    fontWeight: 'bold',
                  }}
                >
                  {session && session.user.firstName.slice(0, 1).toUpperCase()}
                </Avatar>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBarStyle>
      {renderMenu}
    </Box>
  )
}
