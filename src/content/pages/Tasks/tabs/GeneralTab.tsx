import { TabsContext } from "src/contexts/TabsContext";
import { useContext, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Rows {
  dynamicDetails: any[];
  status: string;
  type: string;
  createdAt: string;
  id: number;
  assignedTo: string;
  lastUpdate: string;
  updatedBy: string;
  executionStartDate: string;
}

const GeneralTab = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Rows>();
  const context = useContext(TabsContext);

  const {
    handleTabs: { currentRow },
  } = context;

  useEffect(() => {
    setData(currentRow);
  }, [currentRow]);

  const blacklist = ["docDrisha1Url", "docDrisha2Url", "docIkulRishum"];

  return (
    <Box padding={2}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("field")}</TableCell>
            <TableCell>{t("value")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.dynamicDetails?.length > 0 ? (
            data.dynamicDetails.map((item, index) => {
              const toShow = !blacklist.includes(item.key) && !item.showInTable;

              if (!toShow) return null;

              return (
                <TableRow key={index} hover>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>{item.value}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                {t("noDataAvailable")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default GeneralTab;
