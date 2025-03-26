import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState } from "../store/store";
import Account from "../components/Account/Account";
import { getDictionnaries } from "../store/thunks/dictionnary";
import { logout } from "../store/thunks/login";
import { editUserLanguage, editToken } from "../store/thunks/user";
import { setSelected } from "../store/slices/pageSlice";

const mapStateToProps = (state: RootState) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  userFirstName: state.user.userFirstName,
  userLastName: state.user.userLastName,
  userEmailAddress: state.user.userEmailAddress,
  userType: state.user.userType,
  userLanguage: state.user.userLanguage,
  selected: state.page.selected,
  dictionnaryList: state.dictionnary.dictionnaryList
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators(
    {
      getDictionnaries,
      logout,
      editUserLanguage,
      editToken,
      setSelected
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
