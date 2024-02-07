import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
//TODO: Guards
const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent, },
  { path: 'home', component: DashboardComponent, title: "Dashboard | SNL Nigeria Insiders" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
