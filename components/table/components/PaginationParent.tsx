// import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions'
// import next from 'next'
// import { useState } from 'react'

// function PaginationParent({ initialPage }) {
//   const [page, setPage] = useState(initialPage)

//   return (
//     <TablePaginationActions
//       count={displayedData.length}
//       getItemAriaLabel={(type: 'first' | 'last' | 'next' | 'previous') =>
//         'next'
//       }
//       rowsPerPage={20}
//       showFirstButton={true}
//       showLastButton={true}
//       onPageChange={setPage}
//       page={page}
//     />
//   )
// }

// export function getServerSideProps(ctx) {
//   const { pg } = ctx.query
//   return {
//     props: {
//       initialPage: parseInt(pg || 0),
//     },
//   }
// }
