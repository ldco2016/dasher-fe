import React, { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import Theme from '../constants/theme'
import { AppContext } from '../context'
import { AppContextWrapper } from 'context'

export const decorators = [
  (StoryFn, { globals: { locale = 'en' } }) => {
    return (
      <>
        <AppContextWrapper>
          <ThemeProvider theme={Theme}>
            <StoryFn />
          </ThemeProvider>
        </AppContextWrapper>
      </>
    )
  },
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
