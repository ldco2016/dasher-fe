import { styled, lighten, darken } from '@mui/system'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Typography, Grid, Card } from '@mui/material'
import MetricArrow from './icons/MetricArrow'
import Link from 'next/link'
import { IDashCard } from 'types'

const Common = styled(Card)(({ theme }) => ({
  padding: `
  ${theme.spacing(2)} 
  ${theme.spacing(3)} 
  ${theme.spacing(2)} 
  ${theme.spacing(5)} `,
  display: 'inline-block',
  minHeight: 130,
  minWidth: 200,
  marginRight: theme.spacing(3),
  borderRadius: 10,
  position: 'relative',
  '& h1': {
    fontSize: '3rem',
    fontWeight: 'normal',
  },
  '& h2': {
    whiteSpace: 'nowrap',
    display: 'block',
    width: '100%',
  },
  '& h2 svg': {
    verticalAlign: 'middle',
    marginLeft: '-27px',
    marginTop: '-4px',
    marginRight: 5,
  },
  '& .arrowIcon': {
    position: 'absolute',
    right: 5,
    top: '50%',
    marginTop: '-12px!important',
    width: 18,
  },
}))

const SevereWarn = styled(Common)(({ theme }) => ({
  background: lighten(theme.palette.error.light, 0.9),
  border: `1px solid ${theme.palette.error.main}`,
  h1: {
    color: darken(theme.palette.error.main, 0.1),
  },
  '& h2 svg': {
    color: theme.palette.error.main,
  },
}))

const Warn = styled(Common)(({ theme }) => ({
  border: `1px solid ${theme.palette.error.main}`,
  h1: {
    color: theme.palette.error.main,
  },
  '& h2 svg': {
    color: theme.palette.error.main,
  },
}))

const Info = styled(Common)(({ theme }) => ({
  border: `1px solid #03A9F4`,
  '& h2 svg': {
    color: '#03A9F4',
  },
}))

const Default = styled(Common)(({ theme }) => ({
  //   border: '1px solid grey',
}))

const DashCard = ({
  heading = 'Heading',
  metric,
  subhead = null,
  icon = null,
  statSubhead = null,
  statMetric = null,
  statMetricUp = true,
  arrow = true,
  variant = 'default',
  href,
}: IDashCard) => {
  const components = {
    severeWarn: SevereWarn,
    warn: Warn,
    info: Info,
    default: Default,
  }
  const Component = components[variant]

  const cardContent = (
    <Component elevation={0} className={variant}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2">
            {icon} {heading}
          </Typography>
        </Grid>
        <Grid item xs={12} md={statMetric ? 7 : 12}>
          <Typography variant="h1">{metric}</Typography>
          {subhead && <Typography variant="body2">{subhead}</Typography>}
        </Grid>

        {statMetric && (
          <Grid item xs={12} md={5}>
            <Typography variant="h1" sx={{ textAlign: 'center' }}>
              <MetricArrow direction={statMetricUp ? 'up' : 'down'} />
              {statMetric}
            </Typography>
            {statSubhead && (
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                {statSubhead}
              </Typography>
            )}
          </Grid>
        )}
      </Grid>
      {arrow && <ArrowForwardIosOutlinedIcon className="arrowIcon" />}
    </Component>
  )

  return href ? (
    <Link href={href}>
      <a>{cardContent}</a>
    </Link>
  ) : (
    cardContent
  )
}
export default DashCard
