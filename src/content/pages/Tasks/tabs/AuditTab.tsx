import { TabsContext } from "src/contexts/TabsContext";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
  ListItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getAxiosErrorMessage } from "src/lib";
import Swal from "sweetalert2";
import { historyService } from "src/services/history.service";

const AuditTab = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [expandedVal, setExpandedVal] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const context = useContext(TabsContext);

  const {
    handleTabs: { currentRow },
  } = context;

  const handleAccordian = (e) => {
    if (e === expandedVal) {
      setExpanded(!expanded);
    } else setExpanded(true);
    setExpandedVal(e);
  };

  useEffect(() => {
    if (currentRow?.id) init(currentRow.id);
  }, [currentRow]);

  const init = async (id: string) => {
    try {
      setLoading(true);
      const { data: res } = await historyService.getTaskHistory(id);
      res.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return +dateB - +dateA;
      });
      setData(res);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: getAxiosErrorMessage(error),
        timer: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (value) => {
    if (value == null) return <TableCell> </TableCell>;

    switch (typeof value) {
      case "object":
        const isArray = Array.isArray(value);

        if (isArray)
          return (
            <TableCell>
              <div>
                {value.map((c) => (
                  <>
                    <Typography>{c},</Typography>
                  </>
                ))}
              </div>
            </TableCell>
          );
        else
          return (
            <TableCell>
              {Object.entries(value).map(([key2, value2]: [string, any]) => {
                let res = value2;

                if (typeof value2 === "object")
                  res = JSON.stringify(value2, null, 2);

                return (
                  <>
                    <Typography variant="h5" color={"info"}>
                      {[key2]}:
                    </Typography>
                    <Typography sx={{ mb: 2 }}>{res}</Typography>
                  </>
                );
              })}
            </TableCell>
          );
        break;
      default:
        return (
          <TableCell>
            <Typography>{value.toString()}</Typography>
          </TableCell>
        );
    }
  };

  const displayValue = (requestDto, originalValues) => {
    return Object.entries(requestDto).map(([key, value]) => {
      let newValue = renderValue(value);
      let oldValue = originalValues ? (
        renderValue(originalValues[key])
      ) : (
        <TableCell> </TableCell>
      );

      if (key === "form") {
        newValue = <TableCell>{t("formSubmitted")}</TableCell>;
        oldValue = <TableCell> </TableCell>;
      }

      return (
        <TableRow key={key}>
          <TableCell>
            <Typography variant="h5" color={"brown"}>
              {key}
            </Typography>
          </TableCell>
          {oldValue}
          {newValue}
        </TableRow>
      );
    });
  };

  if (data.length == 0) return <>{t("noDataAvailable")}</>;
  if (loading) return <CircularProgress size={20}></CircularProgress>;

  return (
    <>
      <Typography variant="h3" color={"primary"}>
        {t("history")}
      </Typography>

      {data.map((c) => (
        <>
          <Accordion
            key={c._id}
            onChange={() => handleAccordian(c._id)}
            expanded={expandedVal === c._id ? expanded : false}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {new Date(c.createdAt).toLocaleString(language)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List sx={{ p: 0 }}>
                <ListItem>
                  <Typography variant="h5" color={"primary"}>
                    {t("type")}: &nbsp;
                  </Typography>
                  <Typography>{c.operationType}</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="h5" color={"primary"}>
                    {t("changedBy")}: &nbsp;
                  </Typography>
                  <Typography>{c.operatingUser.userName}</Typography>
                </ListItem>
                <ListItem>
                  <Typography sx={{ mb: 1 }} variant="h5" color={"primary"}>
                    {t("changes")}
                  </Typography>
                </ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("property")}</TableCell>
                        <TableCell>{t("oldValues")}</TableCell>
                        <TableCell>{t("newValues")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayValue(c.requestDto, c.originalValues)}
                    </TableBody>
                  </Table>
                </TableContainer>
              </List>
            </AccordionDetails>
          </Accordion>
        </>
      ))}
    </>
  );
};

export default AuditTab;
