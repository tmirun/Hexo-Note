import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PostComponent } from './pages/dashboard/post/post.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HexoInitGuard } from './guard/hexo-init.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ HexoInitGuard],
    children: [
      { path: '', redirectTo: 'post', pathMatch: 'full' },
      { path: 'post', component: PostComponent },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
