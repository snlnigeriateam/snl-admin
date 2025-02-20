import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TrainingsService } from '../trainings.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router } from '@angular/router';
import { Role, Training, TrainingAsset, TrainingContent } from '../interfaces.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
	selector: 'app-manage-training',
	templateUrl: './manage-training.component.html',
	styleUrl: './manage-training.component.scss'
})

export class ManageTrainingComponent {
	pageLoading: boolean = false;
	pageLoaded: boolean = false;
	saveLoading: boolean = false;
	updateLoading: boolean = false;
	editing: boolean = false;
	creating: boolean = false;
	editingSettings: boolean = false;

	t_id: string;

	training?: Training;
	training_assets: Array<TrainingAsset> = [];//all assets for the training
	available_assets: Array<TrainingAsset> = [];//assets in the training not currently available in active content

	selectedContent?: TrainingContent;
	activeContent: string = "";
	activeHeading: string = "";
	// tempAsset: string
	activeAssets: Array<TrainingAsset> = [];//assets available in active content

	//assets
	selectingFile: boolean = false;

	fileSelected: boolean = false;
	fileName: string = "No File Selected";
	file?: File;
	label: string = "";
	uploadLoading: boolean = false;

	//training_settings
	deadline: Date = new Date();
	min_date: Date = new Date();
	max_date: Date = new Date();

	training_title: string = "";
	recurring: boolean = true;
	annual: boolean = true;
	even_years: boolean = false;
	internal: boolean = true;
	tiers: Array<number> = [];
	training_date: number = 0;
	training_month: number = 1;
	deadline_warning: number = 10;
	url: string = "";

	roles: Array<Role> = [
		{
			name: 'Executive',
			tier: 1
		},
		{
			name: 'Director',
			tier: 2
		},
		{
			name: 'Manager',
			tier: 3
		},
		{
			name: 'Senior Staff',
			tier: 4
		},
		{
			name: 'Junior Staff',
			tier: 5
		},
		{
			name: 'Support Staff',
			tier: 6
		}
	];

	months: Array<string> = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	constructor(
		private title: Title,
		private router: Router,
		private tService: TrainingsService,
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
					this.title.setTitle(`${this.training!.title} | Training Management | SNL Nigeria`);
					this.pageLoaded = true;

					this.training_title = this.training!.title;
					this.recurring = this.training!.recurring;
					this.annual = this.training!.annual;
					this.even_years = this.training!.even_years;
					this.internal = this.training!.internal;
					this.tiers = this.training!.tiers;
					this.deadline_warning = this.training!.deadline_warning;
					this.url = this.training!.link;
					this.deadline = this.training!.deadline;
					this.training_date = this.training!.deadline.getDate();
					this.training_month = this.training!.deadline.getMonth();

					this.training_assets = data.training_assets;
					this.available_assets = data.training_assets;
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

	editAction(create: boolean, c_id?: string, index?: number) {
		if (create) {
			this.editing = true;
			this.creating = true;
		}
		else {
			this.editing = true;
			this.creating = false;

			this.selectedContent = this.training!.content[index!];
		}
	}

	closeAction() {
		this.activeContent = "";
		this.activeHeading = "";
		this.activeAssets = [];
		this.available_assets = this.training_assets;
		this.editing = false;
		this.creating = false;
		this.selectedContent = undefined;
	}

	selectFile() {
		document.getElementById('file-input')?.click();
	}

	validateFile(ev: any) {
		if (ev.target) {
			let fList: FileList = ev.target.files;
			if (fList.length > 0) {
				let size = fList[0].size;
				if (size > 20971520) {
					this.alerts.alert("Your file must be less than 20MB in size", true);
				}
				else {
					this.fileSelected = true;
					this.fileName = fList[0].name;
					this.file = fList[0];
				}
			}
			else {
				this.fileSelected = false;
				this.fileName = "No File Selected";
			}
		}
		else {
			this.fileSelected = false;
			this.fileName = "No File Selected";
		}
	}

	uploadAsset() {
		let wsp = /^\s*$/;

		if (!this.label || wsp.test(this.label)) {
			this.alerts.alert("Please provide a Label for this Asset", true);
		}
		else if (!this.fileSelected) {
			this.alerts.alert("No File Selected", true);
		}
		else {
			this.uploadLoading = true;

			let fData = new FormData();

			fData.append("t_id", this.t_id);
			fData.append("label", this.label);
			fData.append("asset", this.file!);

			this.tService.uploadAsset(fData).subscribe({
				next: (data) => {
					this.uploadLoading = false;
					if (data.success) {
						this.fileSelected = false;
						this.fileName = "No File Selected";
						this.label = "";
						this.training_assets.push(data.asset);
						this.selectingFile = false;
						this.alerts.alert("Asset Uploaded", false);
					}
					else if (data.login) {
						this.router.navigate(['/']);
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.uploadLoading = false;
					this.alerts.alert("An Error occured. Please Contact Tech Support", true);
				}
			});
		}
	}

	addAsset(a_id: string) {
		let a_index = -1;

		for (let i = 0; i < this.available_assets.length; i++) {
			if (this.available_assets[i].a_id === a_id) {
				a_index = i;
				break;
			}
		}

		if (a_index !== -1) {
			this.activeAssets.push(this.available_assets[a_index]);
			this.available_assets.splice(a_index, 1);
		}
	}

	selectContent(c_id: string) {
		let index = -1;

		for (let i = 0; i < this.training!.content.length; i++) {
			if (this.training!.content[i].c_id === c_id) {
				index = i;
				break;
			}
		}

		if (index === -1) {
			this.alerts.alert("Invalid Content Selected", true);
		}
		else {
			let content = this.training!.content[index];

			this.activeContent = content.content;
			this.activeHeading = content.heading;
			this.activeAssets = content.assets;
			this.editAction(false, c_id, index);
			this.available_assets = [];

			for (let i = 0; i < this.training_assets.length; i++) {
				let found = false;
				let t_asset = this.training_assets[i];
				for (let j = 0; j < this.activeAssets.length; j++) {
					let a_asset = this.activeAssets[j];

					if (a_asset.a_id === t_asset.a_id) {
						found = true;
					}
				}

				if (!found) {
					this.available_assets.push(t_asset);
				}
			}
		}
	}

	validate() {
		let wsp = /^\s*$/;

		if ((!this.activeContent || wsp.test(this.activeContent)) && this.activeAssets.length === 0) {
			this.alerts.alert("No Training Content Provided", true);
		}
		else if ((!this.activeContent || wsp.test(this.activeContent)) && this.activeAssets.length > 0) {
			this.alerts.alert(`No Training Content Provided. Please include instructions for the asset${this.activeAssets.length === 1 ? '' : 's'} provided`, true);
		}
		else {
			this.saveLoading = true;

			if (this.creating) {
				this.saveContent();
			}
			else {
				this.updateContent();
			}
		}
	}

	saveContent() {
		this.saveLoading = true;

		this.tService.addTrainingContent(this.t_id, this.activeContent, this.activeHeading, this.activeAssets).subscribe({
			next: (data) => {
				this.saveLoading = false;
				if (data.success) {
					this.alerts.alert("Training Content Updated!", false);
					this.training!.content.push(data.content);
					this.closeAction();
				}
				else if (data.login) {
					this.router.navigate(['/']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.saveLoading = false;
				this.alerts.alert("An Error occured. Please Contact Tech Support", true);
			}
		});
	}

	updateContent() {
		this.saveLoading = true;

		this.tService.updateTrainingContent(this.t_id, this.selectedContent!.c_id, this.activeContent, this.activeHeading, this.activeAssets).subscribe({
			next: (data) => {
				this.saveLoading = false;
				if (data.success) {
					this.alerts.alert("Training Content Updated!", false);
					let index = -1;

					for (let i = 0; i < this.training!.content.length; i++) {
						if (this.training!.content[i].c_id === this.selectedContent!.c_id) {
							index = i;
						}
					}

					if (index !== -1) {
						this.training!.content[index] = data.content;
					}

					this.closeAction();
				}
				else if (data.login) {
					this.router.navigate(['/']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.saveLoading = false;
				this.alerts.alert("An Error occured. Please Contact Tech Support", true);
			}
		});
	}

	removeContent(c_id: string) {
		this.alerts.confirm("Do you want to remove this Training Content? This action cannot be undone").then((remove) => {
			if (remove) {
				this.tService.removeTrainingContent(this.t_id, c_id).subscribe({
					next: (data) => {
						if (data.success) {
							let index = -1;

							for (let i = 0; i < this.training!.content.length; i++) {
								if (this.training!.content[i].c_id === c_id) {
									index = i;
								}
							}

							if (index !== -1) {
								this.training!.content.splice(index, 1);
							}

							this.alerts.alert("Training Updated!", false);
						}
						else if (data.login) {
							this.router.navigate(['/']);
						}
						else {
							this.alerts.alert(data.reason, true);
						}
					},
					error: () => {
						this.alerts.alert("An Error occured. Please Contact Tech Support", true);
					}
				});
			}
		});
	}

	//training settings
	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.deadline = event.value!;
		this.training_date = this.deadline.getDate();
		this.training_month = this.deadline.getMonth();
	}

	validateSettings() {
		let wsp = /^\s*$/;

		if (!this.title || wsp.test(this.training_title) || !this.deadline_warning || isNaN(this.deadline_warning)) {
			this.alerts.alert("All fields are required", true);
		}
		else if (!this.internal && (!this.url || wsp.test(this.url))) {
			this.alerts.alert("All fields are required", true);
		}
		else if (this.deadline_warning < 5 || this.deadline_warning > 90) {
			this.alerts.alert("Invalid Deadline Warning", true);
		}
		else {
			this.updateLoading = true;

			this.tService.updateTraining(this.training_title, this.recurring, this.annual, this.even_years, this.internal, this.tiers, this.deadline.getTime(), this.deadline_warning, this.url).subscribe({
				next: (data) => {
					this.updateLoading = false;
					if (data.success) {
						this.alerts.alert("Training Updated!", false);
					}
					else if (data.login) {
						this.router.navigate(['/']);
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.updateLoading = false;
					this.alerts.alert("An Error occured. Please Contact Tech Support", true);
				}
			});
		}
	}
}
