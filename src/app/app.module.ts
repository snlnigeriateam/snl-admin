import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
// import { QuillConfigModule } from 'ngx-quill/config';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioModule } from "@angular/material/radio";
import { MatExpansionModule } from "@angular/material/expansion";
import { ClipboardModule } from "@angular/cdk/clipboard";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { TeamComponent } from './team/team.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { LoadingComponent } from './loading/loading.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { HiringComponent } from './hiring/hiring.component';
import { HiringRoundsComponent } from './hiring-rounds/hiring-rounds.component';
import { HiringRoundComponent } from './hiring-round/hiring-round.component';
import { StartHiringRoundComponent } from './start-hiring-round/start-hiring-round.component';
import { PositionsComponent } from './positions/positions.component';
import { CreatePositionComponent } from './create-position/create-position.component';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { StaffComponent } from './staff/staff.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { ApplicationsComponent } from './applications/applications.component';
import { QueriesComponent } from './queries/queries.component';
import { ImageCropperModule } from 'ngx-image-cropper';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    TeamComponent,
    ContactComponent,
    LoginComponent,
    AlertsComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    LoadingComponent,
    DashboardComponent,
    SettingsComponent,
    HiringComponent,
    HiringRoundsComponent,
    HiringRoundComponent,
    StartHiringRoundComponent,
    PositionsComponent,
    CreatePositionComponent,
    StaffComponent,
    AddAdminComponent,
    VerifyCodeComponent,
    ApplicationsComponent,
    QueriesComponent,
    TrainingsComponent,
    CreateTrainingComponent,
    ManageTrainingsComponent,
    ManageTrainingComponent,
    AvailableTrainingsComponent,
    TakeTrainingComponent,
    DepartmentsComponent,
    CreateDepartmentComponent,
    ManageDepartmentComponent,
    ManagementComponent,
    ManageDirectReportComponent,
    ManagePersonnelComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSlideToggle,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTabsModule,
    MatRadioModule,
    MatExpansionModule,
    ClipboardModule,
    ImageCropperModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          // [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          // [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button

          ['link', 'video']
          // ['link', 'image', 'video']
        ],
      }
    })
  ],
  providers: [AlertsComponent, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
