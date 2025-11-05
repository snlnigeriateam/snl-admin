import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../alerts/alerts';
import { Departments } from '../departments';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Loading } from '../loading/loading';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-create-department',
	imports: [FormsModule, MatFormFieldModule, MatInputModule, Loading, MatButtonModule],
	templateUrl: './create-department.html',
	styleUrl: './create-department.scss',
})
export class CreateDepartment {
	actionLoading: boolean = false;

	name: string = "";

	constructor(
		private router: Router,
		private alerts: Alerts,
		private dService: Departments
	) { }

	validate() {
		let wsp = /^\s*$/;

		if (!this.name || wsp.test(this.name)) {
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
