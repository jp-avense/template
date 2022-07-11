import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React from "react";

type Props = {
  loading: boolean;
  text: string;
  loadingSize: number;
};

const LoadingButton = ({ loading, loadingSize, text, ...rest }: Props & ButtonProps) => {
  return (
    <Button disabled={loading} {...rest}>
      {loading ? <CircularProgress size={loadingSize} /> : text}
    </Button>
  );
};

export default LoadingButton;
