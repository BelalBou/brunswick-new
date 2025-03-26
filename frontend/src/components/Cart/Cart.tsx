import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import moment from "moment";
// @ts-ignore
import "moment/locale/en-gb";
// @ts-ignore
import "moment/locale/fr";
import {
  Box,
//   Typography,
//   MenuItem,
  styled
} from "@mui/material";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import CartTable from "../CartTable/CartTable";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import CartRecap from "../CartRecap/CartRecap";
import CartList from "../CartList/CartList";
import EditCart from "../EditCart/EditCart";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import menuSort from "../../utils/MenuSort2/MenuSort2";
import ICart from "../../interfaces/ICart";
import ISetting from "../../interfaces/ISetting";
import IExtra from "../../interfaces/IExtra";
import axios from "axios";

interface CartProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  is_away: boolean;
  userId: number;
  userToken: string;
  userLanguage: string;
  userType: string;
  selected: number;
  dictionnaryList: any[];
  cartList: ICart[];
  settingList: ISetting[];
  orderListTotalCount: number;
  actions: any;
  serverTime: string;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: ".625rem"
}));

const StyledLayout = styled(Box)(({ theme }) => ({
  width: "auto",
  margin: "0 auto",
  padding: 0,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4)
  }
}));

const SectionDesktop = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const SectionMobile = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.up("md")]: {
    display: "none"
  }
}));

const Cart: React.FC<CartProps> = ({
  isLoginSuccess,
  isListPending,
  is_away,
  userId,
  userToken,
  userLanguage,
  userType,
  selected,
  dictionnaryList,
  cartList,
  settingList,
  orderListTotalCount,
  actions,
  serverTime: initialServerTime
}) => {
  const { id } = useParams();
  const [serverTime, setServerTime] = useState(initialServerTime);
  const [shoppingCartAdded, setShoppingCartAdded] = useState(true);
  const [shoppingCartToolate, setShoppingCartToolate] = useState(true);
  const [shoppingCartEdited, setShoppingCartEdited] = useState(false);
  const [shoppingCartDeleted, setShoppingCartDeleted] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editCart, setEditCart] = useState<ICart>({} as ICart);
  const [redirectTo, setRedirectTo] = useState("");

  useEffect(() => {
    const timer = setInterval(tick, 60000);

    if (isLoginSuccess) {
      refresh();
    }

    handleChangeSelected(2);
    if (userLanguage === "en") {
      moment.locale("en-gb");
    } else {
      moment.locale("fr");
    }
    avaSupp();

    return () => clearInterval(timer);
  }, [isLoginSuccess, userLanguage]);

  useEffect(() => {
    if (userToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      axios.defaults.withCredentials = true;
      refresh();
    }
    if (userLanguage) {
      moment.locale(userLanguage === "fr" ? "fr" : "en-gb");
    }
  }, [userToken, userLanguage]);

  const avaSupp = async () => {
    let ok = false;
    const res = await axios.get("/api/suppliers/list/", { withCredentials: true });
    const supplierDB = res.data;
    const newCart: ICart[] = [];

    if (cartList.length) {
      supplierDB.forEach((sup: any) => {
        cartList.forEach((el: ICart) => {
          if (el.menu.Supplier.id === sup.id) {
            el.menu.Supplier.away_start = sup.away_start;
            el.menu.Supplier.away_end = sup.away_end;
            newCart.push(el);
            ok = true;
          }
        });
      });
    }

    localStorage.removeItem('cartList');
    localStorage.setItem("cartList", JSON.stringify(ok ? newCart : []));
  };

  const tick = async () => {
    const res = await axios.get("/api/users/check_validity", { withCredentials: true });
    if (res.data === "not valid") {
      actions.logout();
    }
  };

  const getServerTime = async () => {
    const res = await axios.get("/api/orders/check_time/", { withCredentials: true });
    setServerTime(res.data);
  };

  const refresh = () => {
    tick();
    actions.getDictionnaries();
    actions.getSettings();
    actions.getOrdersTotalCountForCustomer();
    getServerTime();
  };

  const handleLogout = () => {
    actions.logout();
  };

  const handleChangeSelected = (selected: number) => {
    actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
    getServerTime();
  };

  const handleEditShoppingCart = (cart: ICart, quantity: number, remark: string) => {
    if (isNaN(quantity)) return;

    const cartListCopy = [...cartList];
    const exist = cartListCopy.filter(x => x.menu.id === cart.menu.id);
    
    if (exist.length > 0) {
      exist[0].quantity = quantity;
      exist[0].remark = remark;
      const filteredList = cartListCopy.filter(x => x.menu.id !== cart.menu.id);
      filteredList.push(exist[0]);
      
      actions.setCartList(filteredList);
      localStorage.setItem("cartList", JSON.stringify(filteredList));
      setShoppingCartEdited(true);
      setOpenEdit(false);
    }
  };

  const handleDeleteShoppingCart = (cart: ICart) => {
    const cartListCopy = cartList.filter(x => x.menu.id !== cart.menu.id);
    actions.setCartList(cartListCopy);
    localStorage.setItem("cartList", JSON.stringify(cartListCopy));
    setShoppingCartDeleted(true);
    setOpenEdit(false);
  };

  const handleValidateShoppingCart = async (selectedDate: string) => {
    try {
      await getServerTime();

      const startDate = moment(serverTime).subtract(2, 'hour');
      const endDate = moment(moment(selectedDate, "MM-DD-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));

      if (startDate < endDate) {
        const menus = cartList.map(cart => ({
          id: cart.menu.id,
          quantity: cart.quantity,
          remark: cart.remark,
          pricing: cart.menu.pricing,
          title: cart.menu.title,
          title_en: cart.menu.title_en,
          size: cart.menu.MenuSize ? cart.menu.MenuSize.title : "",
          size_en: cart.menu.MenuSize ? cart.menu.MenuSize.title_en : "",
          extras: cart.extras
        }));

        actions.addOrder(userId, menus, selectedDate);
        localStorage.setItem("cartList", JSON.stringify([]));
        setRedirectTo("/menus/success");
      } else {
        setRedirectTo("/cart/toolate");
      }
    } catch (e) {
      alert('An error occurred while validating cart');
    }
  };

  const handleContinueShopping = () => {
    setRedirectTo("/menus");
  };

  const handleOpenEdit = (cart: ICart) => {
    setOpenEdit(true);
    setEditCart(cart);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const calculateTotalExtras = (extras: IExtra[]) => {
    if (!extras || extras.length === 0) return 0;
    return extras.reduce((total, extra) => total + parseFloat(extra.pricing), 0);
  };

  const calculateTotal = () => {
    if (!cartList || cartList.length === 0) return 0;
    return cartList.reduce((total, cart) => 
      total + (parseFloat(cart.menu.pricing) * cart.quantity) + 
      (cart.quantity * calculateTotalExtras(cart.extras)), 0);
  };

  const getTranslation = (tag: string) => {
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
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
      orderItems={orderListTotalCount || 0}
      selected={selected}
      title={getTranslation("_MON_PANIER")}
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={getTranslation}
    >
      {shoppingCartToolate && id === "toolate" && (
        <SnackbarAction
          error
          message={getTranslation("_HEURE_LIMITE_DEPASSEE")}
          onClose={() => setShoppingCartToolate(false)}
        />
      )}
      {shoppingCartAdded && id === "success" && (
        <SnackbarAction
          success
          message={getTranslation("_MENU_BIEN_AJOUTE")}
          onClose={() => setShoppingCartAdded(false)}
        />
      )}
      {shoppingCartEdited && (
        <SnackbarAction
          success
          message={getTranslation("_MENU_BIEN_MODIFIE")}
          onClose={() => setShoppingCartEdited(false)}
        />
      )}
      {shoppingCartDeleted && (
        <SnackbarAction
          success
          message={getTranslation("_MENU_BIEN_SUPPRIME")}
          onClose={() => setShoppingCartDeleted(false)}
        />
      )}
      {openEdit && (
        <EditCart
          cart={editCart}
          userLanguage={userLanguage}
          onEditShoppingCart={handleEditShoppingCart}
          onDeleteShoppingCart={handleDeleteShoppingCart}
          onClose={handleCloseEdit}
          checkDictionnary={getTranslation}
        />
      )}
      <Box component="main" sx={{ flex: 1 }}>
        <StyledLayout>
          <StyledBox className="centered-text">
            {!isListPending && (
              <>
                <SectionDesktop>
                  <CartTable
                    cartList={[...cartList].sort(menuSort)}
                    readOnly={false}
                    userType={userType}
                    userLanguage={userLanguage}
                    onEditShoppingCart={handleEditShoppingCart}
                    onDeleteShoppingCart={handleDeleteShoppingCart}
                    checkDictionnary={getTranslation}
                  />
                </SectionDesktop>
                <SectionMobile>
                  <CartList
                    cartList={[...cartList].sort(menuSort)}
                    userLanguage={userLanguage}
                    onOpenEdit={handleOpenEdit}
                    checkDictionnary={getTranslation}
                  />
                </SectionMobile>
                {cartList && cartList.length > 0 && (
                  <CartRecap
                    totalPricing={calculateTotal()}
                    userType={userType}
                    is_away={is_away}
                    cart_list={cartList}
                    userLanguage={userLanguage}
                    settingList={settingList}
                    onValidateShoppingCart={handleValidateShoppingCart}
                    onContinueShopping={handleContinueShopping}
                    checkDictionnary={getTranslation}
                    serverTime={serverTime}
                  />
                )}
              </>
            )}
          </StyledBox>
        </StyledLayout>
      </Box>
      <Footer />
    </MenuBar>
  );
};

export default Cart;
