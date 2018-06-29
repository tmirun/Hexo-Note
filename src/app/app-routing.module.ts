import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PostComponent } from './pages/dashboard/post/post.component';
import { PostDetailComponent } from './pages/dashboard/post/post-detail/post-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HexoInitGuard } from './guard/hexo-init.guard';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ HexoInitGuard],
    children: [
      { path: 'settings', component: SettingsComponent },
      {
        path: 'post',
        component: PostComponent,
        children: [
          { path: ':id', component: PostDetailComponent },
        ]
      },
      { path: '', redirectTo: 'post', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
