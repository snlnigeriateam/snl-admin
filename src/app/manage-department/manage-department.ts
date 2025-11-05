import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../alerts/alerts';
import { Departments } from '../departments';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Loading } from '../loading/loading';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface Person {
	f_name: string,
	l_name: string,
	a_id: string
}

@Component({
	selector: 'app-manage-department',
	imports: [FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule, Loading, MatButtonModule],
	templateUrl: './manage-department.html',
	styleUrl: './manage-department.scss',
})
export class ManageDepartment {
	d_id: string;

	pageLoading: boolean = false;
	actionLoading: boolean = false;
	pageLoaded: boolean = false;

	people: Array<Person> = [];

	name: string = "";
	head: string = "";

	constructor(
		private router: Router,
		private alerts: Alerts,
		private dService: Departments
	) {
		this.d_id = this.router.parseUrl(this.router.url).root.children['primary'].segments[2].path;
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.dService.loadDepartment(this.d_id).subscribe({
			next: (data) => {
				this.pageLoading = false;

				if (data.success) {
					for (let i = 0; i < data.administrators.length; i++) {
						let c_admin = data.administrators[i];

						this.people.push(c_admin);
					}
					this.name = data.department.name;
					this.head = data.department.head;

					this.pageLoaded = true;
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

	validate() {
		let wsp = /^\s*$/;

		if (!this.name || wsp.test(this.name)) {
			this.alerts.alert("Please specify the Department Name", true);
		}
		else {
			this.actionLoading = true;
			this.dService.updateDepartment(this.d_id, this.name, this.head).subscribe({
				next: (data) => {
					this.actionLoading = false;
					if (data.success) {
						this.alerts.alert("Department Updated!", false);
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

	remove() {
		this.alerts.confirm("Do you want to remove this Department? This action is permanent.").then((remove) => {
			if (remove) {
				this.pageLoading = true;
				this.dService.removeDepartment(this.d_id).subscribe({
					next: (data) => {
						this.pageLoading = false;
						if (data.success) {
							this.alerts.alert("Department Removed successfully", false);
							this.router.navigate(['/departments']);
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
						this.alerts.alert("An Error occured. Please Contact Tech Support", true);
					}
				});
			}
		});
	}
}
