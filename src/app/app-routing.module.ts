import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      // { path: '', redirectTo: 'overview', pathMatch: 'full' },
      // { path: 'overview', component: Overview },
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
