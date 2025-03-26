import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Cart from "../components/Cart/Cart";
import { RootState } from "../store/store";
import { getDictionnaries } from "../store/thunks/dictionnary";
import { getSettings } from "../store/thunks/settings";
import { getOrdersTotalCountForCustomer } from "../store/thunks/order";
import { logout } from "../store/thunks/login";
import { setSelected } from "../store/slices/pageSlice";

const mapStateToProps = (state: RootState) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  is_away: state.setting.is_away,
  userId: state.user.userId,
  userToken: state.user.userToken,
  userLanguage: state.user.userLanguage,
  userType: state.user.userType,
  selected: state.page.selected,
  dictionnaryList: state.dictionnary.dictionnaryList,
  cartList: state.cart.cartList,
  settingList: state.setting.settingList,
  orderListTotalCount: state.order.orderListTotalCount,
  serverTime: state.setting.serverTime,
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getDictionnaries,
    getSettings,
    getOrdersTotalCountForCustomer,
    setSelected,
    logout,
    setCartList: (cart: any[]) => dispatch({ type: 'cart/setCartList', payload: cart }),
    addOrder: (userId: number, menus: any[], selectedDate: string) => 
      dispatch({ type: 'order/addOrder', payload: { userId, menus, selectedDate } }),
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
