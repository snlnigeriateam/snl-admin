import { Component } from '@angular/core';
import { DepartmentsService } from '../departments.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Department } from '../interfaces.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-departments',
	templateUrl: './departments.component.html',
	styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {
	pageLoading: boolean = false;
	departments: Array<Department> = [];

	constructor(
		private dService: DepartmentsService,
		private alerts: AlertsComponent,
		private router: Router
	){
		this.load();
	}

	load(){
		this.pageLoading = true;
		this.dService.loadDepartments().subscribe({
			next: (data)=>{
				this.pageLoading = false;
				
				if(data.success){
					for(let i = 0; i<data.departments.length; i++){
						let c_dept = data.departments[i];

						this.departments.push(c_dept);
					}
				}
				else if (data.login) {
					this.router.navigate(['/']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: ()=>{
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
