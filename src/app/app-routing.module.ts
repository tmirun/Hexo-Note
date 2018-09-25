import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PostComponent } from './pages/dashboard/post/post.component';
import { PostDetailComponent } from './pages/dashboard/post/post-detail/post-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';
import { CanDeactivateGuard } from './guard/can-deactivate.guard';
import { AppInitGuard } from './guard/app-init.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ AppInitGuard ],
    children: [
      { path: 'settings', component: SettingsComponent },
      {
        path: 'post',
        component: PostComponent,
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
