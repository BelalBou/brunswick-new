import React, { useState, MouseEvent } from "react";
import { Link } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Menu,
  Drawer,
  ListItemText,
  List,
  Divider,
  ListItemIcon,
  ListSubheader,
  Badge,
  Typography,
  Link as LinkMUI,
  LinearProgress,
  Hidden,
  useTheme,
  Theme,
  SxProps,
  Box,
  ListItemButton,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import BugReportIcon from "@mui/icons-material/BugReport";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import AddBoxIcon from "@mui/icons-material/AddBox";

import SearchBar from "../SearchBar/SearchBar";
import logo from "../../images/logo.svg";

const drawerWidth = 240;

interface IProps {
  /** Redux or parent-props states */
  isLoginSuccess: boolean;
  isListPending: boolean;
  userType: string;
  cartItems?: number;
  search?: boolean;
  selected: number;
  title?: string;

  /** Callbacks */
  onLogout: () => void;
  onChangeSelected: (selected: number) => void;
  checkDictionnary: (tag: string) => string;
  onSearch?: (search: string) => void;

  /** Contenu du composant (enfant) */
  children?: React.ReactNode;
}

/** Styles en "sx" pour reproduire l'équivalent de vos classes */
const sxRoot = {
  display: "flex",
  flexDirection: "row", 
  height: "100vh",
  width: "100%",
  overflow: "hidden"
};

const sxAppBar = {
  zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
  width: "100%"
};

const sxMenuButton = {
  marginRight: 2,
  "@media (minWidth: 600px)": {
    display: "none",
  },
};

const sxDrawer = {
  width: drawerWidth,
  flexShrink: 0,
  height: "100%",
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    position: 'relative',
    height: "100vh"
  }
};

const sxContentWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  height: "100vh",
  overflow: "auto"
};

const sxContent: SxProps<Theme> = {
  flexGrow: 1,
  padding: 0,
  display: "flex",
  flexDirection: "column"
};

const sxGrow: SxProps<Theme> = {
  flexGrow: 1,
};

const sxSectionDesktop = {
  display: "none",
  "@media (minWidth: 960px)": {
    display: "flex",
  },
};

const sxSectionMobile = {
  display: "flex",
  "@media (minWidth: 960px)": {
    display: "none",
  },
};

/** "toolbar" : on réplique theme.mixins.toolbar */
const sxToolbarPlaceholder: SxProps<Theme> = (theme) => ({
  ...theme.mixins.toolbar,
});

/** "body2" : position: fixed bottom: 0 marginLeft: theme.spacing.unit*7 => marginLeft: 56 */
const sxBody2: SxProps<Theme> = (theme) => ({
  position: "fixed",
  bottom: 0,
  marginLeft: theme.spacing(7),
});

/** "img" : width:160, marginTop:theme.spacing.unit * 3 => 24, marginLeft => 40 */
const sxImg: SxProps<Theme> = (theme) => ({
  width: "160px",
  marginTop: theme.spacing(3),
  marginLeft: theme.spacing(5),
});

/** list : maxHeight:"85%", overflow:"auto" */
const sxList: SxProps<Theme> = (theme) => ({
  width: "100%",
  maxWidth: 360,
  backgroundColor: theme.palette.background.paper,
  position: "relative",
  overflow: "auto",
  maxHeight: "85%",
  padding: 0,
});

const sxListItemText: SxProps<Theme> = {
  marginLeft: '-55px',
};

const sxLinearProgress: SxProps<Theme> = (theme) => ({
  zIndex: theme.zIndex.drawer + 2,
});

function MenuBar({
  isLoginSuccess,
  isListPending,
  userType,
  cartItems = 0,
  search = false,
  selected,
  title = "",
  onLogout,
  onChangeSelected,
  checkDictionnary,
  onSearch,
  children,
}: IProps) {
  const theme = useTheme();

  // States
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(
    null
  );

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleMenuCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAccount = () => {
    handleMenuCloseProfile();
    handleClickListItem(0);
  };

  const handleClickListItem = (sel: number) => {
    onChangeSelected(sel);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    handleMenuCloseProfile();
    onLogout();
  };

  /** Rendu du badge pour l'icône "cart" */
  const renderBadge = () => {
    if (cartItems > 0) {
      return (
        <IconButton
          color="inherit"
          onClick={() => handleClickListItem(2)}
          component={Link}
          to="/cart"
        >
          <Badge badgeContent={cartItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      );
    }
    return null;
  };

  /** Rendu du LinearProgress si isListPending = true */
  const renderLoaders = () => {
    if (isListPending) {
      return <LinearProgress sx={sxLinearProgress} />;
    }
    return null;
  };

  const renderDrawerCartBadge = () => {
    if (cartItems > 0) {
      return (
        <ListItemIcon>
          <Badge color="secondary" badgeContent={cartItems}>
            <ShoppingCartIcon />
          </Badge>
        </ListItemIcon>
      );
    }
    return (
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
    );
  };

  const renderDrawerOrderBadge = () => {
    // Dans votre code, c'était commenté. On le laisse neutre:
    return (
      <ListItemIcon>
        <FormatListBulletedIcon />
      </ListItemIcon>
    );
  };

  /** Menu Profil (Mon compte, se déconnecter, etc.) */
  const renderMenuProfile = () => {
    const isMenuProfileOpen = Boolean(anchorElProfile);
    return (
      <Menu
        anchorEl={anchorElProfile}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuProfileOpen}
        onClose={handleMenuCloseProfile}
      >
        <MenuItem onClick={handleAccount} selected={selected === 0} component={Link} to="/account">
          {checkDictionnary("_MON_COMPTE")}
        </MenuItem>
        <MenuItem onClick={handleLogout} component={Link} to="/login">
          {isLoginSuccess
            ? checkDictionnary("_SE_DECONNECTER")
            : checkDictionnary("_SE_CONNECTER")}
        </MenuItem>
      </Menu>
    );
  };

  /** Rendu du Drawer latéral */
  const renderDrawer = () => (
    <>
      <Box sx={sxToolbarPlaceholder}>
        <Box component="img" src={logo} alt="Brunswick" sx={sxImg} />
      </Box>
      <Divider />
      <List sx={sxList}>
        {userType !== "supplier" && (
          <>
            <ListSubheader component="div" disableSticky>
              {checkDictionnary("_MES_COMMANDES").toUpperCase()}
            </ListSubheader>
            <ListItemButton
              onClick={() => handleClickListItem(1)}
              selected={selected === 1}
              component={Link}
              to="/menus"
            >
              <ListItemIcon>
                <RestaurantMenuIcon />
              </ListItemIcon>
              <ListItemText inset primary="Menus" sx={sxListItemText} />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleClickListItem(2)}
              selected={selected === 2}
              component={Link}
              to="/cart"
            >
              {renderDrawerCartBadge()}
              <ListItemText inset primary={checkDictionnary("_MON_PANIER")} sx={sxListItemText} />
            </ListItemButton>
          </>
        )}
        <ListItemButton
          onClick={() => handleClickListItem(3)}
          selected={selected === 3}
          component={Link}
          to="/orders"
        >
          {renderDrawerOrderBadge()}
          <ListItemText inset primary={checkDictionnary("_MES_COMMANDES")} sx={sxListItemText} />
        </ListItemButton>
        <Divider />
        {(userType === "administrator" || userType === "vendor") && (
          <>
            <ListSubheader component="div" disableSticky>
              COMMANDES EMPLOYÉS
            </ListSubheader>
            {userType === "administrator" && (
              <ListItemButton
                onClick={() => handleClickListItem(4)}
                selected={selected === 4}
                component={Link}
                to="/orders/all"
              >
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText inset primary="Afficher tout" sx={sxListItemText} />
              </ListItemButton>
            )}
            <ListItemButton
              onClick={() => handleClickListItem(5)}
              selected={selected === 5}
              component={Link}
              to="/menus-carried-away"
            >
              <ListItemIcon>
                <ReportProblemIcon />
              </ListItemIcon>
              <ListItemText inset primary="Non-réceptions" sx={sxListItemText} />
            </ListItemButton>
            <Divider />
          </>
        )}
        {userType === "administrator" && (
          <>
            <ListSubheader component="div" disableSticky>
              ADMINISTRATION LUNCHS
            </ListSubheader>
            <ListItemButton
              onClick={() => handleClickListItem(13)}
              selected={selected === 13}
              component={Link}
              to="/manage-categories"
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText inset primary="Catégories" sx={sxListItemText} />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleClickListItem(14)}
              selected={selected === 14}
              component={Link}
              to="/manage-menu-sizes"
            >
              <ListItemIcon>
                <FormatSizeIcon />
              </ListItemIcon>
              <ListItemText inset primary="Tailles" sx={sxListItemText} />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleClickListItem(15)}
              selected={selected === 15}
              component={Link}
              to="/manage-allergies"
            >
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText inset primary="Allergènes" sx={sxListItemText} />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleClickListItem(18)}
              selected={selected === 18}
              component={Link}
              to="/manage-extras"
            >
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText inset primary="Suppléments" sx={sxListItemText} />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleClickListItem(16)}
              selected={selected === 16}
              component={Link}
              to="/manage-menus"
            >
              <ListItemIcon>
                <RestaurantMenuIcon />
              </ListItemIcon>
              <ListItemText inset primary="Menus" sx={sxListItemText} />
            </ListItemButton>
            <Divider />
            <ListSubheader component="div" disableSticky>
              DIVERS
            </ListSubheader>
            <ListItemButton
              onClick={() => handleClickListItem(11)}
              selected={selected === 11}
              component={Link}
              to="/manage-users"
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText inset primary="Utilisateurs" sx={sxListItemText} />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleClickListItem(12)}
              selected={selected === 12}
              component={Link}
              to="/manage-suppliers"
            >
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText inset primary="Fournisseurs" sx={sxListItemText} />
            </ListItemButton>
            <ListItemButton
              onClick={() => handleClickListItem(17)}
              selected={selected === 17}
              component={Link}
              to="/manage-settings"
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText inset primary="Paramètres" sx={sxListItemText} />
            </ListItemButton>
            <Divider />
          </>
        )}
        <Typography sx={sxBody2} variant="body2" color="textSecondary" gutterBottom>
          © 2019{" "}
          <LinkMUI href="https://brunswick.com/" target="_blank">
            Brunswick
          </LinkMUI>
        </Typography>
      </List>
    </>
  );

  return (
    <>
      {renderLoaders()}
      <Box sx={sxRoot}>
        {/* Drawer (Menu latéral) */}
        <Box component="nav" sx={sxDrawer}>
          {/* 
            Sur mobile (smDown), on utilise "variant=temporary"
            Sur desktop (xsDown), "variant=permanent"
          */}
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                }
              }}
            >
              {renderDrawer()}
            </Drawer>
          </Hidden>

          <Hidden xsDown implementation="css">
            <Drawer
              variant="permanent"
              open
              sx={{
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  position: 'static'
                }
              }}
            >
              {renderDrawer()}
            </Drawer>
          </Hidden>
        </Box>

        {/* Contenu principal avec AppBar et enfants */}
        <Box component="main" sx={sxContentWrapper}>
          {/* AppBar */}
          <AppBar position="static" sx={sxAppBar}>
            <Toolbar>
              {/* Bouton ouvrant le drawer sur mobile */}
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={handleDrawerToggle}
                sx={sxMenuButton}
              >
                <MenuIcon />
              </IconButton>

              {/* Titre section Desktop */}
              <Box sx={sxSectionDesktop}>
                <Typography variant="h6" color="inherit">
                  {title}
                </Typography>
              </Box>

              {/* Titre section Mobile */}
              <Box sx={sxSectionMobile}>
                {(!search || !onSearch) && (
                  <Typography variant="h6" color="inherit">
                    {title}
                  </Typography>
                )}
              </Box>

              {/* Barre de recherche si nécessaire */}
              {search && onSearch && (
                <SearchBar
                  onSearch={onSearch}
                  checkDictionnary={checkDictionnary}
                />
              )}

              <Box sx={sxGrow} />

              {/* sectionDesktop : icônes badge + user */}
              <Box sx={sxSectionDesktop}>
                {renderBadge()}
                <IconButton
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
              </Box>

              {/* sectionMobile : idem */}
              <Box sx={sxSectionMobile}>
                {renderBadge()}
                <IconButton
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Contenu enfant */}
          <Box sx={sxContent}>
            {children}
          </Box>
        </Box>
        {/* Menu profil */}
        {renderMenuProfile()}
      </Box>
    </>
  );
}

export default MenuBar;
