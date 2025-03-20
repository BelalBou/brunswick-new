// ./containers/LoginContainer.ts
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Login from "../components/Login/Login";
import { RootState } from "../store/store";
import { login, register, resetPassword } from "../store/thunks/login";
import { getDictionnaries } from "../store/thunks/dictionnary";
import { editToken } from "../store/thunks/user";

const mapStateToProps = (state: RootState) => ({
  isLoginPending: state.login.isLoginPending,
  isLoginSuccess: state.login.isLoginSuccess,
  loginError: state.login.loginError,
  isListPending: state.list.isListPending,
  isEditPending: state.edit.isEditPending,
  isEditSuccess: state.edit.isEditSuccess,
  editError: state.edit.editError,
  userLanguage: state.user.userLanguage,
  dictionnaryList: state.dictionnary.dictionnaryList,
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({ login, register, resetPassword, getDictionnaries, editToken }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
