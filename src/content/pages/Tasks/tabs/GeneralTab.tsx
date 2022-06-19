import { TabsContext } from "src/contexts/TabsContext";
import { useContext, useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

interface Rows {
  dynamicDetails: any[];
  status: string;
  type: string;
  createdAt: string;
  id: number;
  assignedTo: string;
  lastUpdate: string;
  updatedBy: string;
}

const GeneralTab = () => {
  const [data, setData] = useState<Rows>();
  const context = useContext(TabsContext);

  const {
    handleTabs: { tabsData },
  } = context;

  useEffect(() => {
    setData(tabsData);
  }, [tabsData]);

  return (
    <List>
      {data?.dynamicDetails?.length > 1 ? (
        <>
          <ListItem key={data.assignedTo}>
            {data.assignedTo ? (
              <>
                <Typography variant="h5" color="primary">
                  <span>Assigned to: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.assignedTo}</span>
                </Typography>
              </>
            ) : (
              <></>
            )}
          </ListItem>

          {data.dynamicDetails.map((c) => (
            <>
              {!c.showInTable && c.value ? (
                <ListItem key={c.id}>
                  {c.value ? (
                    <>
                      <Typography variant="h5" color="primary">
                        <span>{c.id + ":"}</span>
                      </Typography>
                      <Typography
                        sx={{ ml: "10px" }}
                        variant="h6"
                        color="secondary"
                      >
                        <span>{c.value}</span>
                      </Typography>
                    </>
                  ) : (
                    <></>
                  )}
                </ListItem>
              ) : (
                <></>
              )}
            </>
          ))}

          <ListItem key={data.createdAt}>
            {data.createdAt ? (
              <>
                <Typography variant="h5" color="primary">
                  <span>Created at: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.createdAt}</span>
                </Typography>
              </>
            ) : (
              <></>
            )}
          </ListItem>

          <ListItem key={data.id}>
            {data.lastUpdate ? (
              <>
                <Typography variant="h5" color="primary">
                  <span>Last updated: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.lastUpdate}</span>
                </Typography>
              </>
            ) : (
              <></>
            )}
          </ListItem>

          <ListItem key={data.updatedBy}>
            {data.lastUpdate ? (
              <>
                <Typography variant="h5" color="primary">
                  <span>Updated by: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.updatedBy}</span>
                </Typography>
              </>
            ) : (
              <></>
            )}
          </ListItem>
        </>
      ) : (
        <></>
      )}
    </List>
  );
};

export default GeneralTab;
