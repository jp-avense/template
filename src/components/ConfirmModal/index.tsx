import { Alert, Box, Button } from "@mui/material";
import React from "react";
import ModalButton from "../ModalButton";

type Props = {
  handleConfirm: any;
  title: string;
  buttonText: string;
  buttonProps: object;
  confirmText: string;
  confirmMessage: string;
  confirmButtonProps?: object;
};

const ConfirmModal = ({
  handleConfirm,
  confirmButtonProps,
  buttonProps,
  title,
  confirmMessage,
  confirmText,
  buttonText,
}: Props) => {
  return (
    <ModalButton title={title} text={buttonText} buttonProps={buttonProps}>
      <Box marginBottom={2}>
        <Alert severity="warning">{confirmMessage}</Alert>
      </Box>
      <Button
        type="button"
        variant="contained"
        fullWidth
        {...confirmButtonProps}
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    </ModalButton>
  );
};

export default React.memo(ConfirmModal);
