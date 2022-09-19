import {
  Card,
  CardHeader,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  CircularProgress,
  TableSortLabel,
  TablePagination,
  Box,
} from "@mui/material";
import { t } from "i18next";
import { ReactNode, useState, useEffect } from "react";

interface IHeader {
  key: string;
  label: string;
  render?: (value: any) => any;
}

interface State {
  order: "asc" | "desc";
}

type Props = {
  headers: IHeader[];
  loading: boolean;
  data: any[];
  originalData?: any[];
  handleSelectOne: (id: string) => void;
  handleSelectAll: (event: any) => void;
  title: string;
  selected: string[];
  action?: ReactNode | null;
  sort?: boolean;
  sorted?: () => any[];
  createSortHandler?: (property: any) => (event: any) => void;
  orderDirection?: State;
  valueToOrderBy?: string;
};

const DynamicTable = ({
  data,
  originalData,
  loading,
  headers,
  handleSelectAll,
  handleSelectOne,
  title,
  selected,
  action,
  sort,
  sorted,
  createSortHandler,
  orderDirection,
  valueToOrderBy,
}: Props) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  let indeterminate, checked;
  if (originalData?.length > 0) {
    indeterminate =
      selected.length > 0 && selected.length < originalData.length;
    checked = selected.length === originalData.length;
  } else {
    indeterminate = selected.length > 0 && selected.length < data.length;
    checked = selected.length === data.length;
  }

  const headKeys = headers.map((item) => item.key);

  useEffect(() => {
    setTotal(data.length);
    const ceiling = Math.floor(total / limit);

    if (page > ceiling) {
      setPage(ceiling);
    }
  }, [data, total]);

  const handlePageChange = async (e: any, newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = async (e: any) => {
    setLimit(parseInt(e.target.value));
    setPage(0);
  };

  return (
    <Card>
      <CardHeader title={t(title)} sx={{ height: "60px" }} action={action} />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={indeterminate}
                  checked={checked}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {sort ? (
                <>
                  {headers.map((item) => {
                    return (
                      <TableCell key={item.key}>
                        <TableSortLabel
                          key={item.key}
                          active={valueToOrderBy === item.key}
                          direction={
                            valueToOrderBy === item.key
                              ? orderDirection.order
                              : "asc"
                          }
                          onClick={createSortHandler(item.key)}
                        >
                          {item.label}
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
                </>
              ) : (
                <>
                  {headers.map((item) => {
                    return <TableCell key={item.key}>{item.label}</TableCell>;
                  })}
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  align="center"
                  height="200px"
                >
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {sort
                  ? sorted()
                      .slice(page * limit, page * limit + limit)
                      .map((item, idx) => {
                        const isSelected = selected.includes(item._id);
                        const { key } = item;
                        return (
                          <TableRow
                            key={key}
                            onClick={(e) => {
                              handleSelectOne(item._id);
                            }}
                            hover
                            sx={[
                              {
                                cursor: "pointer",
                              },
                              selected.includes(item._id)
                                ? { backgroundColor: "lavender" }
                                : {},
                            ]}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected}
                                color="primary"
                                onClick={(e) => handleSelectOne(item._id)}
                              />
                            </TableCell>
                            {headKeys.map((head, idx) => {
                              const cellkey = `${key}-col${idx}`;

                              const headerData = headers.find(
                                (item) => item.key === head
                              );

                              const { render } = headerData;

                              const value = item[head];

                              let displayValue = value;

                              switch (typeof value) {
                                case "boolean":
                                  displayValue = value?.toString() || "false";
                                  break;
                              }

                              if (render) {
                                displayValue = render(displayValue);
                              }

                              return (
                                <TableCell key={cellkey}>
                                  {displayValue}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })
                  : data
                      .slice(page * limit, page * limit + limit)
                      .map((item) => {
                        const isSelected = selected.includes(item._id);
                        const { key } = item;
                        return (
                          <TableRow
                            key={key}
                            onClick={(e) => {
                              handleSelectOne(item._id);
                            }}
                            hover
                            sx={[
                              {
                                cursor: "pointer",
                              },
                              selected.includes(item._id)
                                ? { backgroundColor: "lavender" }
                                : {},
                            ]}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected}
                                color="primary"
                                onClick={(e) => handleSelectOne(item._id)}
                              />
                            </TableCell>
                            {headKeys.map((head, idx) => {
                              const cellkey = `${key}-col${idx}`;

                              const headerData = headers.find(
                                (item) => item.key === head
                              );

                              const { render } = headerData;

                              const value = item[head];

                              let displayValue = value;

                              switch (typeof value) {
                                case "boolean":
                                  displayValue = value?.toString() || "false";
                                  break;
                              }

                              if (render) {
                                displayValue = render(displayValue);
                              }

                              return (
                                <TableCell key={cellkey}>
                                  {displayValue}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
          labelRowsPerPage={t("rowsPerPage")}
        />
      </Box>
    </Card>
  );
};

export default DynamicTable;
