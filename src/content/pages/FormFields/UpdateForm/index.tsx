import { ReactNode, useState } from "react";
import { Button } from "@mui/material";
import Modals from "../../Components/Modals";

type Props = {
  children?: ReactNode;
};

const UpdateForms = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modals open={open} onClose={handleClose} title="Update forms">
        <>{children}</>
      </Modals>
      <Button onClick={() => setOpen(true)} variant="contained">
        Update
      </Button>
    </>
  );
};

export default UpdateForms;
