import namor from 'namor'

const range = (len) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newBillingRow = () => {
  const claimedChance = Math.random()
  const codes: Number[] = [99453, 99454, 99457, 99458]
  const codesArrayLength = Math.floor(Math.random() * 9 + 0)
  let counter99458 = 1
  let counter99453 = 1

  const generatedCodes = Array.from(Array(codesArrayLength)).map((x) => {
    const codeSelectionIndex = Math.floor(Math.random() * codes.length + 0)

    if (codeSelectionIndex === 0) {
      console.log('trying to select 0 more than once')
      ++counter99453
      return codes[Math.floor(Math.random() * codes.length + 0)]
    }

    if (codeSelectionIndex === 3) {
      ++counter99458
      console.log('counter99458: ', counter99458)
    }

    if (counter99453 > 1) {
      return codes[2]
    } else if (counter99458 > 3) {
      return codes[Math.floor(Math.random() * codes.length - 1 + 0)]
    } else {
      return codes[codeSelectionIndex]
    }
  })

  const randomMonth = Math.floor(Math.random() * (12 - 1) + 1)
  const leadingZero = randomMonth > 9 ? '' : '0'

  return {
    id: 1,
    firstName: namor.generate({
      words: 0,
      saltType: 'string',
      saltLength: 8,
      numbers: 0,
    }),
    lastName: namor.generate({
      words: 0,
      saltType: 'string',
      saltLength: 8,
      numbers: 0,
    }),
    dob: '1955-11-12T12:59-0500',
    readings: Math.floor(Math.random() * 30),
    dos: '2021-08-31T12:59-0500',
    timeSpent:
      `0${Math.floor(Math.random() * 30)}`.slice(-2) +
      ':' +
      `0${Math.floor(Math.random() * 30)}`.slice(-2),
    codes: generatedCodes,
    claimed: claimedChance > 0.5 ? false : true,
    createdOn: `2021-${leadingZero}${randomMonth}-12T00:00-0000`,
  }
}

function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newBillingRow(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

export default (req, res) => {
  res.status(200).json(makeData(20))
}
