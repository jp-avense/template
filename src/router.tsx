import { Suspense, lazy } from "react";
import { Navigate, RouteObject } from "react-router";

import SidebarLayout from "src/layouts/SidebarLayout";
import BaseLayout from "src/layouts/BaseLayout";

import SuspenseLoader from "src/components/SuspenseLoader";
import AdminOnlyRoute from "./components/AdminOnlyRoute";

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Status404 = Loader(
  lazy(() => import("src/content/pages/Status/Status404"))
);

const LoginPage = Loader(lazy(() => import("src/content/pages/Login")));
const TaskPage = Loader(lazy(() => import("src/content/pages/Tasks")));

const DashboardPage = Loader(
  lazy(() => import("src/content/dashboards/Crypto"))
);

const AgentsPage = Loader(lazy(() => import("src/content/pages/Agents")));

const routes: RouteObject[] = [
  {
    path: "",
    element: <BaseLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "",
        element: <Navigate to="login" />,
      },
      {
        path: "*",
        element: <Status404 />,
      },
    ],
  },
  {
    path: "",
    element: <SidebarLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "tasks",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: <TaskPage />,
      },
    ],
  },
  {
    path: "agents",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <AdminOnlyRoute>
            <AgentsPage />
          </AdminOnlyRoute>
        ),
      },
    ],
  },
];

export default routes;
