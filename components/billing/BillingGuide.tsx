import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
  Grid,
  Typography,
  AccordionSummary,
  Box,
  Accordion,
  AccordionDetails,
  LinearProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/system'
import TabPanel from 'components/TabPanel'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useSWR from 'swr'
import Fetch from 'libs/fetch'

type Format = 'faq' | 'card'

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

const DialogContentStyled = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  padding: 0,
}))

const TabslStyled = styled(Tabs)(({ theme }) => ({
  width: '100%',
  '& .MuiTab-root': {
    textTransform: 'none',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  '& .MuiTabs-flexContainer': {
    justifyContent: 'center',
  },
}))

const TabPanelStyled = styled(TabPanel)(({ theme }) => ({
  padding: `${theme.spacing(10)} ${theme.spacing(4)} ${theme.spacing(
    4
  )} ${theme.spacing(4)}`,
  height: '100%',
}))

const FaqCard = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  background: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  '& .faq-title': {
    color: theme.palette.secondary.light,
  },
}))

const AccordionStyle = styled(Accordion)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  '& .MuiTypography-h2': {
    fontWeight: 'normal',
  },
}))

const FaqTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  color: theme.palette.secondary.main,
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '34px',
  letterSpacing: '0.25px',
}))

const SimpleAccordion = ({ title, description }) => (
  <AccordionStyle>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h2">{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>{description}</AccordionDetails>
  </AccordionStyle>
)

interface IBillingGuide {
  open: boolean
  onClose: () => void
}

const BillingGuide = ({ open, onClose }: IBillingGuide) => {
  const [activeTab, setActiveTab] = useState(0)

  const { data: billingGuideData } = useSWR('/api/billing/billing-guide', Fetch)

  const handleSelectedTabChange = (
    _: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveTab(newValue)
  }

  if (!billingGuideData) return <LinearProgress color="secondary" />

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{ m: 3, zIndex: 1400 }}
    >
      <DialogTitle sx={{ pt: 4, pb: 0 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <TabslStyled value={activeTab} onChange={handleSelectedTabChange}>
          {billingGuideData.map((section, index) => (
            <Tab label={section.sectionName} {...a11yProps(index)} />
          ))}
        </TabslStyled>
      </DialogTitle>

      <DialogContentStyled>
        {/* This tab panel supports (n) tabs with either one full width list
  (card or accordion) or both lists side by side depending on what
  is available in the json passed to it. */}
        {billingGuideData.map((section, index) => (
          <TabPanelStyled value={activeTab} index={index}>
            <FaqTitle variant="h1">{section.title}</FaqTitle>

            <Grid
              container
              sx={{ flexGrow: 1 }}
              spacing={4}
              direction="row"
              justifyContent="center"
            >
              {section.content.map(({ title, format, list }) => (
                <Grid item xs={12} md={5.5}>
                  <Typography variant="h2" sx={{ mb: 3 }}>
                    {title}
                  </Typography>
                  {list.map((content) => {
                    switch (format) {
                      // Begin RPM Tab
                      case 'cpt':
                        return (
                          <FaqCard>
                            <Typography variant="h2" sx={{ mb: 2 }}>
                              <Box sx={{ mr: 2, display: 'inline-block' }}>
                                {content.code}
                              </Box>
                              <small>{content.codeDescription}</small>
                            </Typography>
                            <Typography
                              variant="h2"
                              className="faq-title"
                              sx={{ mb: 2 }}
                            >
                              {content.title}
                            </Typography>
                            <Typography variant="body1">
                              {content.description}
                            </Typography>
                          </FaqCard>
                        )
                      case 'faq':
                        return (
                          <SimpleAccordion
                            title={content.question}
                            description={content.answer}
                          />
                        )

                      // Begin PCM & General Tabs
                      // TODO: discover what will live on these tabs
                      case 'pcm':
                      case 'general':
                        return (
                          <FaqCard>
                            <Typography variant="h2" sx={{ mb: 2 }}>
                              {content.title}
                            </Typography>
                            <Typography variant="body1">
                              {content.description}
                            </Typography>
                          </FaqCard>
                        )
                      default:
                        break
                    }
                  })}
                </Grid>
              ))}
            </Grid>
          </TabPanelStyled>
        ))}
      </DialogContentStyled>
    </Dialog>
  )
}

export default BillingGuide
