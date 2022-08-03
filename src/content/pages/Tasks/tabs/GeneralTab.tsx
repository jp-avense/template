import { TabsContext } from "src/contexts/TabsContext";
import { useContext, useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
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

  return (
    <List>
      {data?.dynamicDetails?.length > 1 ? (
        <>
          {data.assignedTo ? (
            <ListItem key={data.id}>
              <Typography variant="h5" color="primary">
                <span>{t("assignedTo")}: </span>
              </Typography>
              <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                <span>{data.assignedTo}</span>
              </Typography>
            </ListItem>
          ) : (
            <></>
          )}

          {data.dynamicDetails.map((c, index) => {
            const blacklisted = [
              "docDrisha1Url",
              "docDrisha2Url",
              "docIkulRishum",
            ].includes(c.key);

            return (
              <>
                {!c.showInTable && c.value && !blacklisted ? (
                  <ListItem key={index}>
                    {c.value ? (
                      <>
                        <Typography variant="h5" color="primary">
                          <span>{t(c.label) + ":"}</span>
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
            );
          })}

          <ListItem>
            {data.createdAt ? (
              <>
                <Typography variant="h5" color="primary">
                  <span>{t("createdAt")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.createdAt}</span>
                </Typography>
              </>
            ) : (
              <></>
            )}
          </ListItem>

          <ListItem>
            {data.lastUpdate ? (
              <>
                <Typography variant="h5" color="primary">
                  <span>{t("lastUpdated")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.lastUpdate}</span>
                </Typography>
              </>
            ) : (
              <></>
            )}
          </ListItem>

          <ListItem>
            {data.lastUpdate ? (
              <>
                <Typography variant="h5" color="primary">
                  <span>{t("updatedBy")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.updatedBy}</span>
                </Typography>
              </>
            ) : (
              <></>
            )}
          </ListItem>

          <ListItem>
            {data.executionStartDate ? (
              <>
                <Typography variant="h5" color="primary">
                  <span>{t("executionDate")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>
                    {new Date(data.executionStartDate).toLocaleDateString()}
                  </span>
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
