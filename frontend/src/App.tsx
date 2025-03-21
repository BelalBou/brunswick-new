import { Provider } from "react-redux";
import { ThemeProvider } from '@mui/material/styles';
import store from "./store/store";
import theme from "./theme/theme";

// On importe le composant MyRoutes (Routes personnalisées)
import MyRoutes from "./Routes";

// On importe les actions "login", "user", "cart", "page" depuis vos slices
import { setLoginSuccess } from "./store/slices/loginSlice";
import {
  setUserId,
  setUserFirstName,
  setUserLastName,
  setUserLanguage,
  setUserType,
  setUserSupplierId,
  setUserEmailAddress,
  setUserPassword,
  setUserToken
} from "./store/slices/userSlice";
import { setCartList } from "./store/slices/cartSlice";
import { setSelected } from "./store/slices/pageSlice";

import "./css/index.css";

function App() {
  // 1) Hydratation "user" depuis localStorage
  const user = localStorage.getItem("user");
  if (user) {
    const {
      id,
      firstName,
      lastName,
      language,
      type,
      supplierId,
      emailAddress,
      password,
      token
    } = JSON.parse(user);

    store.dispatch(setLoginSuccess(true));
    store.dispatch(setUserId(id));
    store.dispatch(setUserFirstName(firstName));
    store.dispatch(setUserLastName(lastName));
    store.dispatch(setUserLanguage(language));
    store.dispatch(setUserType(type));
    store.dispatch(setUserSupplierId(supplierId));
    store.dispatch(setUserEmailAddress(emailAddress));
    store.dispatch(setUserPassword(password));
    store.dispatch(setUserToken(token));
  }

  // 2) Hydratation "cartList"
  const cartList = localStorage.getItem("cartList");
  if (cartList) {
    store.dispatch(setCartList(JSON.parse(cartList)));
  }

  // 3) Hydratation "selected"
  const selected = localStorage.getItem("selected");
  if (selected) {
    store.dispatch(setSelected(parseInt(selected, 10)));
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* On affiche MyRoutes (notre composant de routes) */}
        <MyRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
