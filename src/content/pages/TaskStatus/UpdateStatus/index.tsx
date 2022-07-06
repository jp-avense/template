import { Button } from "@mui/material";
import { ReactNode, useState } from "react";
import Modals from "../../Components/Modals";

type Props = {
  children?: ReactNode;
};

const UpdateStatus = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Modals open={open} onClose={handleClose} title="Update task status">
        <>{children}</>
      </Modals>
      <Button onClick={() => setOpen(true)} variant="contained">Update status</Button>
    </>
  );
};

export default UpdateStatus;
