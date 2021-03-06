// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.status(200).json([
    {
      id: 1872356234,
      firstName: 'Dan',
      lastName: 'Welch',
      dob: '2002-09-03T12:00-0000',
      email: 'dwelch@mail.com',
      phone: '1+(834) 592-1243',
      emr: 'XPU8372635',
      icdCodes: ['J.45.40', 'J47.0'],
      nextAppointment: '2021-09-30T12:00-0000',
      street: '1432 Polk St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94108',

      payer: 'Aetna',
      payerPhone: '1+(971) 292-3860',
      memberID: '9823 1234-A',
      label: 'sample',
      groupID: '9873 16543-X',

      status: 'Verified',
      copayTier: 0,
      payer: 'Aetna',
      submitted: '2021-09-03T12:00-0000',
    },
    {
      id: 1872356234,
      firstName: 'Robert',
      lastName: 'Sparks',
      dob: '2002-09-03T12:00-0000',
      email: 'dwelch@mail.com',
      phone: '1+(834) 592-1243',
      emr: 'EFU9481652',
      icdCodes: ['J47.0'],
      nextAppointment: '2021-09-28T12:00-0000',
      street: '1202 Polk St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94108',

      payer: 'Blue Cross',
      payerPhone: '(888) 630-2583',
      memberID: '6823 1234-A',
      label: 'sample',
      groupID: '9873 16543-X',

      status: 'Verified',
      copayTier: 4,
      payer: 'Blue Cross',
      submitted: '2021-08-04T12:00-0000',
    },
    {
      id: 1872356234,
      firstName: 'Dehlia',
      lastName: 'Stromson',
      dob: '2002-09-03T12:00-0000',
      email: 'jstromson@mail.com',
      phone: '1+(834) 592-1243',
      emr: 'SXU8376100',
      icdCodes: ['J.45.40', 'J47.0'],
      nextAppointment: '2021-09-30T12:00-0000',
      state: 'CA',
      zip: '94108',

      payer: 'Anthem',
      payerPhone: '1+(800)-331-1476',
      memberID: '5768 1234-A',
      label: 'sample',
      groupID: '9873 16543-X',

      status: 'Incomplete',
      copayTier: '-',
      payer: 'Anthem',
      submitted: '2021-09-03T12:00-0000',

      tip: 'Street & City is missing from entry',
    },
    {
      id: 1872356234,
      firstName: 'Tanner',
      lastName: 'Perry',
      dob: '2002-09-03T12:00-0000',
      email: 'dwelch@mail.com',

      emr: 'XPU1515439',
      icdCodes: ['J.45.40', 'J47.0'],
      nextAppointment: '2021-09-27T12:00-0000',
      street: '3872 Sutter St.',
      city: 'San Francisco',
      state: 'CA',
      zip: '94123',

      payer: 'Blue Cross',
      payerPhone: '(888) 630-2583',
      memberID: '',
      label: 'sample',
      groupID: '9873 16543-X',

      status: 'Incomplete',
      copayTier: 0,
      payer: 'Blue Cross',
      submitted: '2021-05-04T12:00-0000',

      tip: 'Phone Number & Member ID is missing from entry',
    },
    {
      id: 1872356234,
      firstName: 'Jan',
      lastName: 'Morrison',
      dob: '2002-09-03T12:00-0000',
      email: 'jmorrison@mail.com',
      phone: '1+(834) 592-1243',
      emr: 'XPU6679365',
      icdCodes: ['J47.0'],
      nextAppointment: '2021-09-30T12:00-0000',

      street: '123 Green Tree St. East',
      unitNumber: 'A32',
      city: 'Buffalo',
      state: 'CO',
      zip: '80470',

      payer: 'United',
      payerPhone: '1+(855) 570-7870',
      memberID: '5768 1234-A',
      label: 'sample',
      groupID: '8924 7274-X',

      status: 'Pending',
      copayTier: 0,
      payer: 'United',
      submitted: '2021-09-01T12:00-0000',
    },
  ])
}
