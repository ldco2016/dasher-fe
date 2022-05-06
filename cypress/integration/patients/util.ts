//
// There might be a better way to do this... Who knows.

const IsValidDate = (val: string) => {
  const splitUpDate = val.split('/').map((v) => Number.parseInt(v))
  const month = splitUpDate[0]
  const day = splitUpDate[1]
  const year = splitUpDate[2]

  expect(month).to.be.within(1, 12)
  expect(day).to.be.within(1, 31)
  expect(year).to.be.within(1800, 3200)
}

export { IsValidDate }
