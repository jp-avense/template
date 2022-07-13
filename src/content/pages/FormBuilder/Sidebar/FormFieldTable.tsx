import { useState, useEffect } from "react";

import {
  List,
  Card,
  ListItem,
  useTheme,
  ListItemText,
  Divider,
  styled,
  CircularProgress,
} from "@mui/material";
import { formService } from "src/services/form.service";

const ListWrapper = styled(List)(
  () => `
      .MuiListItem-root {
        border-radius: 0;
        margin: 0;
      }
`
);

type Props = {
  data: any[];
};

const FormFieldLayout = ({ data }: Props) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    formService
      .getFields()
      .then(({ data }) => {
        console.log(data);
        data.sort((a, b) => a.order - b.order);

        setForms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Card sx={{ height: "100%" }}>
        <ListWrapper disablePadding>
          {forms.map((item) => {
            const { key } = item;
            return (
              <>
                {loading ? (
                  <ListItem alignItems="center">
                    <CircularProgress size={30} />
                  </ListItem>
                ) : (
                  <>
                    <ListItem
                      key={key}
                      sx={{
                        color: `${theme.colors.primary.main}`,
                        "&:hover": {
                          color: `${theme.colors.primary.dark}`,
                          borderRadius: 0,
                        },
                      }}
                      button
                    >
                      <ListItemText>{item.inputType}</ListItemText>
                    </ListItem>
                    <Divider />
                  </>
                )}
              </>
            );
          })}
        </ListWrapper>
      </Card>
    </>
  );
};

export default FormFieldLayout;
