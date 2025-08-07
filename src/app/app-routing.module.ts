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
import { StaffComponent } from './staff/staff.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { ApplicationsComponent } from './applications/applications.component';
import { QueriesComponent } from './queries/queries.component';
import { SettingsComponent } from './settings/settings.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { CreateTrainingComponent } from './create-training/create-training.component';
import { ManageTrainingsComponent } from './manage-trainings/manage-trainings.component';
import { ManageTrainingComponent } from './manage-training/manage-training.component';
import { AvailableTrainingsComponent } from './available-trainings/available-trainings.component';
import { TakeTrainingComponent } from './take-training/take-training.component';
import { DepartmentsComponent } from './departments/departments.component';
import { CreateDepartmentComponent } from './create-department/create-department.component';
import { ManageDepartmentComponent } from './manage-department/manage-department.component';
import { ManagementComponent } from './management/management.component';
import { ManageDirectReportComponent } from './manage-direct-report/manage-direct-report.component';
import { ManagePersonnelComponent } from './manage-personnel/manage-personnel.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { AccessLevelsComponent } from './access-levels/access-levels.component';
import { CreateAccessLevelComponent } from './create-access-level/create-access-level.component';
import { EditAccessLevelComponent } from './edit-access-level/edit-access-level.component';
//TODO: Guards
const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent, },
  { path: 'onboarding', component: VerifyCodeComponent, title: "Onboarding | SNL Nigeria Insiders" },
  { path: 'home', component: DashboardComponent, title: "Dashboard | SNL Nigeria Insiders" },
  { path: 'hiring', component: HiringComponent, title: "Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/positions', component: PositionsComponent, title: "Positions - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/hiring-rounds', component: HiringRoundsComponent, title: "Hiring Rounds - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/create-position', component: CreatePositionComponent, title: "Create Position - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/start-hiring-round', component: StartHiringRoundComponent, title: "Start Hiring Round - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/hiring-rounds/:r_id', component: HiringRoundComponent, title: "Hiring Round - Hiring | SNL Nigeria Insiders" },
  { path: 'hiring/hiring-rounds/:r_id/applications', component: ApplicationsComponent, title: "Hiring Round Applications - Hiring | SNL Nigeria Insiders" },
  { path: 'staff', component: StaffComponent, title: 'Staff | SNL Nigeria Insiders' },
  { path: 'staff/add-personnel', component: AddAdminComponent, title: 'Add Personnel | SNL Nigeria Insiders' },
  { path: 'support', component: QueriesComponent, title: 'Support Queries | SNL Nigeria Insiders' },
  { path: 'settings', component: SettingsComponent, title: "Account Settings | SNL Nigeria Insiders" },
  { path: 'trainings', component: TrainingsComponent, title: "Trainings | SNL Nigeria Insiders" },
  { path: 'trainings/create-training', component: CreateTrainingComponent, title: "Create Training - Trainings | SNL Nigeria Insiders" },
  { path: 'trainings/manage-trainings', component: ManageTrainingsComponent, title: "Manage Trainings - Trainings | SNL Nigeria Insiders" },
  { path: 'trainings/manage-training/:t_id', component: ManageTrainingComponent },
  { path: 'trainings/available-trainings', component: AvailableTrainingsComponent, title: "Available Trainings - Trainings | SNL Nigeria Insiders" },
  { path: 'trainings/take-training/:t_id', component: TakeTrainingComponent },
  { path: 'departments', component: DepartmentsComponent, title: "Departments | SNL Nigeria Insiders" },
  { path: 'departments/create-department', component: CreateDepartmentComponent, title: "Create Department - Departments | SNL Nigeria Insiders" },
  { path: 'departments/manage-department/:d_id', component: ManageDepartmentComponent, title: "Manage Department - Departments | SNL Nigeria Insiders" },
  { path: 'management', component: ManagementComponent, title: "Manage Direct Reports | SNL Nigeria Insiders" },
  { path: 'management/manage-direct-report/:r_id', component: ManageDirectReportComponent, title: "Manage Direct Report | SNL Nigeria Insiders" },
  { path: 'staff/manage-personnel/:a_id', component: ManagePersonnelComponent, title: "Manage Personnel | SNL Nigeria Insiders" },
  { path: 'access-levels', component: AccessLevelsComponent, title: "Access Levels | SNL Nigeria Insiders" },
  { path: 'access-levels/create-access-level', component: CreateAccessLevelComponent, title: "Create Access Level - Access Levels | SNL Nigeria Insiders" },
  { path: 'access-levels/edit-access-level/:l_id', component: EditAccessLevelComponent, title: "Edit Access Level - Access Levels | SNL Nigeria Insiders" },
  { path: 'calendar', component: CalendarComponent, title: "Corporate Calendar | SNL Nigeria Insiders" },
  { path: 'calendar/edit', component: CalendarEditComponent, title: "Update Corporate Calendar | SNL Nigeria Insiders" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
