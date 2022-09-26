import * as React from 'react'
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton
} from '@mui/material'
import GOLD from '../../assets/images/gold.png'

function EnhancedTableHead (props) {
  const { headCells } = props

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={'normal'}
            sortDirection={false}
            sx={{ color: '#000', borderBottom: 0 }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default function AppTable ({
  rows,
  headCells,
  rowsPage,
  goto,
  onClickItem,
  portfolio
}) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPage || 5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0

  return (
    <TableContainer sx={{ padding: 1 }}>
      <Table
        sx={{ minWidth: 750 }}
        aria-labelledby='tableTitle'
        size={'medium'}
      >
        <EnhancedTableHead headCells={headCells} goto={goto} />
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => {
            return (
              <TableRow
                hover
                key={index}
                sx={{ height: 50 }}
                className={onClickItem ? 'c-pointer' : ''}
                onClick={() => onClickItem(row?.id)}
              >
                {headCells?.map((item, index) => {
                  return (
                    <TableCell component='th' scope='row'>
                      {item?.id === 'name' && portfolio && (
                        <img src={GOLD} className="coinPic" />
                      )}
                      {row[item?.id]}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: 53 * emptyRows
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </TableContainer>
  )
}
