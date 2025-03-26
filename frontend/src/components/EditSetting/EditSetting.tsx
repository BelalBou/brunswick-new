import React, { useState } from "react";
import moment from "moment";
// @ts-ignore
import "moment/locale/fr";
import emailValidator from "email-validator";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Grid,
  InputLabel,
  FormControl,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

moment.locale("fr");

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
}));

interface EditSettingProps {
  timeLimit: string;
  startPeriod: number;
  endPeriod: number;
  emailOrderCc: string;
  emailSupplierCc: string;
  emailVendorCc: string;
  onClose: () => void;
  onEdit: (
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => void;
}

const EditSetting: React.FC<EditSettingProps> = ({
  timeLimit: initialTimeLimit,
  startPeriod: initialStartPeriod,
  endPeriod: initialEndPeriod,
  emailOrderCc: initialEmailOrderCc,
  emailSupplierCc: initialEmailSupplierCc,
  emailVendorCc: initialEmailVendorCc,
  onClose,
  onEdit,
}) => {
  const [formData, setFormData] = useState({
    timeLimit: initialTimeLimit,
    startPeriod: Number(initialStartPeriod),
    endPeriod: Number(initialEndPeriod),
    emailOrderCc: initialEmailOrderCc,
    emailSupplierCc: initialEmailSupplierCc,
    emailVendorCc: initialEmailVendorCc,
  });
  const [validated, setValidated] = useState(true);

  const handleTextChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value.toString().trim(),
    }));
  };

  const handleSelectChange = (field: string) => (
    event: SelectChangeEvent<string>
  ) => {
    const value = Number(event.target.value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleValidateEmailAddress = (emailAddresses: string[]): boolean => {
    if (emailAddresses && emailAddresses.length > 0) {
      return emailAddresses
        .map((emailAddress) => emailValidator.validate(emailAddress))
        .every((x) => x === true);
    }
    return false;
  };

  const handleValidated = () => {
    const {
      timeLimit,
      startPeriod,
      endPeriod,
      emailOrderCc,
      emailSupplierCc,
      emailVendorCc,
    } = formData;

    if (
      !timeLimit ||
      startPeriod < 0 ||
      startPeriod > 6 ||
      endPeriod < 0 ||
      endPeriod > 6 ||
      endPeriod < startPeriod ||
      !handleValidateEmailAddress(emailOrderCc.split(";")) ||
      !handleValidateEmailAddress(emailSupplierCc.split(";")) ||
      !handleValidateEmailAddress(emailVendorCc.split(";"))
    ) {
      setValidated(false);
    } else {
      onEdit(
        timeLimit,
        startPeriod,
        endPeriod,
        emailOrderCc,
        emailSupplierCc,
        emailVendorCc
      );
    }
  };

  const renderPeriodSelect = () => {
    return Array.from(Array(7).keys()).map((x) => (
      <MenuItem key={x} value={x} className="capitalized-text">
        {moment.weekdays(true)[x]}
      </MenuItem>
    ));
  };

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Éditer un paramètre</DialogTitle>
      <DialogContent>
        <TextField
          id="timeLimit"
          label="Heure limite"
          type="time"
          value={formData.timeLimit}
          onChange={handleTextChange("timeLimit")}
          autoFocus
          sx={{ m: 1 }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 900,
          }}
          fullWidth
          required
          error={!validated && !formData.timeLimit}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StyledFormControl fullWidth required>
              <InputLabel htmlFor="startPeriod">Jour de début</InputLabel>
              <Select
                value={formData.startPeriod.toString()}
                onChange={handleSelectChange("startPeriod")}
                label="Jour de début"
                inputProps={{
                  name: "startPeriod",
                  id: "startPeriod",
                  className: "capitalized-text",
                }}
                error={!validated && (formData.startPeriod < 0 || formData.startPeriod > 6)}
              >
                {renderPeriodSelect()}
              </Select>
            </StyledFormControl>
          </Grid>
          <Grid item xs={6}>
            <StyledFormControl fullWidth required>
              <InputLabel htmlFor="endPeriod">Jour de fin</InputLabel>
              <Select
                value={formData.endPeriod.toString()}
                onChange={handleSelectChange("endPeriod")}
                label="Jour de fin"
                inputProps={{
                  name: "endPeriod",
                  id: "endPeriod",
                  className: "capitalized-text",
                }}
                error={!validated && (formData.endPeriod < 0 || formData.endPeriod > 6 || formData.endPeriod < formData.startPeriod)}
              >
                {renderPeriodSelect()}
              </Select>
            </StyledFormControl>
          </Grid>
        </Grid>
        <TextField
          sx={{ m: 1 }}
          id="emailOrderCc"
          label="E-mails commandes"
          multiline
          maxRows={4}
          value={formData.emailOrderCc}
          onChange={handleTextChange("emailOrderCc")}
          fullWidth
          required
          error={
            !validated &&
            !handleValidateEmailAddress(formData.emailOrderCc.split(";"))
          }
          helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
        />
        <TextField
          sx={{ m: 1 }}
          id="emailSupplierCc"
          label="E-mails fournisseurs"
          multiline
          maxRows={4}
          value={formData.emailSupplierCc}
          onChange={handleTextChange("emailSupplierCc")}
          fullWidth
          required
          error={
            !validated &&
            !handleValidateEmailAddress(formData.emailSupplierCc.split(";"))
          }
          helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
        />
        <TextField
          sx={{ m: 1 }}
          id="emailVendorCc"
          label="E-mails caissiers"
          multiline
          maxRows={4}
          value={formData.emailVendorCc}
          onChange={handleTextChange("emailVendorCc")}
          fullWidth
          required
          error={
            !validated &&
            !handleValidateEmailAddress(formData.emailVendorCc.split(";"))
          }
          helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleValidated} color="primary">
          Éditer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSetting;
