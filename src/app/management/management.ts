import { Component } from '@angular/core';
import { User } from '../interfaces';
import { Alerts } from '../alerts/alerts';
import { Staff } from '../staff';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Loading } from '../loading/loading';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-management',
	imports: [RouterLink, MatIconModule, Loading, MatButtonModule],
	templateUrl: './management.html',
	styleUrl: './management.scss',
})
export class Management {
	pageLoading: boolean = false;
	loaded: boolean = false;
	users: Array<User> = [];

	constructor(
		private alerts: Alerts,
		private sService: Staff
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
