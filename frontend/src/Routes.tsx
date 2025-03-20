// ./Routes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Vos imports de containers
import App from "./containers/AppContainer";
import Login from "./containers/LoginContainer";
// import Menus from "./containers/MenusContainer";
// import Cart from "./containers/CartContainer";
// import Orders from "./containers/OrdersContainer";
// import MenusCarriedAway from "./containers/MenusCarriedAwayContainer";
// import ManageUsers from "./containers/ManageUsersContainer";
// import ManageSuppliers from "./containers/ManageSuppliersContainer";
// import ManageCategories from "./containers/ManageCategoriesContainer";
// import ManageMenuSizes from "./containers/ManageMenuSizesContainer";
// import ManageAllergies from "./containers/ManageAllergiesContainer";
// import ManageExtras from "./containers/ManageExtrasContainer";
// import ManageMenus from "./containers/ManageMenusContainer";
// import ManageSettings from "./containers/ManageSettingsContainer";
// import Account from "./containers/AccountContainer";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#002856",
    },
  },
});

function MyRoutes() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<App />} />

          {/* Login (avec paramètre id éventuel : "/login/:id" */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/:id" element={<Login />} />

          {/* Menus */}
          {/* <Route path="/menus" element={<Menus />} />
          <Route path="/menus/:id" element={<Menus />} /> */}

          {/* Cart */}
          {/* <Route path="/cart" element={<Cart />} />
          <Route path="/cart/:id" element={<Cart />} /> */}

          {/* Orders */}
          {/* <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Orders />} />
          <Route path="/menus-carried-away" element={<MenusCarriedAway />} /> */}

          {/* Account */}
          {/* <Route path="/account" element={<Account />} /> */}

          {/* Gestion */}
          {/* <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/manage-suppliers" element={<ManageSuppliers />} />
          <Route path="/manage-categories" element={<ManageCategories />} />
          <Route path="/manage-menu-sizes" element={<ManageMenuSizes />} />
          <Route path="/manage-allergies" element={<ManageAllergies />} />
          <Route path="/manage-extras" element={<ManageExtras />} />
          <Route path="/manage-menus" element={<ManageMenus />} />
          <Route path="/manage-settings" element={<ManageSettings />} /> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default MyRoutes;
