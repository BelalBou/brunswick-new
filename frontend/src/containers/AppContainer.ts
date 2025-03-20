// ./containers/AppContainer.ts
import { connect } from "react-redux";
import { RootState } from "../store/store";
import App from "../components/App/App";

const mapStateToProps = (state: RootState) => ({
  isLoginSuccess: state.login.isLoginSuccess
});

// Pas de dispatch nécessaire si on ne déclenche pas d'actions ici
export default connect(mapStateToProps)(App);
