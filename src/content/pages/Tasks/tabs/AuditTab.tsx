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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const AuditTab = () => {
  const { t } = useTranslation();
  const [expandedVal, setExpandedVal] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<any>([
    {
      _id: {
        $oid: "62f24a69c2ccbe6f21fcc453",
      },
      taskObjectId: {
        $oid: "62c58bbd91d8a141d26391e2",
      },
      operationType: "update",
      operatingUser: {
        userName: "John",
        userSub: "9355ef1c-dd3e-495e-917f-89b33bf31714",
        userGroups: "admin,backoffice,agent",
      },
      requestDto: {
        departmentId: "690001",
        payername: "Test",
        balance: "100000",
      },
      responseDto: true,
      operationResult: true,
      createdAt: new Date(parseInt("1660045929120")).toLocaleDateString(),
      updatedAt: new Date(parseInt("1660045929120")).toLocaleDateString(),
    },
    {
      _id: {
        $oid: "62f24d220fc4e5d22cc72200",
      },
      taskObjectId: {
        $oid: "62c58bbd91d8a141d26391e2",
      },
      operationType: "assign",
      operatingUser: {
        userName: "John",
        userSub: "9355ef1c-dd3e-495e-917f-89b33bf31714",
        userGroups: "admin,backoffice,agent",
      },
      requestDto: {
        tenantName: "agam",
        taskIds: ["62c58bbd91d8a141d26391e2", "AKSKADKASDK", "AKSDKLASDK"],
        assignedTo: {
          agentName: "Agent",
          agentSub: "261d3264-b55e-4e15-87e8-ebb75e704ac3",
          agentGroups: "agent",
        },
        adminDetails: {
          userName: "John",
          userSub: "9355ef1c-dd3e-495e-917f-89b33bf31714",
          userGroups: "admin,backoffice,agent",
        },
        assignDate: "2022-08-10T12:03:34.000Z",
      },
      responseDto: true,
      operationResult: true,
      createdAt: new Date(parseInt("1660046626130")).toLocaleDateString(),
      updatedAt: new Date(parseInt("1660046626130")).toLocaleDateString(),
    },
  ]);
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

  useEffect(() => {}, [currentRow]);

  return (
    <>
      <Typography variant="h3" color={"primary"}>
        Changes
      </Typography>
      {data.map((c) => (
        <>
          <Accordion
            key={c._id}
            onChange={() => handleAccordian(c._id)}
            expanded={expandedVal === c._id ? expanded : false}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{c.createdAt}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List sx={{ p: 0 }}>
                <ListItem>
                  <Typography variant="h5" color={"primary"}>
                    Type: &nbsp;
                  </Typography>
                  <Typography>{c.operationType}</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="h5" color={"primary"}>
                    Changed By: &nbsp;
                  </Typography>
                  <Typography>{c.operatingUser.userName}</Typography>
                </ListItem>
                <ListItem>
                  <Typography sx={{ mb: 1 }} variant="h5" color={"primary"}>
                    Property Changes
                  </Typography>
                </ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(c.requestDto).map(
                        ([key, value]: [string, any]) => (
                          <>
                            <TableRow key={key}>
                              <TableCell>
                                <Typography variant="h5" color={"brown"}>
                                  {[key]}
                                </Typography>
                              </TableCell>
                              {typeof value === "string" ? (
                                <>
                                  <TableCell>
                                    <Typography>{value}</Typography>
                                  </TableCell>
                                </>
                              ) : (
                                <></>
                              )}

                              {typeof value === "object" &&
                              Array.isArray(value) ? (
                                <>
                                  <TableCell>
                                    <div>
                                      {value.map((c) => (
                                        <>
                                          <Typography>{c} , </Typography>
                                        </>
                                      ))}
                                    </div>
                                  </TableCell>
                                </>
                              ) : (
                                <></>
                              )}
                              {typeof value === "object" &&
                              !Array.isArray(value) ? (
                                <>
                                  <TableCell>
                                    <div>
                                      {Object.entries(value).map(
                                        ([key2, value2]: [string, any]) => (
                                          <>
                                            <Typography
                                              variant="h5"
                                              color={"info"}
                                            >
                                              {[key2]} :
                                            </Typography>
                                            <Typography sx={{ mb: 2 }}>
                                              {value2}
                                            </Typography>
                                          </>
                                        )
                                      )}
                                    </div>
                                  </TableCell>
                                </>
                              ) : (
                                <></>
                              )}
                            </TableRow>
                          </>
                        )
                      )}
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
