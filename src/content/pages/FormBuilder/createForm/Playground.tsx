import { useState, useEffect } from "react";

import {
  Tooltip,
  IconButton,
  Grid,
  Typography,
  Divider,
  List,
  Card,
  ListItem,
  useTheme,
  Theme,
  ListItemText,
  styled,
  CircularProgress,
} from "@mui/material";

type Props = {
  handleSelectOne;
};

const Playground = () => {
  const [data, setData] = useState([]);

  return (
    <>
      <Card style={{ width: 700, height: 800, marginTop: 50 }}></Card>
    </>
  );
};

export default Playground;
