import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { HiringService } from '../hiring.service';

@Component({
	selector: 'app-create-position',
	templateUrl: './create-position.component.html',
	styleUrl: './create-position.component.scss'
})
export class CreatePositionComponent {
	createLoading: boolean = false;

	name: string = "";
	description: string = "";
	unique: boolean = false;

	constructor(
		private router: Router,
		private alerts: AlertsComponent,
		private hService: HiringService
	) { }

	validate() {
		let wsp = /^\s*$/;

		if (!this.name || !this.description) {
			this.alerts.alert("Please fill out all fields", true);
		}
		else if (wsp.test(this.name) || wsp.test(this.description)) {
			this.alerts.alert("Please fill out all fields", true);
		}
		else {
			this.create();
		}
	}

	create() {
		this.createLoading = true;

		this.hService.createPosition(this.name, this.unique, this.description).subscribe({
			next: (data) => {
				this.createLoading = false;
				if (data.success) {
					this.name = "";
					this.description = "";
					this.unique = false;
					this.alerts.alert("Position Created!", false);
					this.router.navigate(['/hiring', 'positions']);
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
