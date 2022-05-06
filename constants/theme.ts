import { createTheme } from '@mui/material/styles'
import { lighten, darken, alpha } from '@mui/material/styles'
import { style } from '@mui/system'

// red #f74d58
// dark blue #184866
// light blue #037BD6
// grey #F1FSF6
// yellow #FFC765
// green
// brightBlue
declare module '@mui/material/Typography/Typography' {
  interface TypographyPropsVariantOverrides {
    logHeadingActive: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    warn: true
    roundPrimary: true
    secondary: true
    infoIcon: true
    solidRed: true
    solidPurple: true
    mediumGrey: true
    mediumGreyOutlined: true
    translucentBlue: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    success: true
    warning: true
    error: true
    default: true
    defaultErrorText: true
    pill: true
    pillSuccess: true
    pillWarning: true
    all: true
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    warnText: Palette['primary']
    vibrantOrange: Palette['primary']
    logoBlue: Palette['primary']
    brightBlue: Palette['primary']
    purple: Palette['primary']
    revenueGreen: Palette['primary']
  }
  interface PaletteOptions {
    warnText: PaletteOptions['primary']
    vibrantOrange: PaletteOptions['primary']
    logoBlue: PaletteOptions['primary']
    brightBlue: PaletteOptions['primary']
    purple: PaletteOptions['primary']
    revenueGreen: PaletteOptions['primary']
  }
}

const Theme = createTheme({
  palette: {
    primary: {
      main: '#037bd6',
    },
    secondary: {
      main: '#184866',
    },
    error: {
      main: '#f74d58',
    },
    warning: {
      main: '#ff9902',
    },
    info: {
      main: '#037BD6',
    },
    success: {
      main: '#4bb04f',
    },
    background: {
      default: '#f1f5f6',
    },
    warnText: {
      main: '#e68b03',
    },
    vibrantOrange: {
      main: '#fe7b69',
    },
    revenueGreen: {
      main: '#39B47E',
    },
    logoBlue: {
      main: '#517790',
    },
    brightBlue: {
      main: '#35BAF6',
    },
    purple: {
      main: '#9580C3',
    },
  },
  typography: {
    fontFamily: [
      'Lato',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),

    h1: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '.9rem',
      fontWeight: 'bold',
    },
    caption: {
      letterSpacing: -0.1,
    },
  },
})

Theme.components = {
  MuiTypography: {
    styleOverrides: {
      h1: {
        [Theme.breakpoints.down('xl')]: {
          fontSize: '1.2rem',
        },
      },
      body1: {
        color: Theme.palette.grey[800],
        [Theme.breakpoints.down('xl')]: {
          fontSize: '.8rem',
        },
      },
      body2: {
        color: Theme.palette.grey[700],
        fontSize: '0.9rem',
      },
    },
    variants: [
      {
        props: { variant: 'logHeadingActive' },
        style: {
          fontSize: '.9rem',
          fontWeight: 'bold',
          '&:before': {
            content: "''",
            display: 'inline-block',
            borderRadius: '8px',
            background: Theme.palette.primary.light,
            width: '10px',
            height: '10px',
            marginRight: '5px',
          },
        },
      },
    ],
  },

  MuiCssBaseline: {
    styleOverrides: {
      html: {
        width: '100%',
        height: '100%',
      },
      body: {
        width: '100%',
        height: '100%',
      },
    },
  },
  // Name of the component
  MuiButtonBase: {
    styleOverrides: {
      root: {
        '&.Mui-active': {
          '& .MuiSvgIcon-root': {
            fill: Theme.palette.primary.main,
          },
        },
      },
    },
    defaultProps: {
      // The props to change the default for.
      disableRipple: true, // No more ripple!
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: 'none',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        borderRadius: 5,
        height: '25px',
        textTransform: 'capitalize',
        '& .MuiSvgIcon-root': {
          width: 16,
          fontSize: '1rem',
        },
      },

      label: {
        paddingLeft: 8,
        paddingRight: 8,
        lineHeight: 'initial',
      },
    },
    variants: [
      {
        props: { variant: 'success' },
        style: {
          background: lighten(Theme.palette.success.main, 0.8),
          color: Theme.palette.success.dark,
          minWidth: 70,
        },
      },
      {
        props: { variant: 'warning' },
        style: {
          background: Theme.palette.warning.light,
          borderRadius: '20px',
          color: Theme.palette.grey[900],
        },
      },
      {
        props: { variant: 'error' },
        style: {
          background: Theme.palette.error.main,
          borderRadius: '20px',
          color: 'white',
          paddingLeft: 6,
          '& svg': {
            fill: 'white',
          },
          '& .MuiChip-icon': {
            marginTop: '1px',
            marginLeft: 0,
            marginRight: '-4px',
            width: '18px',
            color: 'white',
            fill: 'white',
          },
        },
      },
      {
        props: { variant: 'default' },
        style: {
          background: Theme.palette.grey[200],
          borderRadius: '20px',
          color: `${Theme.palette.grey[900]}`,
        },
      },
      {
        props: { variant: 'defaultErrorText' },
        style: {
          color: `${Theme.palette.error.main}`,
          background: Theme.palette.grey[200],
          minWidth: 70,
        },
      },
      {
        props: { variant: 'pill' },
        style: {
          borderRadius: Theme.spacing(2),
          marginRight: Theme.spacing(1),
          paddingRight: Theme.spacing(0.5),
          '& svg': {
            marginLeft: '2px!important',
            width: '22px',
          },
        },
      },
      {
        props: { variant: 'pillSuccess' },
        style: {
          background: Theme.palette.success.main,
          color: 'white',

          borderRadius: Theme.spacing(2),
          marginRight: Theme.spacing(1),

          '& svg': {
            width: '24px',
            fill: 'white',
          },
        },
      },
      {
        props: { variant: 'all' },
        style: {
          background: Theme.palette.primary.main,
          color: 'white',
          borderRadius: Theme.spacing(2),
          marginRight: Theme.spacing(1),
        },
      },

      {
        props: { variant: 'pillWarning' },
        style: {
          background: Theme.palette.warning.main,
          color: 'white',

          borderRadius: Theme.spacing(2),
          marginRight: Theme.spacing(1),

          '& svg': {
            width: '24px',
            fill: 'white',
          },
        },
      },
    ],
  },

  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderColor: Theme.palette.primary.main,
        color: Theme.palette.primary.main,

        '&.Mui-selected': {
          backgroundColor: lighten(Theme.palette.primary.light, 0.8),
          color: Theme.palette.primary.main,
          '&:hover': {
            backgroundColor: lighten(Theme.palette.primary.light, 0.9),
          },
        },
        '&:hover': {
          backgroundColor: lighten(Theme.palette.primary.light, 0.9),
          borderLeft: `1px solid ${Theme.palette.primary.main}!important`,
        },
      },

      sizeSmall: {
        padding: `${Theme.spacing(0.3)} ${Theme.spacing(1.8)}`,
      },
    },
  },

  MuiButton: {
    variants: [
      {
        props: { variant: 'warn' },
        style: {
          textTransform: 'none',
          fontSize: 13,
          color: `${Theme.palette.error.main}`,
          border: `1px solid ${Theme.palette.error.main}`,
          background: lighten(Theme.palette.error.light, 0.8),
        },
      },
      {
        props: { variant: 'solidRed' },
        style: {
          textTransform: 'none',
          fontSize: 13,
          color: 'white',
          border: `1px solid ${Theme.palette.error.main}`,
          background: Theme.palette.error.main,
          '&:hover': {
            background: darken(Theme.palette.error.main, 0.2),
            border: `1px solid ${darken(Theme.palette.error.main, 0.2)}`,
          },
        },
      },
      {
        props: { variant: 'solidPurple' },
        style: {
          textTransform: 'none',
          fontSize: 13,
          color: 'white',
          border: `1px solid ${Theme.palette.purple.main}`,
          background: Theme.palette.purple.main,
          '&:hover': {
            background: darken(Theme.palette.purple.main, 0.2),
            border: `1px solid ${darken(Theme.palette.purple.main, 0.2)}`,
          },
        },
      },
      {
        props: { variant: 'mediumGrey' },
        style: {
          textTransform: 'none',
          fontSize: 13,
          color: 'white',
          border: `1px solid ${Theme.palette.grey[400]}`,
          background: Theme.palette.grey[400],
          '&:hover': {
            background: Theme.palette.grey[500],
            border: `1px solid ${Theme.palette.grey[500]}`,
          },
        },
      },
      {
        props: { variant: 'mediumGreyOutlined' },
        style: {
          textTransform: 'none',
          fontSize: 13,
          color: 'black',
          border: `1px solid ${Theme.palette.grey[400]}`,
          background: 'white',
          '&:hover': {
            border: `1px solid ${Theme.palette.grey[500]}`,
          },
        },
      },
      {
        props: { variant: 'translucentBlue' },
        style: {
          textTransform: 'none',
          fontSize: 13,
          color: Theme.palette.primary.main,
          border: `1px solid ${Theme.palette.primary.light}`,
          background: lighten(Theme.palette.primary.light, 0.9),
          '&:hover': {
            background: lighten(Theme.palette.primary.light, 0.7),
            border: `1px solid ${Theme.palette.primary.main}`,
          },
        },
      },
      {
        props: { variant: 'secondary' },
        style: {
          color: Theme.palette.primary.main,
          background: lighten(Theme.palette.info.light, 0.85),
        },
      },
      {
        props: { variant: 'roundPrimary' },
        style: {
          borderRadius: 25,
          padding: `0 ${Theme.spacing(1.5)}`,
          color: 'white',
          background: Theme.palette.primary.main,
          '&:hover': {
            background: Theme.palette.primary.dark,
          },
        },
      },
      {
        props: { variant: 'infoIcon' },
        style: {
          borderRadius: '2px',
          color: Theme.palette.info.light,
          padding: 1,
          width: 'auto',
          minWidth: '24px',
          lineHeight: 1,
          '& svg': {
            width: '18px',
          },
          '&:hover': {
            backgroundColor: lighten(Theme.palette.info.light, 0.8),
          },
        },
      },
    ],
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 'bold',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },

      sizeSmall: {
        // Adjust spacing to reach minimal touch target hitbox
        // fontSize: 25,
        // marginLeft: 4,
        // marginRight: 4,
        // padding: 12,
      },
    },
  },

  MuiTableContainer: {
    styleOverrides: {
      root: {
        overflow: 'visible',
      },
    },
  },

  MuiToolbar: {
    styleOverrides: {
      dense: {
        paddingLeft: `${Theme.spacing(6)}!important`,

        [Theme.breakpoints.down('lg')]: {
          paddingLeft: `${Theme.spacing(3)}!important`,
        },
      },
      regular: {
        paddingTop: `${Theme.spacing(5)}`,
        paddingRight: `${Theme.spacing(6)}`,
        paddingBottom: `${Theme.spacing(4)}`,
        paddingLeft: `${Theme.spacing(6)}!important`,

        [Theme.breakpoints.down('lg')]: {
          paddingTop: `${Theme.spacing(3)}`,
          paddingRight: `${Theme.spacing(3)}`,
          paddingBottom: `${Theme.spacing(2)}`,
          paddingLeft: `${Theme.spacing(3)}!important`,
        },
      },
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: Theme.palette.grey[100],
        },
        '&.selected': {
          background: `${lighten(Theme.palette.info.light, 0.9)}!important`,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        [Theme.breakpoints.down('xl')]: {
          fontSize: '0.8rem;',
          padding: Theme.spacing(0.5),

          // Specicifity issue with material
          paddingRight: Theme.spacing(0.5),
        },
      },
      head: {
        background: 'white',
        verticalAlign: 'top',
        paddingBottom: Theme.spacing(2),
        transition: 'all .2s ease-in-out',
        paddingTop: `${Theme.spacing(1)}!important`,
        '&.sortable:hover': {
          background: Theme.palette.grey[100],
        },
        '&.notSortable *': {
          cursor: 'default',
        },
        '&:first-of-type': {
          paddingLeft: Theme.spacing(6),
          [Theme.breakpoints.down('lg')]: {
            paddingLeft: Theme.spacing(3),
          },
        },
        '& .th-content': {
          display: 'flex',
        },
        '& .th-caption': {
          display: 'flex',
          flexDirection: 'column',
          fontWeight: 'bold',
          lineHeight: 1.3,

          '& .MuiButtonBase-root': {
            alignItems: 'flex-start',
            flexDirection: 'row',
            textTransform: 'uppercase',
            '&:hover div': {
              color: Theme.palette.grey[900],
            },
            '& small': {
              textTransform: 'none',
              color: Theme.palette.grey[600],
              display: 'block',
              lineHeight: 1.9,
              [Theme.breakpoints.down('lg')]: {
                fontSize: '0.7rem',
              },
              [Theme.breakpoints.down('sm')]: {
                fontSize: '0.5rem',
              },
            },
          },
        },
        '&:after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          zIndex: '99999',
          left: 0,
          right: 0,
          bottom: 0,
          height: '7px',
          boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.15)',
        },
      },
      body: {
        '&:first-of-type': {
          paddingLeft: Theme.spacing(6),
          [Theme.breakpoints.down('lg')]: {
            paddingLeft: Theme.spacing(3),
          },
        },
        '&.sortable': {
          paddingLeft: Theme.spacing(2.6),
        },
      },
    },
  },

  MuiTablePagination: {
    styleOverrides: {
      root: {
        borderBottom: 'none',
      },
      toolbar: {
        minHeight: '0!important',
        paddingRight: '0!important',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        marginTop: -3,
      },
    },
  },

  MuiTableSortLabel: {
    styleOverrides: {
      root: {
        flexDirection: 'row-reverse!important',
        '& .sortIcoContainer': {
          width: '15px',
          display: 'flex',
          flexDirection: 'column',
          marginRight: '3px',
          '& .down, & .up': {
            width: '15px',
            height: '10px',
          },
        },

        '& .MuiSvgIcon-root.up, & .MuiSvgIcon-root.down': {
          color: Theme.palette.grey[400],
          fill: Theme.palette.grey[400],
        },

        '&.Mui-active': {
          '& .MuiSvgIcon-root.up, & .MuiSvgIcon-root.down': {
            color: Theme.palette.grey[400],
            fill: Theme.palette.grey[400],
          },

          '& *': {
            color: `${Theme.palette.primary.main}`,
            '& small': {
              color: 'inherit!important',
            },
          },

          '&.asc .up': {
            color: Theme.palette.primary.main,
            fill: Theme.palette.primary.main,
          },

          '&.desc .down': {
            color: Theme.palette.primary.main,
            fill: Theme.palette.primary.main,
          },
        },
      },

      active: {
        '& *': {
          color: `${Theme.palette.primary.main}`,
          '& small': {
            color: 'inherit!important',
          },
        },
      },
    },
  },

  MuiListItem: {
    styleOverrides: {
      root: {
        padding: `${Theme.spacing(0.3)} ${Theme.spacing(1)}`,
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: {
        position: 'absolute',
        zIndex: 5,
        top: 0,
        left: 0,
        right: 0,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        border: `1px solid ${Theme.palette.primary.main}`,
        filter: 'drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.2))',
      },
    },
  },
}
export default Theme
