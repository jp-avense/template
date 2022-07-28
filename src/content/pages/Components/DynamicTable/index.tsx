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
} from "@mui/material";
import { t } from "i18next";
import { ReactNode, useState } from "react";

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
  handleSelectOne: (id: string) => void;
  handleSelectAll: (event: any) => void;
  title: string;
  selected: string[];
  action?: ReactNode | null;
  sort?: boolean;
  sortedRowInformation?: (data: any[], comparator: () => number) => any[];
  createSortHandler?: (property: any) => (event: any) => void;
  getComparator?: (orderDirection: string, valueToOrderBy: string) => any;
  orderDirection?: State;
  valueToOrderBy?: string;
};

const DynamicTable = ({
  data,
  loading,
  headers,
  handleSelectAll,
  handleSelectOne,
  title,
  selected,
  action,
  sort,
  sortedRowInformation,
  createSortHandler,
  getComparator,
  orderDirection,
  valueToOrderBy,
}: Props) => {
  const indeterminate = selected.length > 0 && selected.length < data.length;
  const checked = selected.length === data.length;

  const headKeys = headers.map((item) => item.key);

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
                  ? sortedRowInformation(
                      data,
                      getComparator(orderDirection.order, valueToOrderBy)
                    ).map((item) => {
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
                  : data.map((item) => {
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
    </Card>
  );
};

export default DynamicTable;
