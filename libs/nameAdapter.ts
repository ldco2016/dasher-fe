// AR-454: This is a workaround to fix when the whole name (first and last)
//  is in the field 'firstName'
const nameAdapter = (name) =>
  (name || '')
    .trim()
    .split(/\s+/gi)
    .map((word) => word.trim())
    .filter((word) => word.length !== 0)
    .reverse()
    .join(', ')

export default nameAdapter
