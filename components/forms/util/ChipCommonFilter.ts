import _ from 'lodash'
import { ReactChild } from 'react'

function ChipCommonFilter(
  event: any,
  child: ReactChild,
  deleteValue: string,
  setFilters,
  currentFilters
) {
  const mapToLower = (myArray) => _.map(myArray, (itm) => itm.toLowerCase())
  let {
    target: { value },
  } = event

  if (value) {
    // Add...
    const currentFiltersSet: Set<string> = new Set(mapToLower(currentFilters))
    const newValue: string = _(value)
      .filter((itm) => !currentFiltersSet.has(itm.toLowerCase()))
      .head()

    if (_.isNil(newValue) || newValue.toLowerCase() === 'all') {
      setFilters(['all'])
    } else {
      setFilters(
        _.union(
          [newValue],
          _.filter(currentFilters, (itm) => itm !== 'all')
        )
      )
    }
  } else {
    // Remove Filters
    const revisedFilters: string[] = _.filter(
      currentFilters,
      (itm) => itm !== deleteValue
    )

    setFilters(revisedFilters.length !== 0 ? revisedFilters : ['all'])
  }
}

export default ChipCommonFilter
