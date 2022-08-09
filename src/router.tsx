import { Suspense, lazy } from "react";
import { Navigate, RouteObject } from "react-router";

import SidebarLayout from "src/layouts/SidebarLayout";
import BaseLayout from "src/layouts/BaseLayout";

import SuspenseLoader from "src/components/SuspenseLoader";
import AdminOnlyRoute from "./components/AdminOnlyRoute";
import FormFields from "./content/pages/FormFields";
import FormBuilder from "./content/pages/FormBuilder";
import CreateForm from "./content/pages/FormBuilder/createForm";

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
const ProfilePage = Loader(lazy(() => import("src/content/pages/Profile")));

const DashboardPage = Loader(
  lazy(() => import("src/content/dashboards/Crypto"))
);

const AgentsPage = Loader(lazy(() => import("src/content/pages/Agents")));
const TaskTypePage = Loader(lazy(() => import("src/content/pages/TaskType")));
const TaskStatusPage = Loader(
  lazy(() => import("src/content/pages/TaskStatus"))
);
const TaskDetailPage = Loader(
  lazy(() => import("src/content/pages/TaskDetails"))
);

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
  {
    path: "task-type",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <AdminOnlyRoute>
            <TaskTypePage />
          </AdminOnlyRoute>
        ),
      },
    ],
  },
  {
    path: "task-status",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <AdminOnlyRoute>
            <TaskStatusPage />
          </AdminOnlyRoute>
        ),
      },
    ],
  },
  {
    path: "task-details",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <AdminOnlyRoute>
            <TaskDetailPage />
          </AdminOnlyRoute>
        ),
      },
    ],
  },
  {
    path: "form-field",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: <FormFields />,
      },
    ],
  },
  {
    path: "form-builder",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: <FormBuilder />,
      },
    ],
  },
  {
    path: "create-form",
    element: <CreateForm />,
  },
  {
    path: "profile",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <AdminOnlyRoute>
            <ProfilePage />
          </AdminOnlyRoute>
        ),
      },
    ],
  },
];

export default routes;
