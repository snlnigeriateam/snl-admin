import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { HiringService } from '../hiring.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface Position {
	name: string,
	description: string,
	p_id: string,
	unique: boolean
}

@Component({
	selector: 'app-start-hiring-round',
	templateUrl: './start-hiring-round.component.html',
	styleUrl: './start-hiring-round.component.scss'
})
export class StartHiringRoundComponent {
	pageLoading: boolean = false;
	createLoading: boolean = false;

	positions: Array<Position> = [];
	start_date: Date = new Date();
	min_date: Date = new Date();

	name: string = "";
	sel_pos: Array<string> = [];
	duration: number = 10;
	// segments: Array = [];

	constructor(
		private router: Router,
		private alerts: AlertsComponent,
		private hService: HiringService
	) {
		this.start_date.setDate(this.start_date.getDate() + 2);
		this.min_date.setDate(this.min_date.getDate() + 1);
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.hService.loadPositions().subscribe({
			next: (data) => {
				this.pageLoading = false;
				if (data.success) {
					this.positions = data.positions;
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

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.start_date = event.value!;
	}

	validate() {
		let wsp = /^\s*$/;
		let d = new Date();
		if (!this.name || !this.sel_pos || !this.duration || !this.start_date) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.name) || this.sel_pos.length === 0 || isNaN(this.duration) || isNaN(this.start_date.getTime())) {
			this.alerts.alert("All fields are required", true);
		}
		else if (this.start_date <= d) {
			this.alerts.alert("Your Start Date must be a date in the future", true);
		}
		else {
			this.createRound();
		}
	}

	private createRound() {
		this.createLoading = true;
		this.hService.startHiringRound(this.name, false, this.sel_pos, this.duration, this.start_date.getTime()).subscribe({
			next: (data) => {
				this.createLoading = false;
				if (data.success) {
					this.alerts.alert("Hiring Round Created Successfully!", false);
					this.router.navigate(['/hiring', 'hiring-rounds']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.createLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
