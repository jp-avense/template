import { useFormik } from "formik";
import * as yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useContext, useState } from "react";
import {
  agentService,
  RegisterDto,
  UserRoles,
} from "src/services/agent.service";
import { getAxiosErrorMessage } from "src/lib";
import { AgentContext } from "src/contexts/AgentContext";
import { useTranslation } from "react-i18next";

const AgentsForm = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roles, setRoles] = useState<UserRoles[]>([]);
  const context = useContext(AgentContext);

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
      .required(t("passwordRequiredText"))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, t("passwordMatchText")),
  });

  const {
    handleAgents: { getAgents },
  } = context;

  const addRole = (event, role: UserRoles) => {
    if (event.target.checked) {
      const res = [...roles, role];
      setRoles(res);
    } else {
      const res = roles.filter((i) => i !== role);
      setRoles(res);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      phoneNumber: "",
      name: "",
      familyName: "",
    } as RegisterDto,
    validationSchema: validationSchema,
    onSubmit: async (values: RegisterDto, actions) => {
      try {
        setSuccess("");
        setError("");
        await agentService.register({
          ...values,
          roles,
        });

        setSuccess(t("successAgent"));
        actions.resetForm();
        await getAgents();
      } catch (error) {
        const message = getAxiosErrorMessage(error);
        if (message === "no_response") setError(t("noResponse"));
        else if (message === "request_failed") setError(t("requestFailed"));
        else setError(message || t("invalidRequest"));
      }
    },
  });

  return (
    <div>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      ) : null}
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Box color="#5569ff" fontSize="1rem">
          {t("basicInformation")}
        </Box>
        <Grid container spacing={3} direction="column" pt={2} mb={2}>
          <Grid item>
            <TextField
              fullWidth
              label={t("name")}
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label={t("familyName")}
              id="familyName"
              name="familyName"
              value={formik.values.familyName}
              onChange={formik.handleChange}
              error={
                formik.touched.familyName && Boolean(formik.errors.familyName)
              }
              helperText={formik.touched.familyName && formik.errors.familyName}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="phoneNumber"
              label={t("phoneNumber")}
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />
          </Grid>
        </Grid>
        <Box color="#5569ff" fontSize="1rem">
          {t("accountInformation")}
        </Box>
        <Grid container spacing={3} direction="column" pt={2} mb={2}>
          <Grid item>
            <TextField
              fullWidth
              label={t("email")}
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="password"
              name="password"
              label={t("password")}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item>
            <Box display="flex" gap={2} alignItems="center">
              <Box mr={2}>{t("userRoles")}</Box>
              <FormControlLabel
                value="start"
                control={
                  <Checkbox
                    size="medium"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    onChange={(e) => addRole(e, UserRoles.admin)}
                  />
                }
                label={t("admin")}
                labelPlacement="end"
              />
              <FormControlLabel
                value="start"
                control={
                  <Checkbox
                    size="medium"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    onChange={(e) => addRole(e, UserRoles.agent)}
                  />
                }
                label={t("agent")}
                labelPlacement="end"
              />
              <FormControlLabel
                value="start"
                control={
                  <Checkbox
                    size="medium"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    onChange={(e) => addRole(e, UserRoles.backoffice)}
                  />
                }
                label={t("backOffice")}
                labelPlacement="end"
              />
            </Box>
          </Grid>
        </Grid>
        <div style={{ paddingTop: "10px" }}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <CircularProgress size={18} /> : t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgentsForm;
