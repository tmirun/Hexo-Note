import {OpenProjectPage} from './pages/OpenProjectPage';
import {RouteConfig} from 'react-router-config';
import {Dashboard} from "./pages/Dashboard";

export const PATH_OPEN_PROJECT = '/open-project';
export const PATH_DASHBOARD = '/dashboard';


export const routes: RouteConfig[] = [
  {
    path: PATH_DASHBOARD,
    component: Dashboard,
    exact: true,
    routes: [
    ]
  },
  {
    path: PATH_OPEN_PROJECT,
    component: OpenProjectPage,
  }
];
