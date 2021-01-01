import {OpenProjectPage} from './pages/OpenProjectPage';
import {RouteConfig} from 'react-router-config';
import {DashboardPage} from "./pages/DashboardPage";
import {ConfigYmlPage} from "./pages/ConfigYmlPage";
import {PostsPage} from "./pages/PostsPage";
import {PostDetailPage} from "./pages/PostDetailPage";

export const PATH_OPEN_PROJECT = '/open-project';
export const PATH_DASHBOARD = '/dashboard';
export const PATH_CONFIG_YML = PATH_DASHBOARD + '/config-yml';
export const PATH_POSTS = PATH_DASHBOARD + '/posts';
export const PATH_POST_DETAIL = PATH_POSTS + '/:postId';
export const getPostDetailPathById = (postId: string) => PATH_POSTS + '/' + postId;

export const routes: RouteConfig[] = [
  {
    path: PATH_DASHBOARD,
    component: DashboardPage,
    routes: [
      {
        path: PATH_CONFIG_YML,
        component: ConfigYmlPage
      },
      {
        path: PATH_POSTS,
        exact: true,
        component: PostsPage
      },
      {
        path: PATH_POST_DETAIL,
        component: PostDetailPage
      }
    ]
  },
  {
    path: PATH_OPEN_PROJECT,
    component: OpenProjectPage,
  }
];
