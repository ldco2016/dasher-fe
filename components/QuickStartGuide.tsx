import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useTheme } from '@mui/material/styles'
import ContentBlock from './ContentBlock'

const data = [
  {
    title: 'Complete your profile',
    description: 'Add a phone number and verify your email',
    link: '/',
    isCompleted: true,
  },
  {
    title: 'Turn on notifications',
    description: 'Select which alerts you’d like to receive',
    link: '/',
    isCompleted: true,
  },
  {
    title: 'Add team members',
    description: 'Add colleagues and assign roles',
    link: '/',
    isCompleted: false,
  },
  {
    title: 'Add patients',
    description: 'Upload patients for verification',
    link: '/',
    isCompleted: false,
  },
  {
    title: 'Complete the tutorial',
    description: 'Let us walk you through how to use the dashboard',
    link: '/',
    isCompleted: false,
  },
]

const QuickStartGuide = () => {
  const theme = useTheme()
  return (
    <ContentBlock>
      <Typography variant="h1" gutterBottom>
        Quick Start Guide
      </Typography>

      <List component="nav" aria-labelledby="nested-list-subheader">
        {data.map((item, index) => {
          return (
            <div key={`list-${index}`}>
              <ListItem button>
                <ListItemIcon sx={{ minWidth: '35px' }}>
                  {item.isCompleted ? (
                    <CheckCircleIcon
                      sx={{ color: theme.palette.primary.light }}
                    />
                  ) : (
                    <CheckCircleOutlineIcon
                      sx={{ color: theme.palette.primary.light }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                />
                <ArrowForwardIosIcon color="primary" sx={{ width: '16px' }} />
              </ListItem>
              {index !== data.length - 1 && <Divider component="li" />}
            </div>
          )
        })}
      </List>
    </ContentBlock>
  )
}

export default QuickStartGuide
