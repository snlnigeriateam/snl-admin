import { Component } from '@angular/core';
import { Alerts } from '../alerts/alerts';
import { Auth } from '../auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Loading } from '../loading/loading';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-create-access-level',
	imports: [MatFormFieldModule, FormsModule, MatInputModule, Loading, MatButtonModule],
	templateUrl: './create-access-level.html',
	styleUrl: './create-access-level.scss',
})
export class CreateAccessLevel {
	createLoading: boolean = false;

	name: string = "";
	tier: number = 6; // Default to lowest tier
	permissions: Array<string> = ["DEFAULT"];

	constructor(
		private alerts: Alerts,
		private auth: Auth
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
