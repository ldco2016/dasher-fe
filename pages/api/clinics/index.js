export default (req, res) => {
  res.status(200).json([
    {
      name: 'Allergy & Asthma Associates',
      admin: 'James D. Wolfe, MD.',
      devicesInStock: null,
      clinicStaff: null,
      patientsActive: null,
      activationsLastMonth: null,
      patients3MGrows: {
        data: null,
        change: null,
      },
      renewalDueInDays: null,
      agreement: 'pending',
    },
    {
      name: 'Allergy & Asthma Associates',
      admin: 'James D. Wolfe, MD.',
      devicesInStock: 45,
      clinicStaff: 6,
      patientsActive: 58,
      activationsLastMonth: 3,
      patients3MGrows: {
        data: [0, 3, 5, 2, 8],
        change: '+8',
      },
      renewalDueInDays: 150,
      agreement: 'accepted',
    },
    {
      name: 'Asthma Fighters',
      admin: 'Alex D. Hoff, M.D.',
      devicesInStock: 9,
      clinicStaff: 2,
      patientsActive: 23,
      activationsLastMonth: 3,
      patients3MGrows: {
        data: [1, 3, 6, 3, 1],
        change: '+12',
      },
      renewalDueInDays: 28,
      agreement: 'accepted',
    },
    {
      name: 'Asthma Cloud',
      admin: 'Hen D. Brox, M.D.',
      devicesInStock: 'N/A',
      clinicStaff: 'N/A',
      patientsActive: 21,
      activationsLastMonth: 3,
      patients3MGrows: {
        data: [0, 1, 2, 3, 10],
        change: '-5',
      },
      renewalDueInDays: 280,
      agreement: 'accepted',
    },
  ])
}
