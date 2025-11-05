import { Component } from '@angular/core';
import { Training } from '../interfaces';
import { Alerts } from '../alerts/alerts';
import { Trainings } from '../trainings';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Loading } from '../loading/loading';

@Component({
	selector: 'app-manage-trainings',
	imports: [MatIconModule, RouterLink, Loading],
	templateUrl: './manage-trainings.html',
	styleUrl: './manage-trainings.scss',
})
export class ManageTrainings {
	pageLoading: boolean = false;
	trainings: Array<Training> = [];

	constructor(
		private tService: Trainings,
		private alerts: Alerts
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.tService.loadTrainings().subscribe({
			next: (data) => {
				this.pageLoading = false;

				if (data.success) {
					for (let i = 0; i < data.trainings.length; i++) {
						let c_training = data.trainings[i];

						this.trainings.push(c_training);
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
