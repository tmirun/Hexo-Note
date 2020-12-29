import {OpenProjectPage} from './pages/OpenProjectPage';
import {RouteConfig} from 'react-router-config';
import {Dashboard} from "./pages/Dashboard";
import {ConfigYml} from "./pages/ConfigYml";

export const PATH_OPEN_PROJECT = '/open-project';
export const PATH_DASHBOARD = '/dashboard';
export const PATH_CONFIG_YML = PATH_DASHBOARD + '/config-yml';


export const routes: RouteConfig[] = [
  {
    path: PATH_DASHBOARD,
    component: Dashboard,
    routes: [
      {
        path: PATH_CONFIG_YML,
        component: ConfigYml
      }
    ]
  },
  {
    path: PATH_OPEN_PROJECT,
    component: OpenProjectPage,
  }
];
