import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { UserTrainingsService } from '../user-trainings.service';
import { TrainingAsset, TrainingContent, UserTraining } from '../interfaces.service';

@Component({
	selector: 'app-take-training',
	templateUrl: './take-training.component.html',
	styleUrl: './take-training.component.scss'
})
export class TakeTrainingComponent {
	t_id: string;

	pageLoading: boolean = false;
	pageLoaded: boolean = false;
	startLoading: boolean = false;
	nextLoading: boolean = false;
	nextActive: boolean = false;
	prevActive: boolean = false;

	training?: UserTraining;
	isPending: boolean = true;

	training_assets: Array<TrainingAsset> = [];
	activeContent?: TrainingContent;
	content_index: number = 0;


	//previewing assets
	previewing: boolean = false;
	preview_uri: string = "";

	constructor(
		private title: Title,
		private router: Router,
		private tService: UserTrainingsService,
		private alerts: AlertsComponent
	) {
		this.t_id = this.router.parseUrl(this.router.url).root.children['primary'].segments[2].path;
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.tService.loadTraining(this.t_id).subscribe({
			next: (data) => {
				this.pageLoading = false;

				if (data.success) {
					data.training.deadline = new Date(data.training.deadline);
					this.training = data.training;
					this.title.setTitle(`${this.training!.title} | Staff Trainings | SNL Nigeria`);

					this.isPending = data.isPending;

					if (this.isPending && this.training!.progress.started) {
						let content = this.training!.content;

						for (let i = 0; i < content.length; i++) {
							if (content[i].c_id === this.training!.progress.current) {
								this.content_index = i;
							}
						}
					}

					this.activeContent = this.training!.content[this.content_index];
					if (this.training!.content.length > this.content_index + 1) {
						this.nextActive = true;
					}
					if (this.content_index > 0) {
						this.prevActive = true;
					}

					this.training_assets = data.training_assets;
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

	startTraining() {
		if (!this.training!.progress.started) {
			this.startLoading = true;

			this.tService.startTraining(this.t_id).subscribe({
				next: (data) => {
					this.startLoading = false;
					if (data.success) {
						this.training!.progress.started = true;
						this.training!.progress.started_on = new Date();
						this.training!.progress.current = this.training!.content[0].c_id;
						this.content_index = 0;
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.startLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}

	next() {
		if (this.content_index + 1 < this.training!.content.length) {
			this.content_index++;
			this.activeContent = this.training!.content[this.content_index];
			this.updateTrainingProgress();
		}

		if (this.training!.content.length > this.content_index + 1) {
			this.nextActive = true;
		}
		if (this.content_index > 0) {
			this.prevActive = true;
		}
	}

	prev() {
		if (this.content_index > 0) {
			this.content_index--;
			this.activeContent = this.training!.content[this.content_index];
			this.updateTrainingProgress();
		}

		if (this.training!.content.length > this.content_index + 1) {
			this.nextActive = true;
		}
		if (this.content_index > 0) {
			this.prevActive = true;
		}
	}

	updateTrainingProgress() {
		this.nextLoading = false;

		this.tService.updateTrainingProgress(this.t_id, this.training!.content[this.content_index].c_id).subscribe({
			next: (data) => {
				this.nextLoading = false;
				if (data.success) {
					this.training!.progress.current = this.training!.content[this.content_index].c_id;
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.nextLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	previewAsset(index: number){
		let asset = this.training_assets[index];
		if(asset.type === 2){
			this.preview_uri = asset.uri;
			this.previewing = true;
		}
	}

	closePreview(){
		this.preview_uri = "";
		this.previewing = false;
	}

	downloadAsset(uri: string){
		window.open(uri, '_blank');
	}
}
