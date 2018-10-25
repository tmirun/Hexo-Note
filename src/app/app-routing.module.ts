import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PostComponent } from './pages/dashboard/post/post.component';
import { PostDetailComponent } from './pages/dashboard/post/post-detail/post-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';
import { CanDeactivateGuard } from './guard/can-deactivate.guard';
import { AppInitGuard } from './guard/app-init.guard';
import { NotProjectFoundComponent } from './pages/not-project-found/not-project-found.component';

const routes: Routes = [
  {
    path: 'not-project-found',
    component: NotProjectFoundComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'settings',
        canActivate: [ AppInitGuard ],
        component: SettingsComponent
      },
      {
        path: 'post',
        component: PostComponent,
        canActivate: [ AppInitGuard ],
        children: [
          { path: ':id',
            component: PostDetailComponent,
            canDeactivate: [CanDeactivateGuard],
          },
        ]
      },
    ]
  },
  { path: '', redirectTo: '/dashboard/post', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
