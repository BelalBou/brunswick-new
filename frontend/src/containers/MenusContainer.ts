// ./containers/MenusContainer.tsx
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Menus from "../components/Menus/Menus";
import { RootState } from "../store/store";

// Import des actions individuelles
import { getDictionnaries } from "../store/thunks/dictionnary";
import { getSuppliers } from "../store/thunks/supplier";
import { getOrdersTotalCountForCustomer } from "../store/thunks/order";
import { getCategoriesSupplier } from "../store/thunks/category";
import { getMenusSupplier } from "../store/thunks/menu";
import { logout } from "../store/thunks/login";
import { setSelected } from "../store/slices/pageSlice";

const mapStateToProps = (state: RootState) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  userLanguage: state.user.userLanguage,
  userToken: state.user.userToken,
  userType: state.user.userType,
  userValidity: state.user.userValidity,
  selected: state.page.selected,
  dictionnaryList: state.dictionnary.dictionnaryList,
  supplierList: state.supplier.supplierList,
  menuList: state.menu.menuList,
  categoryList: state.category.categoryList,
  cartList: state.cart.cartList,
  orderListTotalCount: state.order.orderListTotalCount,
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getDictionnaries,
    getSuppliers,
    getOrdersTotalCountForCustomer,
    getCategoriesSupplier,
    getMenusSupplier,
    setSelected,
    logout,
    setCartList: (cart: any[]) => dispatch({ type: 'cart/setCartList', payload: cart }),
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menus);
