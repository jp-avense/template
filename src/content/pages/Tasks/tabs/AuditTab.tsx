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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const AuditTab = () => {
  const { t } = useTranslation();
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
      createdAt: new Date(1660045929120).toLocaleDateString(),
      updatedAt: "1660045929120",
    },
  ]);
  const context = useContext(TabsContext);

  const {
    handleTabs: { currentRow },
  } = context;

  useEffect(() => {}, [currentRow]);

  return (
    <>
      {data.map((c) => (
        <>
          <Typography variant="h3" color={"primary"}>
            Changes
          </Typography>
          <Accordion key={c._id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{c.createdAt}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <Typography variant="h5" color={"primary"}>
                    Type: &nbsp;
                  </Typography>
                  <Typography>{c.operationType}</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="h5" color={"primary"}>
                    Task Details: &nbsp;
                  </Typography>
                  <Typography>
                    {c.responseDto ? "Sucesss" : "Failed"}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="h5" color={"primary"}>
                    Changed By: &nbsp;
                  </Typography>
                  <Typography>{c.operatingUser.userName}</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="h5" color={"primary"}>
                    Property Changes
                  </Typography>
                </ListItem>
                {Object.keys(c.requestDto).map((x) => (
                  <>
                    <ListItem>
                      <Typography variant="h5" color={"secondary"}>
                        - {[x]} :
                      </Typography>
                      <Typography>{c.requestDto[x]}</Typography>
                    </ListItem>
                  </>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </>
      ))}
    </>
  );
};

export default AuditTab;
