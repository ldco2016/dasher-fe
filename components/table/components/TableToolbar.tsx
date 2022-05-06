import React, { useEffect } from 'react'
import GlobalFilter from './GlobalFilter'
import { Toolbar, Grid, TablePagination } from '@mui/material'
import TablePaginationActions from './TablePaginationActions'
import { ITableToolbar } from 'types'
import { styled } from '@mui/system'

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  '& .row-selection-action': {
    display: 'none',
  },
  '& .rows-selected': {
    border: '1px solid green',
  },
  '& .rows-selected .row-selection-action': {
    display: 'flex',
  },
  '& .MuiButton-root': {
    // TODO: refactor so these kind of micro adjustments are unnecessary
    // Make sure button height matches our select and search inputs
    lineHeight: '1.871',
  },

  '& .MuiTablePagination-toolbar': {
    height: '44px',
  },
}))

const TableToolbar = ({
  preGlobalFilteredRows,
  setGlobalFilter,
  numSelected,
  globalFilter,
  handleChangePage,
  handleChangeRowsPerPage,
  pageIndex,
  pageSize,
  leftContent,
  rightContent,
  enableGlobalFilter = true,
  enablePagination = true,
  filterPlaceholderText = 'Search by patient name',
  displayedData,
  leftContentBehavior = 'default',
  rightContentBehavior = 'default',
}: ITableToolbar) => {
  const disabledStyle = (side: any) => {
    return (
      !numSelected &&
      side === 'enableOnSelect' && {
        opacity: '0.5',
        pointerEvents: 'none',
      }
    )
  }

  return (
    <ToolbarStyled>
      <Grid container spacing={0} sx={{ justifyContent: 'flex-end' }}>
        {/* React element (can be any) passed into the left side */}

        {leftContentBehavior === 'default' ||
        (leftContentBehavior === 'showOnSelect' && !!numSelected) ||
        leftContentBehavior === 'enableOnSelect' ? (
          <Grid item xs="auto" sx={disabledStyle(leftContentBehavior)}>
            {leftContent}
          </Grid>
        ) : null}

        {/* Show search (GlobalFilter) by default */}
        {enableGlobalFilter === true ? (
          <Grid item xs>
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              placeholder={filterPlaceholderText}
            />
          </Grid>
        ) : null}

        {/* Show pagination by default */}
        {enablePagination && (
          <Grid item xs="auto">
            <TablePagination
              rowsPerPageOptions={[]}
              component="div"
              colSpan={3}
              count={displayedData.length}
              rowsPerPage={pageSize}
              page={pageIndex}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </Grid>
        )}

        {rightContentBehavior === 'default' ||
        (rightContentBehavior === 'showOnSelect' && !!numSelected) ||
        rightContentBehavior === 'enableOnSelect' ? (
          <Grid
            item
            xs="auto"
            sx={{
              justifyContent: 'right',
              ...disabledStyle(rightContentBehavior),
            }}
          >
            {rightContent}
          </Grid>
        ) : null}
      </Grid>
    </ToolbarStyled>
  )
}

export default TableToolbar
