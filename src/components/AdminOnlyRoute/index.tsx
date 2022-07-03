import { ReactNode } from "react";
import useRoles from "src/hooks/useRole";
import NotFound from "src/content/pages/Status/Status404";
import { Box } from "@mui/material";

type Props = {
  children: ReactNode;
};

const AdminOnlyRoute = ({ children }: Props) => {
  const roles = useRoles();

  if (!roles.includes("admin"))
    return (
      <Box display="flex" alignItems="center" height="100%">
        <NotFound />
      </Box>
    );

  return <>{children}</>;
};

export default AdminOnlyRoute;
