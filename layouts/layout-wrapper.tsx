import Default from './Default'
import DefaultWhite from './DefaultWhite'
import Basic from './Basic'
import FullScreen from './FullScreen'
import FullScreenRelative from './FullScreenRelative'
import CenteredSingleColumn from './CenteredSingleColumn'
import useMounted from '../hooks/useMounted'

const layouts = {
  default: Default,
  defaultWhite: DefaultWhite,
  basic: Basic,
  fullScreen: FullScreen,
  fullScreenRelative: FullScreenRelative,
  centeredSingleColumn: CenteredSingleColumn,
}

const LayoutWrapper = (props) => {
  const mounted = useMounted()

  // to get the text value of the assigned layout of each component
  const Layout = layouts[props.children.type.layout]
  // if we have a registered layout render children with said layout
  if (Layout != null) {
    return <Layout {...props}>{props.children}</Layout>
  }
  // if not render children with fragment
  return mounted && <>{props.children}</>
}

export default LayoutWrapper
