import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "src/contexts/AuthContext";

const useRoles = () => {
  const auth = useContext(AuthContext);
  const [roles, setRoles] = useState<string[]>([]);

  const {
    handleUser: { user },
  } = auth;

  useEffect(() => {
    let r = user ? user["custom:role"].split(",") : [];
    setRoles(r);
  }, [user]);

  return roles;
};

export default useRoles;
