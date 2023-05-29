import "./App.css";
import "./normalize.css";
import "./reset.css";

import { useRoutes } from "./components/routers/Routers";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import { Footer, Header } from "./components/layout";

const App = () => {
  const { accessToken, login, logout, ready } = useAuth();
  const isAuthenticated = !!accessToken;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return null;
  }
  
  return (
    <>
      <AuthContext.Provider
        value={{
          accessToken,
          login,
          logout,
          isAuthenticated,
        }}
      >
        <BrowserRouter>
        <Header/>
          <div className="Main-Wrapper">{routes}</div>
          <Footer/>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
};

export default App;