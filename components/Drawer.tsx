import React from 'react'
import { styled, useTheme } from '@mui/system'
import { IconButton, Drawer as MaterialDrawer, Toolbar } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import {
  DRAWER_WIDTH,
  DRAWER_WIDTH_SM,
  MAIN_NAV_WIDTH,
  MAIN_NAV_WIDTH_SM,
} from '../constants'
import { IDrawer } from 'types'

const ToggleArrowLeft = styled('div')(({ theme }) => ({
  right: 12,
  top: 80,
  position: 'absolute',
  '& button': {
    position: 'fixed',
    zIndex: '9999',
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '24px',
    height: '24px',
    background: 'white',
    borderRadius: '50%',
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
  },
}))

const ToggleArrowRight = styled('div')(({ theme }) => ({
  left: -12,
  top: 80,
  position: 'absolute',
  '& button': {
    position: 'fixed',
    zIndex: '9999',
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '24px',
    height: '24px',
    background: 'white',
    borderRadius: '50%',
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
  },
}))

const Drawer = ({
  children,
  handleToggleDrawer,
  open,
  anchor = 'left',
  sx,
  toolbar = true,
  attachedToMainNav = false,
}: IDrawer) => {
  const theme = useTheme()

  return (
    <MaterialDrawer
      variant="persistent"
      anchor={anchor}
      open={open}
      PaperProps={{
        elevation: 3,
        sx: { overflowY: 'visible', overflow: 'auto' },
      }}
      sx={{
        width: { sm: DRAWER_WIDTH_SM, xl: DRAWER_WIDTH },
        '& .MuiDrawer-paper': {
          width: { sm: DRAWER_WIDTH_SM, xl: DRAWER_WIDTH },

          ...(attachedToMainNav && {
            left: attachedToMainNav
              ? { sm: MAIN_NAV_WIDTH_SM, lg: MAIN_NAV_WIDTH }
              : 0,
          }),

          zIndex: 3,
          padding: `${theme.spacing(4)} ${theme.spacing(4)} 0px ${theme.spacing(
            4
          )}`,
          [theme.breakpoints.down('xl')]: {
            padding: `${theme.spacing(3)} ${theme.spacing(
              2
            )} 0px ${theme.spacing(2)}`,
          },
        },
        ...sx,
      }}
    >
      <>
        {toolbar && <Toolbar variant="dense" />}
        {anchor === 'left' && (
          <ToggleArrowLeft>
            <IconButton onClick={handleToggleDrawer} aria-label="close">
              <KeyboardArrowLeftIcon />
            </IconButton>
          </ToggleArrowLeft>
        )}

        {anchor === 'right' && (
          <ToggleArrowRight>
            <IconButton onClick={handleToggleDrawer} aria-label="close">
              <KeyboardArrowRightIcon />
            </IconButton>
          </ToggleArrowRight>
        )}

        {children}
      </>
    </MaterialDrawer>
  )
}

export default Drawer
