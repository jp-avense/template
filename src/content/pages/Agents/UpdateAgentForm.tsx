import {
  Alert,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { t } from "i18next";
import { useState, useContext, useEffect } from "react";
import { AgentContext } from "src/contexts/AgentContext";
import { agentService, UserRoles } from "src/services/agent.service";
import LoadingButton from "src/content/pages/Components/LoadingButton";
import * as yup from "yup";
import { getAxiosErrorMessage } from "src/lib";
import { useTranslation } from "react-i18next";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type Props = {
  selected: string;
  onDone: () => any;
};

interface IUpdateAgent {
  name: string;
  phoneNumber: string;
  email: string;
  familyName: string;
  password: string;
}

const UpdateAgentForm = ({ selected, onDone }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const [agent, setAgent] = useState(null);
  const [roles, setRoles] = useState<UserRoles[]>([]);
  const [init, setInit] = useState<IUpdateAgent>({
    name: "",
    phoneNumber: "",
    email: "",
    familyName: "",
    password: "",
  });

  const { t } = useTranslation();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(t("emailUserValidText"))
      .required(t("emailRequiredText")),
    name: yup.string().required(t("nameRequiredText")),
    familyName: yup.string().required(t("familyNameRequiredText")),
    phoneNumber: yup.string().required(t("phoneNumberRequiredText")),
    password: yup
      .string()
      .min(8, t("passwordLengthText"))
      .optional()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, t("passwordMatchText")),
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
      password: "",
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
        await agentService.update(agent.sub, {
          role: roles,
          originalEmail: agent.email,
          ...values,
        });

        await onDone();
        setSuccess("Success");
      } catch (error) {
        setError(getAxiosErrorMessage(error));
      }
    },
  });

  const handleChange = (e) => {
    setSuccess("");
    setError("");
    formik.handleChange(e);
  };

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
            label={t("firstName")}
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
            label={t("familyName")}
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
            label={t("email")}
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
            label={t("phoneNumber")}
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
          <TextField
            name="password"
            type={visible ? "text" : "password"}
            label={t("password")}
            onChange={(e) => handleChange(e)}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              (formik.touched.password && formik.errors.password) ||
              t("forceChangePassword")
            }
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => setVisible(!visible)}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  {visible ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              ),
            }}
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
