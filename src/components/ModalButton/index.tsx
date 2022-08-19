import { Button } from "@mui/material";
import { ReactNodeLike } from "prop-types";
import React, { ReactNode, useState } from "react";
import Modals from "src/content/pages/Components/Modals";

type Props = {
  text: string | ReactNode;
  children?: ReactNode;
  buttonProps?: {
    [key: string]: any;
  };
  title: string;
  forceOpen?: boolean;
  setForceOpen?: (state) => any;
  actions?: ReactNodeLike
};

const ModalButton = ({
  text,
  children,
  buttonProps,
  title,
  forceOpen,
  setForceOpen,
  actions
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
      <Modals onClose={handleClose} open={forceOpen ?? open} title={title} actions={actions}>
        <>{children}</>
      </Modals>
      <Button {...buttonProps} onClick={handleOpen}>
        {text}
      </Button>
    </>
  );
};

export default ModalButton;
