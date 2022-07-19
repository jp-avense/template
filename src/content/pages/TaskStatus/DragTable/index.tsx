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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import React, { ReactNode, useState } from "react";
import "./style.css";

interface IHeader {
  key: string;
  label: string;
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
  handleDragDrop: any;
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
  handleDragDrop,
}: Props) => {
  const [dragItem, setDragItem] = useState(null);
  const indeterminate = selected.length > 0 && selected.length < data.length;
  const checked = selected.length === data.length;

  const headKeys = headers.map((item) => item.key);

  const onDragEnter = (e, id: string) => {
    if (id === dragItem) return;
    e.currentTarget.classList.add("drag-target");
  };

  const onDragStart = (e, id: string) => {
    e.target.classList.add("drag-source");
    e.dataTransfer.effectAllowed = "move";
    setDragItem(id);
  };

  const onDragEnd = (e) => {
    e.target.classList.remove("drag-source");
  };

  const onDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-target");
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, dragTarget: string) => {
    e.currentTarget.classList.remove("drag-target");

    if (dragTarget !== dragItem) handleDragDrop(e, dragItem, dragTarget);

    setDragItem("");
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
              {headers.map((item) => {
                return <TableCell key={item.key}>{item.label}</TableCell>;
              })}
              <TableCell></TableCell>
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
                    draggable="true"
                    onDragStart={(e) => onDragStart(e, item._id)}
                    onDragEnd={(e) => onDragEnd(e)}
                    onDragEnter={(e) => onDragEnter(e, item._id)}
                    onDragOver={onDragOver}
                    onDragLeave={(e) => onDragLeave(e)}
                    onDrop={(e) => onDrop(e, item._id)}
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
                    <TableCell>
                      <DragIndicatorIcon />
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

export default React.memo(DynamicTable);
