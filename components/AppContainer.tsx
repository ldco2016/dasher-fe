import React from 'react'
import { lighten, useTheme, styled } from '@mui/system'
import PersonIcon from '@mui/icons-material/Person'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AlunaLogo from '../public/images/logo_simple.svg'
import { Drawer, List, ListItem } from '@mui/material'
import { NextLink } from 'components'
import { useRouter } from 'next/router'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { MAIN_NAV_WIDTH, MAIN_NAV_WIDTH_SM } from '../constants'
import clsx from 'clsx'
import useMediaQuery from '@mui/material/useMediaQuery'
import Header from './Header'
import StatusIcon from 'components/icons/StatusIcon'

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
}))

const DrawerStyle = styled(Drawer)(({ theme }) => ({
  width: MAIN_NAV_WIDTH_SM,
  [theme.breakpoints.up('lg')]: {
    width: MAIN_NAV_WIDTH,
  },
  flexShrink: 0,
  '& .MuiPaper-root': {
    width: MAIN_NAV_WIDTH_SM,
    [theme.breakpoints.up('lg')]: {
      width: MAIN_NAV_WIDTH,
    },
  },
}))

const ListItemStyle = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
  fontSize: '0.85rem',
  padding: 0,

  flexDirection: 'column',
  '&>a': {
    padding: `${theme.spacing(1.3)} ${theme.spacing(1.3)}`,
    [theme.breakpoints.down('lg')]: {
      textAlign: 'center',
    },
  },
  '&.active > a': {
    borderRight: `3px solid ${theme.palette.secondary.light}`,
    background: lighten(theme.palette.primary.light, 0.85),
    color: 'black',
    '&:hover': {
      background: lighten(theme.palette.primary.light, 0.8),
    },
    '& svg': {
      color: theme.palette.secondary.light,
    },
  },
  '& > a': {
    width: '100%',
    color: 'black',
    '& span': {
      display: 'none',
      [theme.breakpoints.up('lg')]: {
        display: 'inline-block',
      },
      marginLeft: theme.spacing(1),
    },
    '& svg': {
      color: theme.palette.grey[500],
      verticalAlign: 'middle',
      marginTop: -5,
      marginRight: '6px',
    },
  },
  '& li': {
    marginTop: 0,
    flexDirection: 'column',

    '&.active': {
      borderRight: `3px solid ${theme.palette.secondary.light}`,
      background: lighten(theme.palette.primary.light, 0.85),
      color: 'black',
      '&:hover': {
        background: lighten(theme.palette.primary.light, 0.8),
      },
      '& svg': {
        color: theme.palette.secondary.light,
      },
    },
    '&.disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
    },
  },

  '&.activeSubitem': {
    fontWeight: 'bold',
    '& a': {
      color: theme.palette.primary.main,
    },
  },
}))

const ListPrimaryStyle = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(6),
}))

const ToolbarStyle = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}))

const ListSecondaryStyle = styled(List)(({ theme }) => ({
  position: 'absolute',
  fontSize: '0.85rem',
  bottom: 0,
  width: '100%',
  alignSelf: 'center',
  '& li': {
    marginTop: theme.spacing(1),
  },
}))

const menuItems = [
  {
    label: 'Dashboard',
    link: '/',
    statusIcon: false,
    icon: <DashboardIcon />,
  },
  {
    label: 'Patients',
    link: '/patients',
    statusIcon: false,
    icon: <PersonIcon />,
  },
  {
    label: 'Billing',
    link: '/billing',
    statusIcon: true,
    icon: <ReceiptIcon />,
  },
  // { // I'd like to use a permission flag on this. AR-316
  //   label: 'Clinics',
  //   link: '/clinics',
  //   icon: <LocationCityIcon />,
  // },
  // {
  //   label: 'Inbox',
  //   link: '/inbox',
  //   icon: <InboxOutlinedIcon />,
  // },
]

const menuItemsLower = [
  //{
  // label: 'My Clinic',
  // link: '/my-clinic/add-patients',
  // icon: <DomainIcon />,
  // submenuItems: [
  //   {
  //     label: 'Add Patients',
  //     link: '/my-clinic/add-patients',
  //     disabled: false,
  //   },
  // { //Removed for the time being... https://alunacare.atlassian.net/browse/AR-318
  //   label: 'Accept Patients',
  //   link: '/my-clinic/accept-patients',
  //   disabled: false,
  // },
  // { //Removed for the time being... https://alunacare.atlassian.net/browse/AR-319
  //   label: 'Archives',
  //   link: '/my-clinic/add-patients',
  //   disabled: true,
  // },
  // {
  //   label: 'Prospective Patient',
  //   link: '/my-clinic/prospects',
  //   disabled: false,
  // },
  // ],
  //},
]

export default function AppContainer(props) {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [mobileOpen, setMobileOpen] = React.useState(isMobile)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <RootStyle>
        <DrawerStyle
          open={mobileOpen}
          variant={isMobile ? 'temporary' : 'permanent'}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          anchor="left"
        >
          <ToolbarStyle style={{ display: 'flex', justifyContent: 'center' }}>
            <AlunaLogo width="33" fill={theme.palette.secondary.main} />
          </ToolbarStyle>

          <ListPrimaryStyle>
            {menuItems.map(({ statusIcon, label, icon, link }, index) => {
              if (link.substring(1) === 'billing' && !router.query.billing)
                return

              return (
                <ListItemStyle
                  key={index}
                  className={clsx(
                    router.pathname
                      .substring(1)
                      .startsWith(link.substring(1)) &&
                      link !== '/' &&
                      'active',
                    link === '/' && router.pathname === '/' && 'active'
                  )}
                  component="li"
                  button
                >
                  <NextLink data-cy={label} href={link}>
                    <StatusIcon active={statusIcon} />
                    {icon}
                    <span>{label}</span>
                  </NextLink>
                </ListItemStyle>
              )
            })}
          </ListPrimaryStyle>

          <ListSecondaryStyle>
            {/* <Divider /> */}
            {menuItemsLower.map((item, index) => {
              return (
                <ListItemStyle
                  key={index}
                  className={clsx(
                    router.pathname
                      .substring(1)
                      .startsWith(item.link.substring(1)) &&
                      item.link !== '/' &&
                      'active',
                    item.link === '/' && router.pathname === '/' && 'active'
                  )}
                  component="li"
                >
                  <NextLink href={item.link} data-cy={item.label}>
                    {item.icon}
                    <span>{item.label}s</span>
                  </NextLink>

                  <List>
                    {item.submenuItems.map((subItem, index) => {
                      return (
                        <ListItemStyle
                          key={`${index}_1`}
                          component="li"
                          className={clsx(
                            router.pathname === subItem.link &&
                              item.link !== '/' &&
                              'activeSubitem',
                            subItem.disabled && 'disabled'
                          )}
                        >
                          <NextLink
                            href={!subItem.disabled ? subItem.link : ''}
                          >
                            {subItem.label}
                          </NextLink>
                        </ListItemStyle>
                      )
                    })}
                  </List>
                </ListItemStyle>
              )
            })}
          </ListSecondaryStyle>
        </DrawerStyle>
        {props.children}
      </RootStyle>
    </>
  )
}
