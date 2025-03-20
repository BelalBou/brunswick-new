// ./components/Account/Account.tsx
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Divider,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import checkDictionnaryFn from "../../utils/CheckDictionnary/CheckDictionnary";
import userTypes from "../../utils/UserTypes/UserTypes";

// Définissez ici vos styles "sx"
const sxMain = { flex: 1 };
const sxLayout = {
  width: "auto",
  mx: 3,
  "@media (min-width: 448px)": {
    width: 400,
    mx: "auto",
  },
};
const sxCardGrid = (theme: any) => ({
  p: 0,
  [theme.breakpoints.up("md")]: {
    p: theme.spacing(4),
  },
});
const sxHeroUnit = (theme: any) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: ".625rem",
});
const sxGridContainer = { display: "flex", alignItems: "center", justifyContent: "center" };
const sxGridItem = (theme: any) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  p: theme.spacing(2),
});

// Définition des props
export interface AccountProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userFirstName: string;
  userLastName: string;
  userEmailAddress: string;
  userType: string;
  userLanguage: string;
  selected: number;
  dictionnaryList: any[];
  actions: {
    getDictionnaries: () => void;
    editToken: (token: string) => void;
    logout: () => void;
    editUserLanguage: (language: string) => void;
    setSelected: (selected: number) => void;
  };
}

export default function Account(props: AccountProps) {
  const {
    isLoginSuccess,
    isListPending,
    userFirstName,
    userLastName,
    userEmailAddress,
    userType,
    userLanguage,
    dictionnaryList,
    actions,
    selected,
  } = props;

  const { id: token } = useParams<{ id: string }>(); // pour /login/:id
  const [lang, setLang] = useState(userLanguage);

  useEffect(() => {
    actions.getDictionnaries();
    if (token) {
      actions.editToken(token);
      // Si nécessaire, vous pouvez gérer un flag register ici
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogout = () => {
    actions.logout();
  };

  const handleChangeUserLanguage = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    actions.editUserLanguage(value);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      userObj.language = value;
      localStorage.setItem("user", JSON.stringify(userObj));
    }
    setLang(value);
  };

  const handleChangeSelected = (sel: number) => {
    actions.setSelected(sel);
    localStorage.setItem("selected", sel.toString());
  };

  const checkDictionnary = (tag: string) => {
    return checkDictionnaryFn(tag, dictionnaryList, lang);
  };

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      selected={selected}
      title={checkDictionnary("_MON_COMPTE")}
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={checkDictionnary}
    >
      <Box component="main" sx={sxMain}>
        <Box sx={{ ...sxLayout, ...sxCardGrid }}>
          <Box sx={sxHeroUnit}>
            <Grid container sx={sxGridContainer}>
              <Grid item sx={sxGridItem}>
                <Typography variant="h4" align="center" color="text.secondary" gutterBottom>
                  {checkDictionnary("_DONNEES_PERSONNELLES")}
                </Typography>
                <List sx={{ minWidth: { md: "450px" } }}>
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnary("_NOM")}
                      secondary={
                        <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                          {userLastName.toUpperCase()}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnary("_PRENOM")}
                      secondary={
                        <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                          {userFirstName}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnary("_ADRESSE_EMAIL")}
                      secondary={
                        <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                          {userEmailAddress}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnary("_TYPE_DE_COMPTE")}
                      secondary={
                        <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                          {userTypes.find((x) => x.value === userType)?.label}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnary("_LANGUE")}
                      secondary={
                        <Select value={lang} onChange={handleChangeUserLanguage}>
                          <MenuItem value="en">🇺🇸 English</MenuItem>
                          <MenuItem value="fr">🇫🇷 Français</MenuItem>
                        </Select>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Footer />
    </MenuBar>
  );
}
