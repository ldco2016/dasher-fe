import env from '@beam-australia/react-env'

export const pageview = (url) => {
  window.gtag('config', env('PUBLIC_GOOGLE_ANALYTICS'), {
    page_path: url,
  })
}

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag('event', action, params)
}
