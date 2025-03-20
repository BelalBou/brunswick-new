// ./components/App/App.tsx

import { Navigate } from "react-router-dom";

interface IProps {
  isLoginSuccess: boolean;
}

const App = ({ isLoginSuccess }: IProps) => {
  // Si isLoginSuccess = true => redirige /menus
  // Sinon => /login
  return <Navigate to={isLoginSuccess ? "/menus" : "/login"} />;
};

export default App;
