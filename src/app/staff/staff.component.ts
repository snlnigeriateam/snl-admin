import { Component } from '@angular/core';
import { AlertsComponent } from '../alerts/alerts.component';
import { StaffService } from '../staff.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { User } from '../interfaces.service';

@Component({
	selector: 'app-staff',
	templateUrl: './staff.component.html',
	styleUrl: './staff.component.scss'
})
export class StaffComponent {
	pageLoading: boolean = false;
	loaded: boolean = false;
	editAccess: boolean = false;

	users: Array<User> = [];

	constructor(
		private alerts: AlertsComponent,
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
					if(tier < 3){
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

	copy(text: string){
		let copied = this.clipboard.copy(text);
		if(copied){
			this.alerts.alert("Email Address Copied to Clipboard", false);
		}
	}
}
