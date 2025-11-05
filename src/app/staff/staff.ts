import { Component } from '@angular/core';
import { Alerts } from '../alerts/alerts';
import { Staff as StaffService } from '../staff';
import { Clipboard } from '@angular/cdk/clipboard';
import { User } from '../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Loading } from '../loading/loading';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-staff',
	imports: [MatIconModule, RouterLink, Loading, MatButtonModule],
	templateUrl: './staff.html',
	styleUrl: './staff.scss',
})
export class Staff {
	pageLoading: boolean = false;
	loaded: boolean = false;
	editAccess: boolean = false;

	users: Array<User> = [];

	constructor(
		private alerts: Alerts,
		private sService: StaffService,
		private clipboard: Clipboard
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.sService.loadAdministrators().subscribe({
			next: (data) => {
				this.pageLoading = false;
				if (data.success) {
					let users = data.admins;
					let positions = data.positions;
					let tier = data.tier;
					if (tier < 3) {
						this.editAccess = true;
					}

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

	copy(text: string) {
		let copied = this.clipboard.copy(text);
		if (copied) {
			this.alerts.alert("Email Address Copied to Clipboard", false);
		}
	}
}
