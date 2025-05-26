import { Component } from '@angular/core';
import { AlertsComponent } from '../alerts/alerts.component';
import { StaffService } from '../staff.service';
import { User } from '../interfaces.service';

@Component({
	selector: 'app-management',
	templateUrl: './management.component.html',
	styleUrl: './management.component.scss'
})
export class ManagementComponent {
	pageLoading: boolean = false;
	loaded: boolean = false;
	users: Array<User> = [];
	
	constructor(
		private alerts: AlertsComponent,
		private sService: StaffService
	) {
		this.load();
	}
	
	load() {
		this.pageLoading = true;
		this.sService.loadDirectReports().subscribe({
			next: (data) => {
				this.pageLoading = false;
				if (data.success) {
					let users = data.reports;
					let positions = data.positions;

					for (let i = 0; i < users.length; i++) {
						let c_user = users[i];

						for (let j = 0; j < positions.length; j++) {
							let c_pos = positions[j];

							if (c_user.p_id === c_pos.p_id) {
								c_user.role = c_pos.name;
							}
						}
					}

					this.users = users;
					this.loaded = true;
				} else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: (err) => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
