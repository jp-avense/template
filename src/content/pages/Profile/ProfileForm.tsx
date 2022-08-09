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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { agentService } from "src/services/agent.service";
import { getAxiosErrorMessage } from "src/lib";
import { AuthContext } from "src/contexts/AuthContext";
import { useContext } from "react";
import { cloneDeep } from "lodash";

const ProfileForm = ({ userinfo }) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roles, setRoles] = useState([]);
  const context = useContext(AuthContext);

  const {
    handleUser: { setUser },
  } = context;

  const validationSchema = yup.object({
    name: yup.string().required(),
    familyName: yup.string().required(),
    email: yup
      .string()
      .email(t("emailUserValidText"))
      .required(t("emailRequiredText")),
    phoneNumber: yup.string().required(t("phoneNumberRequiredText")),
    password: yup
      .string()
      .min(8, t("passwordLengthText"))
      .optional()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, t("passwordMatchText")),
  });

  useEffect(() => {
    const res = userinfo["custom:role"].split(",");
    setRoles(res);
  }, [userinfo]);

  const updateUser = (val) => {
    const { email, familyName, name, password, phoneNumber } = val;
    const res = cloneDeep(userinfo);
    res.email = email;
    res.name = name;
    res.family_name = familyName;
    res.phone_number = phoneNumber;

    setUser(res);
  };

  const formik = useFormik({
    initialValues: {
      email: userinfo.email,
      password: "",
      phoneNumber: userinfo.phone_number,
      name: userinfo.name,
      familyName: userinfo.family_name,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setSuccess("");
        setError("");
        await agentService.update(userinfo.sub, {
          role: roles,
          originalEmail: userinfo.email,
          ...values,
        });

        updateUser(values);
        setSuccess("Success");
      } catch (error) {
        setError(getAxiosErrorMessage(error));
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
          {t("accountInformation")}
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

export default ProfileForm;
