import { Component } from '@angular/core';
import { UserTrainingsService } from '../user-trainings.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { UserTraining } from '../interfaces.service';
import { UtilitiesService } from '../utilities.service';

@Component({
	selector: 'app-available-trainings',
	templateUrl: './available-trainings.component.html',
	styleUrl: './available-trainings.component.scss'
})
export class AvailableTrainingsComponent {
	pageLoading: boolean = false;
	pageLoaded: boolean = false;

	pending_trainings: Array<UserTraining> = [];
	completed_trainings: Array<UserTraining> = [];

	constructor(
		private alerts: AlertsComponent,
		private tService: UserTrainingsService,
		public utilities: UtilitiesService
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.tService.loadTrainings().subscribe({
			next: (data) => {
				this.pageLoading = false;

				if (data.success) {
					let pending_trainings = data.pending_trainings;
					let completed_trainings = data.completed_trainings;

					for (let i = 0; i < pending_trainings.length; i++) {
						let p_t = pending_trainings[i];
						p_t.deadline = new Date(p_t.deadline);
						p_t.created_on = new Date(p_t.created_on);
						if (p_t.progress.started) {
							p_t.progress.started_on = new Date(p_t.progress.started_on);
						}
						p_t.progress.score = 0;//doesn't exist on pending trainings. Needs to be dynamically specified to fit interface structure

						for (let j = 0; j < p_t.progress.progress.length; j++) {
							let prog = p_t.progress.progress[j];

							prog.on = new Date(prog.on);
						}

						this.pending_trainings.push(p_t);
					}

					for (let i = 0; i < completed_trainings.length; i++) {
						let c_t = completed_trainings[i];
						c_t.deadline = new Date(c_t.deadline);
						c_t.created_on = new Date(c_t.created_on);
						c_t.progress.started_on = new Date(c_t.progress.started_on);
						c_t.progress.completed_on = new Date(c_t.progress.completed_on);

						for (let j = 0; j < c_t.progress.progress.length; j++) {
							let prog = c_t.progress.progress[j];

							prog.on = new Date(prog.on);
						}

						this.completed_trainings.push(c_t);
					}

					this.pageLoaded = true;
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
