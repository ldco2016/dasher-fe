import React, { useEffect, useMemo } from 'react'
import MaUTable from '@mui/material/Table'
import { IGenericTable } from 'types'
import TableToolbar from './components/TableToolbar'
import IndeterminateCheckbox from './components/IndeterminateCheckbox'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
  useFilters,
} from 'react-table'

const defaultPropGetter = () => ({})

const GeneralTable = <D,>({
  columns,
  data,
  leftContent,
  rightContent,
  skipPageReset,
  children,
  setData,
  updateData,
  rowLinkOnClick = () => {},
  filters = [],
  initialState = {},
  getRowProps = defaultPropGetter,
  checkRows = true,
  filterPlaceholderText,
  enableGlobalFilter = true,
  enablePagination = true,
  retainSortState = false,
  leftContentBehavior,
  rightContentBehavior,
  sortStateRecorder = () => {},
  ...rest
}: IGenericTable<D>) => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter,
    columns: tableColumns,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns,
      initialState: initialState,
      data,
      autoResetPage: !skipPageReset,
      updateData,
      disableMultiSort: true,
      disableSortRemove: true,
      disableMultiRemove: true,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (checkRows) {
        hooks.allColumns.push((columns) => [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ])
      }
    }
  )

  const handleChangePage = (_, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value))
  }

  useEffect(() => {
    filters?.map((filter) => {
      setFilter(filter.column, filter.options)
    })
  }, [filters])

  useEffect(() => {
    setPageSize(20)
  }, [])

  const { id: memoColumn, isSortedDesc: memoDirection } = useMemo(
    () =>
      tableColumns?.filter((r) => r.isSorted).length > 0
        ? tableColumns.filter((r) => r.isSorted)[0]
        : { id: null, isSortedDesc: null },
    [tableColumns?.filter((r) => r.isSorted)[0]]
  )

  useEffect(() => {
    if (retainSortState) {
      sortStateRecorder(memoColumn, memoDirection)
    }
  }, [memoColumn, memoDirection])

  return (
    <TableContainer>
      <TableToolbar
        numSelected={Object.keys(selectedRowIds).length}
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        data={data}
        pageIndex={pageIndex}
        pageSize={pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        leftContent={leftContent}
        rightContent={rightContent}
        filterPlaceholderText={filterPlaceholderText}
        displayedData={rows}
        enableGlobalFilter={enableGlobalFilter === true}
        leftContentBehavior={leftContentBehavior}
        rightContentBehavior={rightContentBehavior}
      />

      <MaUTable {...getTableProps()} size="small" stickyHeader>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <TableCell
                    className={column.canSort ? 'sortable' : 'notSortable'}
                    data-cy={`table-cell-${column.id}`}
                    {...(column.id === 'selection'
                      ? column.getHeaderProps()
                      : column.getHeaderProps(column.getSortByToggleProps()))}
                  >
                    <div className="th-content">
                      <div className="th-caption">
                        <TableSortLabel
                          className={column.isSortedDesc ? 'desc' : 'asc'}
                          data-cy={`table-sort-label-${column.id}-${
                            column.isSortedDesc ? 'desc' : 'asc'
                          }`}
                          active={column.isSorted}
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                          IconComponent={() =>
                            column.canSort && (
                              <div className="sortIcoContainer">
                                <ArrowDropUpIcon
                                  className="up"
                                  viewBox="5 4 13 13"
                                />
                                <ArrowDropDownIcon
                                  className="down"
                                  viewBox="5 10 13 13"
                                />
                              </div>
                            )
                          }
                        >
                          <div>{column.render('Header')}</div>
                        </TableSortLabel>
                      </div>
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            console.log('row: ', row)
            prepareRow(row)
            return (
              <TableRow
                {...row.getRowProps(getRowProps(row))}
                className={row.isSelected && 'selected'}
                data-cy={`table-row-${i}`}
                hover={true}
                onClick={() => {
                  rowLinkOnClick(row.original)
                }}
              >
                {row.cells.map((cell) => (
                  <TableCell
                    className={cell.column.canSort ? 'sortable' : 'notSortable'}
                    {...cell.getCellProps({
                      'data-cy': `cell_${
                        Number.isInteger(cell.value)
                          ? 'integer'
                          : cell.value || 'empty'
                      }`,
                      colSpan: cell.column.colspan,
                      style: {
                        minWidth: cell.column.minWidth,
                        cursor: 'pointer',
                      },
                    })}
                  >
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>

        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </MaUTable>
    </TableContainer>
  )
}

export default GeneralTable
