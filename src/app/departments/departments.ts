import { Component } from '@angular/core';
import { Department } from '../interfaces';
import {Departments as DepartmentsService} from '../departments';
import { Router, RouterLink } from '@angular/router';
import { Alerts } from '../alerts/alerts';
import { MatIconModule } from '@angular/material/icon';
import { Loading } from '../loading/loading';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-departments',
	imports: [MatIconModule, RouterLink, Loading, MatButtonModule],
	templateUrl: './departments.html',
	styleUrl: './departments.scss',
})
export class Departments {
	pageLoading: boolean = false;
	departments: Array<Department> = [];

	constructor(
		private dService: DepartmentsService,
		private alerts: Alerts,
		private router: Router
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.dService.loadDepartments().subscribe({
			next: (data) => {
				this.pageLoading = false;

				if (data.success) {
					for (let i = 0; i < data.departments.length; i++) {
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
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
