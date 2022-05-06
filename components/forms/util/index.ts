import { Theme } from '@mui/material/styles'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      textTransform: 'capitalize',
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function getStyles(
  option: string,
  selectedValues: readonly string[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedValues.indexOf(option) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

export { ITEM_HEIGHT, ITEM_PADDING_TOP, MenuProps, getStyles }
