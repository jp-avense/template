import { Alert, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import { t } from "i18next";
import { useState, useContext, useEffect } from "react";
import { AgentContext } from "src/contexts/AgentContext";
import { agentService, UserRoles } from "src/services/agent.service";
import LoadingButton from "src/content/pages/Components/LoadingButton";
import * as yup from "yup";
import { string } from "prop-types";
import { getAxiosErrorMessage } from "src/lib";

type Props = {
  selected: string;
};

interface IUpdateAgent {
  name: string;
  phoneNumber: string;
  email: string;
  familyName: string;
}

const UpdateAgentForm = ({ selected }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [agent, setAgent] = useState(null);
  const [roles, setRoles] = useState<UserRoles[]>([]);
  const [init, setInit] = useState<IUpdateAgent>({
    name: "",
    phoneNumber: "",
    email: "",
    familyName: "",
  });

  const validationSchema = yup.object({
    name: yup.string().required(),
    familyName: yup.string().required(),
    email: yup.string().required().email(),
    phoneNumber: yup.string().required(),
  });

  const context = useContext(AgentContext);

  const {
    handleAgents: { agents },
  } = context;

  useEffect(() => {
    const temp = agents.find((item) => item.email === selected);
    const rolesArr = temp["custom:role"].split(",") as UserRoles[];
    setInit({
      email: temp.email,
      name: temp.name,
      familyName: temp.family_name,
      phoneNumber: temp.phone_number,
    });
    setRoles(rolesArr);
    setAgent(temp);
  }, [selected]);

  const toggleRole = (newRole: UserRoles) => {
    if (roles.includes(newRole)) {
      const arr = roles.filter((item) => item !== newRole);
      setRoles(arr);
    } else {
      const arr = [...roles, newRole];
      setRoles(arr);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: init,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSuccess("");
        setError("");
        await agentService.update({
          id: selected,
          roles,
          ...values,
        });
        setSuccess("Success");
      } catch (error) {
        setError(getAxiosErrorMessage(error));
      }
    },
  });

  const handleChange = (e) => {
    setSuccess("")
    setError("")
    formik.handleChange(e)
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}
        </Grid>
        <Grid item>
          <TextField
            name="name"
            label="First name"
            onChange={(e) => handleChange(e)}
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
          ></TextField>
        </Grid>
        <Grid item>
          <TextField
            name="familyName"
            label="Family name"
            onChange={(e) => handleChange(e)}
            value={formik.values.familyName}
            error={
              formik.touched.familyName && Boolean(formik.errors.familyName)
            }
            helperText={formik.touched.familyName && formik.errors.familyName}
            fullWidth
          ></TextField>
        </Grid>
        <Grid item>
          <TextField
            name="email"
            label="Email"
            type="email"
            onChange={(e) => handleChange(e)}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
          ></TextField>
        </Grid>
        <Grid item>
          <TextField
            name="phoneNumber"
            type="string"
            label="Phone Number"
            onChange={(e) => handleChange(e)}
            value={formik.values.phoneNumber}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            fullWidth
          ></TextField>
        </Grid>
        <Grid item>
          {Object.keys(UserRoles).map((item: UserRoles) => {
            return (
              <FormControlLabel
                key={item}
                value="start"
                control={
                  <Checkbox
                    size="medium"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    checked={roles.includes(item)}
                    onClick={() => toggleRole(item)}
                  />
                }
                label={t(item)}
                labelPlacement="end"
              />
            );
          })}
        </Grid>
        <Grid item>
          <LoadingButton
            text="Submit"
            type="submit"
            loadingSize={18}
            loading={formik.isSubmitting}
            fullWidth
            variant="contained"
          ></LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default UpdateAgentForm;
