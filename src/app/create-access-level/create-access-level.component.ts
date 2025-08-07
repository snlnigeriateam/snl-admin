import { Component } from '@angular/core';
import { AlertsComponent } from '../alerts/alerts.component';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-create-access-level',
	templateUrl: './create-access-level.component.html',
	styleUrl: './create-access-level.component.scss'
})
export class CreateAccessLevelComponent {
	createLoading: boolean = false;

	name: string = "";
	tier: number = 6; // Default to lowest tier
	permissions: Array<string> = ["DEFAULT"];

	constructor(
		private alerts: AlertsComponent,
		private auth: AuthService
	) { }

	validate() {
		let wsp = /^\s*$/;

		if (!this.name || !this.tier || !this.permissions.length) {
			this.alerts.alert("Please fill out all fields", true);
		}
		else if (wsp.test(this.name) || isNaN(this.tier) || this.permissions.length === 0) {
			this.alerts.alert("Please fill out all fields", true);
		}
		else {
			this.create();
		}
	}

	create() {
		this.createLoading = true;

		this.auth.createAccessLevel(this.name, this.tier, this.permissions).subscribe({
			next: (data) => {
				this.createLoading = false;
				if (data.success) {
					this.name = "";
					this.tier = 6; // Reset to default tier
					this.permissions = ["DEFAULT"];
					this.alerts.alert("Access Level Created!", false);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
