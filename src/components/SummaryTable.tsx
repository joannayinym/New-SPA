import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { SummaryData } from "../pages";

type Data = SummaryData;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (orderBy === "key") {
    if (
      String(b[orderBy]).split("-").reverse().join("-") <
      String(a[orderBy]).split("-").reverse().join("-")
    ) {
      return -1;
    }
    if (
      String(b[orderBy]).split("-").reverse().join("-") >
      String(a[orderBy]).split("-").reverse().join("-")
    ) {
      return 1;
    }
    return 0;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useSortHeadCellStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: (props: any) => ({
      display: "flex",
      alignItems: "center",
      cursor: props.hideSortIcon ? "auto" : "pointer",
      justifyContent: props.align === "left" ? "flex-start" : "flex-end",
    }),
    activeIcon: {
      color: "#1781eb",
    },
    inactiveIcon: {
      color: "rgba(0, 0, 0, 0.48)",
    },
    iconBox: {
      maxHeight: 12,
    },
    upIcon: (props: any) => ({
      marginLeft: 5,
      width: 0,
      height: 0,
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      borderBottom: `8px solid ${
        props.active && props.direction === "asc"
          ? "#1781eb"
          : "rgba(0, 0, 0, 0.48)"
      }`,
    }),
    downIcon: (props: any) => ({
      marginTop: 3,
      marginLeft: 5,
      width: 0,
      height: 0,
      borderLeft: "15px solid transparent",
      borderRight: "15px solid transparent",
      borderTop: `8px solid ${
        props.active && props.direction === "desc"
          ? "#1781eb"
          : "rgba(0, 0, 0, 0.48)"
      }`,
    }),
  })
);

const SortHeadCell = ({
  active,
  title,
  direction,
  hideSortIcon,
  align,
  onClick,
}: {
  active: boolean;
  title: string;
  direction: string;
  hideSortIcon: boolean;
  align: string;
  onClick: any;
}) => {
  const classes = useSortHeadCellStyles({
    hideSortIcon,
    align,
    active,
    direction,
  });

  return (
    <div className={classes.root}>
      <div>{title}</div>

      {!hideSortIcon && (
        <div style={{ display: "inline-block" }}>
          <div
            className={classes.upIcon}
            onClick={(e) => {
              onClick(e, "asc");
            }}
          >
            {/* <ArrowDropUpIcon
              className={
                active && direction === "asc"
                  ? classes.activeIcon
                  : classes.inactiveIcon
              }
            /> */}
          </div>
          <div
            className={classes.downIcon}
            onClick={(e) => {
              onClick(e, "desc");
            }}
          >
            {/* <ArrowDropDownIcon
              className={
                active && direction === "desc"
                  ? classes.activeIcon
                  : classes.inactiveIcon
              }
            /> */}
          </div>
        </div>
      )}
    </div>
  );
};

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
    direction: Order
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  selection: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, selection } = props;

  const createSortHandler =
    (property: keyof Data) =>
    (event: React.MouseEvent<unknown>, direction: Order) => {
      onRequestSort(event, property, direction);
    };

  const headCells: HeadCell[] = [
    {
      id: "key",
      numeric: false,
      disablePadding: true,
      label: `Group By: ${selection}`,
    },
    { id: "amount", numeric: true, disablePadding: false, label: "Amount" },
    { id: "balance", numeric: true, disablePadding: false, label: "Balance" },
  ];
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <SortHeadCell
              active={headCell.id === orderBy}
              align={headCell.numeric ? "right" : "left"}
              title={headCell.label}
              onClick={createSortHandler(headCell.id)}
              direction={orderBy === headCell.id ? order : "asc"}
              hideSortIcon={
                headCell.label === "Group By: category" ||
                headCell.label === "Group By: type"
              }
            />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      margin: "auto",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
      paddingLeft: 16,
      paddingRight: 16,
    },
    table: {
      minWidth: 550,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

export default function SummaryTable({
  data: rows,
  selection,
}: {
  data: SummaryData[];
  selection: string;
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("key");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
    direction: Order
  ) => {
    setOrder(direction);
    setOrderBy(property);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [selection]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
            padding="normal"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              selection={selection}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.key}
                      </TableCell>
                      <TableCell align="right">
                        {row.amount.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {row.balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
