import { Component } from '@angular/core';
import { Position } from '../interfaces';
import { Alerts } from '../alerts/alerts';
import { Hiring } from '../hiring';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Loading } from '../loading/loading';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-positions',
	imports: [MatIconModule, RouterLink, Loading, MatButtonModule],
	templateUrl: './positions.html',
	styleUrl: './positions.scss',
})
export class Positions {
	pageLoading: boolean = false;
	positions: Array<Position> = [];

	constructor(
		private alerts: Alerts,
		private hService: Hiring
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.hService.loadPositions().subscribe({
			next: (data) => {
				this.pageLoading = false;

				if (data.success) {
					for (let i = 0; i < data.positions.length; i++) {
						let c_pos = data.positions[i];

						this.positions.push(c_pos);
					}
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
}
