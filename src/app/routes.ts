import { createBrowserRouter } from "react-router";
import AdminPage from "./pages/AdminPage";
import PublicPage from "./pages/PublicPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/browse",
    Component: PublicPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/admin",
        Component: AdminPage,
      },
    ],
  },
]);
