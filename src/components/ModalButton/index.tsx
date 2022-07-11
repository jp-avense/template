import { Button } from "@mui/material";
import React, { ReactNode, useState } from "react";
import Modals from "src/content/pages/Components/Modals";

type Props = {
  text: string;
  children?: ReactNode;
  buttonProps?: {
    [key: string]: any;
  };
  title: string
};

const ModalButton = ({ text, children, buttonProps, title }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <>
      <Modals onClose={handleClose} open={open} title={title}>
        <>{children}</>
      </Modals>
      <Button {...buttonProps} onClick={handleOpen}>
        {text}
      </Button>
    </>
  );
};

export default ModalButton;
