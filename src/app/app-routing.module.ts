import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HiringComponent } from './hiring/hiring.component';
import { PositionsComponent } from './positions/positions.component';
import { HiringRoundsComponent } from './hiring-rounds/hiring-rounds.component';
import { CreatePositionComponent } from './create-position/create-position.component';
import { StartHiringRoundComponent } from './start-hiring-round/start-hiring-round.component';
import { HiringRoundComponent } from './hiring-round/hiring-round.component';
//TODO: Guards
const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent, },
  { path: 'home', component: DashboardComponent, title: "Dashboard | SNL Nigeria Insiders" },
  { path: 'hiring', component: HiringComponent, title: "Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/positions', component: PositionsComponent, title: "Positions - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/hiring-rounds', component: HiringRoundsComponent, title: "Hiring Rounds - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/create-position', component: CreatePositionComponent, title: "Create Position - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/start-hiring-round', component: StartHiringRoundComponent, title: "Start Hiring Round - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/hiring-rounds/:r_id', component: HiringRoundComponent, title: "Hiring Round - Hiring | SNL Nigeria Insiders" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
