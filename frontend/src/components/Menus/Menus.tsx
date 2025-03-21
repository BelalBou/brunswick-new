// ./components/Menus/Menus.tsx
import React, { useState, useEffect, Fragment } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  ListSubheader,
  useTheme,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import checkDictionnaryFn from "../../utils/CheckDictionnary/CheckDictionnary";

import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import MenuCard from "../MenuCard/MenuCard";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import TabContainer from "../TabContainer/TabContainer";
import AddCart from "../AddCart/AddCart";
import MenusList from "../MenusList/MenusList";
import ICategory from "../../interfaces/ICategory";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import ISupplier from "../../interfaces/ISupplier";

// Styles "sx"
const sxHeroUnit = {
  backgroundColor: "background.paper",
  borderRadius: ".625rem",
};
const sxLayout = {
  width: "auto",
  margin: "0 auto",
};
const sxCardGrid = {
  p: 0,
  "@media (minWidth: 960px)": {
    p: 4,
  },
};
const sxListSubHeader = {
  mt: 6,
  mb: 2,
};
const sxH5 = { fontWeight: 600 };
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
const sxMain = {
  flex: 1,
  "@media (minWidth: 960px)": {
    marginLeft: 30,
  },
};

interface MenusProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userToken: string;
  userLanguage: string;
  userType: string;
  userValidity: string;
  selected: number;
  dictionnaryList: any[];
  supplierList: ISupplier[];
  categoryList: ICategory[];
  menuList: IMenu[];
  cartList: ICart[];
  orderListTotalCount: number;
  actions: {
    getDictionnaries: () => void;
    getSuppliers: () => void;
    getOrdersTotalCountForCustomer: () => void;
    getCategoriesSupplier: (supplierId: number) => void;
    getMenusSupplier: (supplierId: number) => void;
    setSelected: (selected: number) => void;
    logout: () => void;
    setCartList: (cart: ICart[]) => void;
    // autres actions utilisées...
  };
}

const Menus: React.FC<MenusProps> = (props) => {
  const {
    isLoginSuccess,
    isListPending,
    userToken,
    userLanguage,
    userType,
    supplierList,
    categoryList,
    menuList,
    cartList,
    selected,
    actions,
    dictionnaryList,
  } = props;

  const theme = useTheme();
  const { id: routeId } = useParams<{ id?: string }>();

  // États locaux
  const [selectedSupplier, setSelectedSupplier] = useState<number>(1);
  const [shoppingCartOrdered, setShoppingCartOrdered] = useState<boolean>(true);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [addMenu, setAddMenu] = useState<IMenu | null>(null);
  const [redirectTo, setRedirectTo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Timer: tick toutes les 60s
  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Refresh initial si connecté et token défini
  useEffect(() => {
    if (isLoginSuccess && userToken !== "") {
      refresh();
    }
    handleChangeSelected(1);
  }, [isLoginSuccess, userToken]);

  // Réagir aux changements de supplierList
  useEffect(() => {
    if (supplierList && supplierList.length > 0) {
      actions.getDictionnaries();
      actions.getCategoriesSupplier(supplierList[0].id);
      actions.getMenusSupplier(supplierList[0].id);
      setSelectedSupplier(supplierList[0].id);
    }
  }, [supplierList]);

  const tick = async () => {
    try {
      const res = await axios.get("/api/users/check_validity", {
        withCredentials: true,
      });
      if (res.data === "not valid") {
        actions.logout();
      }
    } catch (err) {
      console.error("Tick error:", err);
    }
  };

  const refresh = () => {
    tick();
    actions.getDictionnaries();
    actions.getSuppliers();
    actions.getOrdersTotalCountForCustomer();
  };

  const handleChangeSelectedSupplier = (_: React.SyntheticEvent, value: number) => {
    setSelectedSupplier(value);
    actions.getCategoriesSupplier(value);
    actions.getMenusSupplier(value);
  };

  const handleChangeSelected = (sel: number) => {
    actions.setSelected(sel);
    localStorage.setItem("selected", sel.toString());
  };

  const handleLogout = () => {
    actions.logout();
  };

  const handleAddShoppingCart = (item: ICart) => {
    let shoppingCartCopy = [...cartList];
    const exist = shoppingCartCopy.filter((x) => x.menu.id === item.menu.id);
    if (exist.length > 0) {
      exist[0].quantity += item.quantity;
      shoppingCartCopy = shoppingCartCopy.filter((x) => x.menu.id !== item.menu.id);
      shoppingCartCopy.push(exist[0]);
    } else {
      shoppingCartCopy.push(item);
    }
    actions.setCartList(shoppingCartCopy);
    localStorage.setItem("cartList", JSON.stringify(shoppingCartCopy));
    setRedirectTo("/cart/success");
  };

  const handleCloseSnackbarOrdered = () => {
    setShoppingCartOrdered(false);
  };

  const handleOpenAdd = (menu: IMenu) => {
    setOpenAdd(true);
    setAddMenu(menu);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const checkDictionnary = (tag: string) => {
    return checkDictionnaryFn(tag, dictionnaryList, userLanguage);
  };

  // Filtrage des résultats de recherche
  const searchResults = menuList.filter((x) =>
    (x.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (x.title_en || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (x.MenuSize
      ? (x.MenuSize?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (x.MenuSize?.title_en || "").toLowerCase().includes(searchTerm.toLowerCase())
      : false) ||
    (x.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (x.description_en || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (x.Category
      ? (x.Category?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (x.Category?.title_en || "").toLowerCase().includes(searchTerm.toLowerCase())
      : false)
  );

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
  }
  if (userType === "supplier") {
    return <Navigate to="/orders" replace />;
  }
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      cartItems={cartList ? cartList.length : 0}
      selected={selected}
      search
      title="Menus"
      onLogout={handleLogout}
      onSearch={handleSearch}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={checkDictionnary}
      userLanguage={userLanguage}
    >
      {/* Snackbar pour commande réussie */}
      {shoppingCartOrdered && routeId === "success" && (
        <SnackbarAction
          success
          message={checkDictionnary("_COMMANDE_SUCCES")}
          onClose={handleCloseSnackbarOrdered}
        />
      )}

      {openAdd && addMenu && (
        <AddCart
          menu={addMenu}
          menus={menuList.filter((x) => x.title === addMenu.title)}
          userLanguage={userLanguage}
          onAdd={handleAddShoppingCart}
          onClose={handleCloseAdd}
          checkDictionnary={checkDictionnary}
        />
      )}

      <Box component="main" sx={sxMain}>
        <div style={{ ...sxLayout, ...sxCardGrid }}>
          <div style={sxHeroUnit}>
            <Tabs
              value={selectedSupplier}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              onChange={handleChangeSelectedSupplier}
            >
              {supplierList
                .filter((supplier) =>
                  userType !== "vendor" ? supplier.for_vendor_only !== true : true
                )
                .map((supplier) => (
                  <Tab
                    key={supplier.id}
                    label={supplier.name}
                    icon={<RestaurantIcon />}
                    value={supplier.id}
                  />
                ))}
            </Tabs>
            {supplierList.map((supplier) => (
              <Fragment key={supplier.id}>
                {selectedSupplier === supplier.id && (
                  <TabContainer dir={theme.direction}>
                    {searchTerm !== "" && searchResults.length === 0 && (
                      <div style={{ margin: theme.spacing(2) }}>
                        <br />
                        <br />
                        <Typography
                          variant="h6"
                          align="left"
                          color="text.primary"
                          gutterBottom
                          sx={sxH5}
                        >
                          {checkDictionnary("_NO_RESULTS_FOR_YOUR_SEARCH")} :
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          align="left"
                          color="text.secondary"
                          gutterBottom
                          sx={sxH5}
                        >
                          <i>{searchTerm}</i>
                        </Typography>
                      </div>
                    )}

                    {categoryList.map((category) => (
                      <Fragment key={category.id}>
                        {searchResults.filter(
                          (menu) => menu.category_id === category.id
                        ).length > 0 && (
                          <>
                            <ListSubheader sx={sxListSubHeader}>
                              <Typography variant="h5" sx={sxH5}>
                                {userLanguage === "en"
                                  ? category.title_en
                                  : category.title}
                              </Typography>
                            </ListSubheader>
                            <Box sx={sxSectionDesktop}>
                              <MenuCard
                                userLanguage={userLanguage}
                                menuList={menuList
                                  .filter((x) =>
                                    (x.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (x.title_en || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (x.MenuSize
                                      ? (x.MenuSize?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (x.MenuSize?.title_en || "").toLowerCase().includes(searchTerm.toLowerCase())
                                      : false) ||
                                    (x.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (x.description_en || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (x.Category
                                      ? (x.Category?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (x.Category?.title_en || "").toLowerCase().includes(searchTerm.toLowerCase())
                                      : false)
                                  )
                                  .filter((menu) => menu.category_id === category.id)
                                  .sort((a, b) => (a.title || "").localeCompare(b.title || ""))}
                                onOpenAdd={handleOpenAdd}
                              />
                            </Box>
                            <Box sx={sxSectionMobile}>
                              <MenusList
                                userLanguage={userLanguage}
                                menuList={menuList
                                  .filter((x) =>
                                    (x.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (x.title_en || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (x.MenuSize
                                      ? (x.MenuSize?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (x.MenuSize?.title_en || "").toLowerCase().includes(searchTerm.toLowerCase())
                                      : false) ||
                                    (x.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (x.description_en || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (x.Category
                                      ? (x.Category?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (x.Category?.title_en || "").toLowerCase().includes(searchTerm.toLowerCase())
                                      : false)
                                  )
                                  .filter((menu) => menu.category_id === category.id)
                                  .sort((a, b) => (a.title || "").localeCompare(b.title || ""))}
                                onOpenAdd={handleOpenAdd}
                              />
                            </Box>
                          </>
                        )}
                      </Fragment>
                    ))}
                  </TabContainer>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </Box>
      <Footer />
    </MenuBar>
  );
};

export default Menus;
