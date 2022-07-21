import { Button } from "@mui/material";
import React, { ReactNode, useState } from "react";
import Modals from "src/content/pages/Components/Modals";

type Props = {
  text: string;
  children?: ReactNode;
  buttonProps?: {
    [key: string]: any;
  };
  title: string;
  forceOpen?: boolean;
  setForceOpen?: (state) => any;
};

const ModalButton = ({
  text,
  children,
  buttonProps,
  title,
  forceOpen,
  setForceOpen
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleClose = (e) => {
    if (setForceOpen) setForceOpen(false);

    setOpen(false);
  };
  const handleOpen = (e) => {
    if (setForceOpen) setForceOpen(true);
    setOpen(true);
  };

  return (
    <>
      <Modals onClose={handleClose} open={forceOpen ?? open} title={title}>
        <>{children}</>
      </Modals>
      <Button {...buttonProps} onClick={handleOpen}>
        {text}
      </Button>
    </>
  );
};

export default ModalButton;
