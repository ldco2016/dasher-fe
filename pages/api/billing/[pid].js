export default function handler(req, res) {
  const { pid } = req.query

  const bills = [
    {
      id: '1',
      firstName: 'Brown',
      lastName: 'Maroon',
      DOB: '2001-04-19T12:59-0500',
      physician: 'Dr. Alex May',
      provider: 'Kaiser',
      insuranceId: '555555555',
      insurerCopayAmount: '$20',
      billingItems: [
        {
          proceedure: 'RPM 9954',
          cycleLength: '30 days 04/06/21 - 05/06/21',
          timeSpent: 'N/A',
          notes: '18 FEV1 PP readings',
          submitted: true,
        },
        {
          proceedure: 'RPM 99091',
          cycleLength: '30 days 05/06/21 - 06/06/21',
          timeSpent: '15:20',
          notes: 'Interpreted FEV1 PP readings',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes:
                  "Patient's FEV1 scores are stable. 97% highest this week, 92% lowest this week. Adhering to control medication, no use of res",
              },
            },
            {
              timeSpent: '3:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '2:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
        {
          proceedure: 'RPM 99457',
          cycleLength: '30 days 06/06/21 - 06/06/21',
          timeSpent: '40:00',
          notes: 'Interaction with patient',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Patient did not report any trouble breathing',
              },
            },
            {
              timeSpent: '10:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
        {
          proceedure: 'RPM 99458',
          cycleLength: '30 days 07/06/21 - 07/06/21',
          timeSpent: '25:00',
          notes: 'Management of condition',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Patient inhaler usage has increased',
              },
            },
            {
              timeSpent: '10:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
      ],
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Doe',
      DOB: '2001-04-19T12:59-0500',
      physician: 'Dr. Alex May',
      provider: 'Kaiser',
      insuranceId: '555555555',
      insurerCopayAmount: '$20',
      billingItems: [
        {
          proceedure: 'RPM 9954',
          cycleLength: '30 days 04/06/21 - 05/06/21',
          timeSpent: 'N/A',
          notes: '18 FEV1 PP readings',
          submitted: true,
        },
        {
          proceedure: 'RPM 99091',
          cycleLength: '30 days 05/06/21 - 06/06/21',
          timeSpent: '15:20',
          notes: 'Interpreted FEV1 PP readings',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes:
                  "Patient's FEV1 scores are stable. 97% highest this week, 92% lowest this week. Adhering to control medication, no use of res",
              },
            },
            {
              timeSpent: '3:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '2:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
        {
          proceedure: 'RPM 99457',
          cycleLength: '30 days 06/06/21 - 06/06/21',
          timeSpent: '40:00',
          notes: 'Interaction with patient',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Patient did not report any trouble breathing',
              },
            },
            {
              timeSpent: '10:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
        {
          proceedure: 'RPM 99458',
          cycleLength: '30 days 07/06/21 - 07/06/21',
          timeSpent: '25:00',
          notes: 'Management of condition',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Patient inhaler usage has increased',
              },
            },
            {
              timeSpent: '10:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
      ],
    },
    {
      id: '3',
      firstName: 'Jane Doe',
      lastName: 'Maroon',
      DOB: '2001-04-19T12:59-0500',
      physician: 'Dr. Alex May',
      provider: 'Kaiser',
      insuranceId: '555555555',
      insurerCopayAmount: '$20',
      billingItems: [
        {
          proceedure: 'RPM 9954',
          cycleLength: '30 days 04/06/21 - 05/06/21',
          timeSpent: 'N/A',
          notes: '18 FEV1 PP readings',
          submitted: true,
        },
        {
          proceedure: 'RPM 99091',
          cycleLength: '30 days 05/06/21 - 06/06/21',
          timeSpent: '15:20',
          notes: 'Interpreted FEV1 PP readings',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes:
                  "Patient's FEV1 scores are stable. 97% highest this week, 92% lowest this week. Adhering to control medication, no use of res",
              },
            },
            {
              timeSpent: '3:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '2:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
        {
          proceedure: 'RPM 99457',
          cycleLength: '30 days 06/06/21 - 06/06/21',
          timeSpent: '40:00',
          notes: 'Interaction with patient',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Patient did not report any trouble breathing',
              },
            },
            {
              timeSpent: '10:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
        {
          proceedure: 'RPM 99458',
          cycleLength: '30 days 07/06/21 - 07/06/21',
          timeSpent: '25:00',
          notes: 'Management of condition',
          submitted: false,
          subRows: [
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Patient inhaler usage has increased',
              },
            },
            {
              timeSpent: '10:00',
              notes: {
                name: 'Dr. Wolfe',
                date: '02.12.21',
                notes:
                  'Changed Risk%Range and updated controller medication dosage freequency',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
            {
              timeSpent: '10:10',
              notes: {
                name: 'Nurse Allen',
                date: '02.16.21',
                notes: 'Requested Dr. Wolfe update Risk%Range',
              },
            },
          ],
        },
      ],
    },
  ]

  const selectedBill = bills.find((bill) => bill.id === pid)

  res.status(200).json(selectedBill)
}
