import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import "nprogress/nprogress.css";
import App from "src/App";
import { SidebarProvider } from "src/contexts/SidebarContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CookiesProvider } from "react-cookie";

ReactDOM.render(
  <HelmetProvider>
    <CookiesProvider>
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </CookiesProvider>
  </HelmetProvider>,
  document.getElementById("root")
);
