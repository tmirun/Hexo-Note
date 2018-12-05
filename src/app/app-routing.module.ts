import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ArticleComponent } from './pages/dashboard/article/article.component';
import { ArticleDetailComponent } from './pages/dashboard/article/article-detail/article-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';
import { CanDeactivateGuard } from './guard/can-deactivate.guard';
import { AppInitGuard } from './guard/app-init.guard';
import { ConfigInitGuard} from './guard/config-init.guard';
import { NotProjectFoundComponent } from './pages/not-project-found/not-project-found.component';

const routes: Routes = [
  {
    path: 'not-project-found',
    component: NotProjectFoundComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ AppInitGuard ],
    children: [
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'article',
        component: ArticleComponent,
        canActivate: [ ConfigInitGuard ],
        children: [
          { path: ':id',
            component: ArticleDetailComponent,
            canDeactivate: [CanDeactivateGuard],
          },
        ]
      },
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
