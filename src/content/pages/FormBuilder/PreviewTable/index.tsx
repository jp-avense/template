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
  Box,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { t } from "i18next";
import { ReactNode, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "../form.interface";
import PreviewModal from "./PreviewModal";

interface IHeader {
  key: string;
  label: string;
}

interface State {
  order: "asc" | "desc";
}

type Props = {
  headers: IHeader[];
  loading: boolean;
  data: Form[];
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

const PreviewTable = ({
  data,
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

  const indeterminate = selected.length > 0 && selected.length < data.length;
  const checked = selected.length === data.length;

  const headKeys = headers.map((item) => item.key);

  const { t } = useTranslation();

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
              <TableCell>{t("preview")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length + 2}
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
                      .map((item) => {
                        const isSelected = selected.includes(item._id);
                        const { _id: key } = item;
                        return (
                          <TableRow
                            key={key}
                            onClick={(e) => {
                              handleSelectOne(item._id);
                            }}
                            hover
                            sx={{
                              cursor: "pointer",
                              backgroundColor: selected.includes(item._id)
                                ? "lavender"
                                : "inherit",
                            }}
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

                              const value = item[head];
                              let displayValue = value;

                              switch (typeof value) {
                                case "boolean":
                                  displayValue = value?.toString() || "false";
                                  break;
                              }

                              return (
                                <TableCell key={cellkey}>
                                  {displayValue}
                                </TableCell>
                              );
                            })}
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <PreviewModal data={item} />
                            </TableCell>
                          </TableRow>
                        );
                      })
                  : data
                      .slice(page * limit, page * limit + limit)
                      .map((item) => {
                        const isSelected = selected.includes(item._id);
                        const { _id: key } = item;
                        return (
                          <TableRow
                            key={key}
                            onClick={(e) => {
                              handleSelectOne(item._id);
                            }}
                            hover
                            sx={{
                              cursor: "pointer",
                              backgroundColor: selected.includes(item._id)
                                ? "lavender"
                                : "inherit",
                            }}
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

                              const value = item[head];
                              let displayValue = value;

                              switch (typeof value) {
                                case "boolean":
                                  displayValue = value?.toString() || "false";
                                  break;
                              }

                              return (
                                <TableCell key={cellkey}>
                                  {displayValue}
                                </TableCell>
                              );
                            })}
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <PreviewModal data={item} />
                            </TableCell>
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

export default PreviewTable;
