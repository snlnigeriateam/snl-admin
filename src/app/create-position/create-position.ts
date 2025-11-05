import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../alerts/alerts';
import { Hiring } from '../hiring';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Loading } from '../loading/loading';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-create-position',
	imports: [MatFormFieldModule, FormsModule, MatInputModule, MatSlideToggleModule, Loading, MatButtonModule],
	templateUrl: './create-position.html',
	styleUrl: './create-position.scss',
})
export class CreatePosition {
	createLoading: boolean = false;

	name: string = "";
	description: string = "";
	unique: boolean = false;

	constructor(
		private router: Router,
		private alerts: Alerts,
		private hService: Hiring
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
