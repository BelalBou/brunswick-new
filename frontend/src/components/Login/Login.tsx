// ./components/Login/Login.tsx

import React, { useState, useEffect, KeyboardEvent } from "react";
import { useParams, Navigate } from "react-router-dom";
import emailValidator from "email-validator";

import {
  Avatar,
  Button,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Typography,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Snackbar from "../Snackbar/Snackbar";
import checkDictionnaryFn from "../../utils/CheckDictionnary/CheckDictionnary";

/** 
 * Props attendus : 
 * - Logique Redux/parent (isLoginPending, actions, etc.).
 * - userLanguage, dictionnaryList : pour la fonction checkDictionnary.
 * - isLoginSuccess => si connecté, on redirige /menus.
 */
interface IProps {
  isLoginPending: boolean;
  isLoginSuccess: boolean;
  loginError: string;
  isListPending: boolean;
  isEditPending: boolean;
  isEditSuccess: boolean;
  editError: string;
  userLanguage: string;
  dictionnaryList: any[];
  actions: {
    getDictionnaries: () => void;
    editToken: (token: string) => void;
    login: (emailAddress: string, password: string) => void;
    register: (password: string, confirmPassword: string) => void;
    resetPassword: (emailAddress: string) => void;
  };
}

/** 
 * Styles "sx" :
 * Reproduisent le même rendu que dans l'ancien code 
 * (margin, widths, spacing).
 */
const sxMain = {
  width: "auto",
  display: "block",
  marginLeft: (theme: any) => theme.spacing(3),
  marginRight: (theme: any) => theme.spacing(3),

  // Approximatif : min-width 400 + theme.spacing(3)*2 = 400 + 48 = 448
  "@media (min-width:448px)": {
    width: 400,
    marginLeft: "auto",
    marginRight: "auto",
  },
};

const sxPaper = (theme: any) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(3)}`,
});

const sxAvatar = (theme: any) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
});

const sxForm = (theme: any) => ({
  width: "100%",
  marginTop: theme.spacing(1),
});

const sxSubmit = (theme: any) => ({
  marginTop: theme.spacing(3),
});

export default function Login(props: IProps) {
  const {
    isLoginPending,
    isLoginSuccess,
    loginError,
    isListPending,
    isEditPending,
    isEditSuccess,
    editError,
    userLanguage,
    dictionnaryList,
    actions,
  } = props;

  // Récupération du token depuis l'URL
  const { id: token } = useParams();

  // Équivalent du state de la classe
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openLogin, setOpenLogin] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [register, setRegister] = useState(false);
  const [validated, setValidated] = useState(true);
  const [resetPassword, setResetPassword] = useState(false);

  // Equivalent du componentDidMount + componentDidUpdate(token)
  useEffect(() => {
    // On ne charge les dictionnaires que si on a un token
    if (token) {
      actions.getDictionnaries();
      logout_and_edit(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /** Expression régulière pour valider le mot de passe :
   *  - Au moins 1 maj, 1 min, 1 chiffre, min 6 caractères
   *  - Pas d'espace
   */
  const passwordRegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

  const logout_and_edit = (tk: string) => {
    actions.editToken(tk);
    setRegister(true);
  };

  /** checkDictionnary local, 
   *  utilise la fonction checkDictionnary venant de 
   *  "utils/CheckDictionnary/CheckDictionnary.ts"
   */
  const checkDictionnary = (tag: string) =>
    checkDictionnaryFn(tag, dictionnaryList, userLanguage);

  /** Gestions des champs */
  const handleChangeEmailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress(e.target.value.trim().toLowerCase());
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };
  const handleChangeResetPassword = () => {
    setResetPassword((prev) => !prev);
  };

  /** Fermeture des Snackbars */
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleCloseReset = () => {
    setOpenReset(false);
  };

  /** Validation + login */
  const handleLogin = () => {
    if (emailValidator.validate(emailAddress) && password) {
      actions.login(emailAddress, password);
      setOpenLogin(true);
    } else {
      setValidated(false);
    }
  };
  const handleKeyPressLogin = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  /** Validation + register */
  const handleRegister = () => {
    if (
      password &&
      confirmPassword &&
      password === confirmPassword &&
      passwordRegExp.test(password) &&
      passwordRegExp.test(confirmPassword)
    ) {
      actions.register(password, confirmPassword);
      setOpenEdit(true);
      setRegister(false);
      setValidated(true);
      setPassword("");
      setConfirmPassword("");
    } else {
      setValidated(false);
    }
  };
  const handleKeyPressRegister = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  /** reset password */
  const handleResetPassword = () => {
    if (emailValidator.validate(emailAddress)) {
      actions.resetPassword(emailAddress);
      setOpenReset(true);
    } else {
      setValidated(false);
    }
  };

  /** Redirection si déjà connecté */
  if (isLoginSuccess) {
    return <Navigate to="/menus" replace />;
  }

  const showLoader = isLoginPending || isListPending || isEditPending;

  return (
    <>
      {showLoader && <LinearProgress />}

      {/* Cas de SUCCESS post-edit (register) */}
      {isEditSuccess && openEdit && (
        <Snackbar
          variant="success"
          message={checkDictionnary("_VOUS_POUVEZ_DESORMAIS_VOUS_CONNECTER")}
          onClose={handleCloseEdit}
        />
      )}
      {/* Cas de SUCCESS post-reset */}
      {isEditSuccess && openReset && (
        <Snackbar
          variant="success"
          message={checkDictionnary("_DEMANDE_DE_REINITIALISATION_ENVOYEE")}
          onClose={handleCloseReset}
        />
      )}

      {/* Cas de loginError */}
      {loginError && openLogin && (
        <Snackbar
          variant="error"
          message={checkDictionnary("_NOUS_NE_PARVENONS_PAS_A_VOUS_CONNECTER")}
          onClose={handleCloseLogin}
        />
      )}

      {/* Cas de editError (register) */}
      {editError && openEdit && (
        <Snackbar
          variant="error"
          message={checkDictionnary("_NOUS_NE_PARVENONS_PAS_A_VOUS_ENREGISTRER")}
          onClose={handleCloseEdit}
        />
      )}

      {/* Cas de editError (reset) */}
      {editError && openReset && (
        <Snackbar
          variant="error"
          message={checkDictionnary("_NOUS_NE_PARVENONS_PAS_A_VOUS_REINITIALISER")}
          onClose={handleCloseReset}
        />
      )}

      <Box component="main" sx={sxMain}>
        <Paper sx={sxPaper}>
          {/* On n'affiche le formulaire que si la liste de dicos n'est pas en cours (ou tout autre condition) */}
          {!isListPending && (
            <>
              <Avatar sx={sxAvatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" textAlign="center">
                Brunswick · {checkDictionnary("_PORTAIL_COMMANDE")}
              </Typography>

              {/* Formulaire */}
              <Box component="form" sx={sxForm}>
                {/* mode "login" */}
                {!register && (
                  <>
                    <FormControl
                      margin="normal"
                      required
                      error={!emailValidator.validate(emailAddress) && !validated}
                      fullWidth
                    >
                      <InputLabel htmlFor="email">
                        {checkDictionnary("_ADRESSE_EMAIL")}
                      </InputLabel>
                      <Input
                        id="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={emailAddress}
                        onChange={handleChangeEmailAddress}
                      />
                    </FormControl>

                    <FormControl
                      margin="normal"
                      required
                      error={!password && !validated}
                      fullWidth
                    >
                      <InputLabel htmlFor="password">
                        {checkDictionnary("_MOT_DE_PASSE")}
                      </InputLabel>
                      <Input
                        name="password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handleChangePassword}
                        onKeyPress={handleKeyPressLogin}
                      />
                    </FormControl>
                  </>
                )}

                {/* mode "register" */}
                {register && (
                  <>
                    <FormControl
                      margin="normal"
                      required
                      error={
                        (!password ||
                          password !== confirmPassword ||
                          !passwordRegExp.test(password)) && !validated
                      }
                      fullWidth
                    >
                      <InputLabel htmlFor="newPassword">
                        {checkDictionnary("_CREER_MOT_DE_PASSE")}
                      </InputLabel>
                      <Input
                        name="password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handleChangePassword}
                      />
                      {!passwordRegExp.test(password) && !validated && (
                        <FormHelperText>
                          {checkDictionnary("_VOTRE_MOT_DE_PASSE_DOIT")}
                          <ul>
                            <li>{checkDictionnary("_6_CARS")}</li>
                            <li>{checkDictionnary("_DONT_MAJ")}</li>
                            <li>{checkDictionnary("_UNE_MIN")}</li>
                            <li>{checkDictionnary("_ET_NOMBRE")}</li>
                          </ul>
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl
                      margin="normal"
                      required
                      error={
                        (!confirmPassword ||
                          confirmPassword !== password ||
                          !passwordRegExp.test(confirmPassword)) && !validated
                      }
                      fullWidth
                    >
                      <InputLabel htmlFor="confirmPassword">
                        {checkDictionnary("_CONFIRMER_MOT_DE_PASSE")}
                      </InputLabel>
                      <Input
                        name="confirmPassword"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        value={confirmPassword}
                        onChange={handleChangeConfirmPassword}
                        onKeyPress={handleKeyPressRegister}
                      />
                      {!passwordRegExp.test(confirmPassword) && !validated && (
                        <FormHelperText>
                          {checkDictionnary("_VOTRE_MOT_DE_PASSE_DOIT")}
                          <ul>
                            <li>{checkDictionnary("_6_CARS")}</li>
                            <li>{checkDictionnary("_DONT_MAJ")}</li>
                            <li>{checkDictionnary("_UNE_MIN")}</li>
                            <li>{checkDictionnary("_ET_NOMBRE")}</li>
                          </ul>
                        </FormHelperText>
                      )}
                    </FormControl>
                  </>
                )}

                {/* Checkbox "je souhaite réinitialiser mon mot de passe" */}
                {!register && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={resetPassword}
                        color="primary"
                        onChange={handleChangeResetPassword}
                      />
                    }
                    label="Je souhaite réinitialiser mon mot de passe"
                  />
                )}

                {/* Boutons d'action suivant le mode */}
                {!register && !resetPassword && (
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={sxSubmit}
                    onClick={handleLogin}
                  >
                    {checkDictionnary("_SE_CONNECTER")}
                  </Button>
                )}

                {!register && resetPassword && (
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={sxSubmit}
                    onClick={handleResetPassword}
                  >
                    {checkDictionnary("_REINITIALISER")}
                  </Button>
                )}

                {register && !resetPassword && (
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={sxSubmit}
                    onClick={handleRegister}
                  >
                    {checkDictionnary("_VALIDER")}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}
