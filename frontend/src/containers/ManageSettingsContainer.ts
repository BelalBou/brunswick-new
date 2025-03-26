import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/thunks";
import ManageSettings from "../components/ManageSettings/ManageSettings";

const mapStateToProps = (state: any) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  isEditSuccess: state.edit.isEditSuccess,
  userType: state.user.userType,
  userToken: state.user.userToken,
  userLanguage: state.user.userLanguage,
  selected: state.page.selected,
  dictionaryList: state.dictionnary.dictionnaryList,
  settingList: state.setting.settingList,
  dailyMailList: state.dailyMail.dailyMailList
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

const ManageSettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageSettings);

export default ManageSettingsContainer; 