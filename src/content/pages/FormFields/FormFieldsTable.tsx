import React, { useState, ReactNode } from "react";

import {
  Card,
  CardHeader,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  CircularProgress,
  Checkbox,
  Pagination,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface IHeader {
  key: string;
  label: string;
}

type Props = {
  loading: boolean;
  title: string;
  headers: IHeader[];
  selected: string[];
  data: any[];
  action?: ReactNode | null;
  handleSelectOne: (id: string) => void;
  handleSelectAll: (event: any) => void;
};

const FormFieldsTable = ({
  loading,
  title,
  headers,
  selected,
  data,
  action,
  handleSelectOne,
  handleSelectAll,
}: Props) => {
  const indeterminate = selected.length > 0 && selected.length < data.length;
  const checked = selected.length === data.length;
  const heads = headers.map((item) => item.key);

  const { t } = useTranslation();

  return (
    <>
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
                {headers.map((item) => {
                  return <TableCell key={item.key}>{item.label}</TableCell>;
                })}
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
                data.map((item) => {
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
                      {heads.map((head, idx) => {
                        const cellkey = `${key}-col${idx}`;

                        const value = item[head];
                        let displayValue = value;

                        switch (typeof value) {
                          case "boolean":
                            displayValue = value?.toString() || "false";
                            break;
                        }

                        return (
                          <TableCell key={cellkey}>{displayValue}</TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default FormFieldsTable;
