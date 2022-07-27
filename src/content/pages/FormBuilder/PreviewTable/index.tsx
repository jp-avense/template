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
} from "@mui/material";
import { t } from "i18next";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "../form.interface";
import PreviewModal from "./PreviewModal";

interface IHeader {
  key: string;
  label: string;
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
}: Props) => {
  const indeterminate = selected.length > 0 && selected.length < data.length;
  const checked = selected.length === data.length;

  const headKeys = headers.map((item) => item.key);

  const { t } = useTranslation();

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
              {headers.map((item) => {
                return <TableCell key={item.key}>{item.label}</TableCell>;
              })}
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
              data.map((item) => {
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
                        <TableCell key={cellkey}>{displayValue}</TableCell>
                      );
                    })}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <PreviewModal data={item} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default PreviewTable;
