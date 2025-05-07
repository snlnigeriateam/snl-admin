import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { DepartmentsService } from '../departments.service';

@Component({
	selector: 'app-create-department',
	templateUrl: './create-department.component.html',
	styleUrl: './create-department.component.scss'
})
export class CreateDepartmentComponent {
	actionLoading: boolean = false;

	name: string = "";

	constructor(
		private router: Router,
		private alerts: AlertsComponent,
		private dService: DepartmentsService
	){}

	validate(){
		let wsp = /^\s*$/;

		if(!this.name || wsp.test(this.name)){
			this.alerts.alert("Please specify the Department Name", true);
		}
		else {
			this.actionLoading = true;
			this.dService.createDepartment(this.name).subscribe({
				next: (data) => {
					this.actionLoading = false;
					if (data.success) {
						this.alerts.alert("Department Created!", false);
						this.name = "";
					}
					else if (data.login) {
						this.router.navigate(['/']);
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.actionLoading = false;
					this.alerts.alert("An Error occured. Please Contact Tech Support", true);
				}
			});
		}
	}
}
