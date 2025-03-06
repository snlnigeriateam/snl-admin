import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TrainingsService } from '../trainings.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router } from '@angular/router';
import { QuestionOption, Role, TestQuestion, Training, TrainingAsset, TrainingContent } from '../interfaces.service';
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
	questionActionLoading: boolean = false;
	updateLoading: boolean = false;
	activationLoading: boolean = false;
	editingContent: boolean = false;
	creatingContent: boolean = false;
	editingSettings: boolean = false;
	editingQuestion: boolean = false;
	creatingQuestion: boolean = false;

	t_id: string;

	training?: Training;
	training_assets: Array<TrainingAsset> = [];//all assets for the training
	available_assets: Array<TrainingAsset> = [];//assets in the training not currently available in active content
	questions: Array<TestQuestion> = [];

	selectedContent?: TrainingContent;
	activeContent: string = "";
	activeHeading: string = "";
	// tempAsset: string
	activeAssets: Array<TrainingAsset> = [];//assets available in active content

	//questions
	defaultOptions: Array<QuestionOption> = [
		{
			text: "Option 1",
			index: 0
		},
		{
			text: "Option 2",
			index: 1
		}
	];
	selectedQuestion?: TestQuestion;
	activeQuestion: string = "";
	activeOptions: Array<QuestionOption> = [];
	activeOptionKey: number = 0;

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
	question_count: number = 0;
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
					this.question_count = this.training!.test_question_count;
					this.deadline_warning = this.training!.deadline_warning;
					this.url = this.training!.link;
					this.deadline = this.training!.deadline;
					this.training_date = this.training!.deadline.getDate();
					this.training_month = this.training!.deadline.getMonth();

					this.training_assets = data.training_assets;
					this.available_assets = data.training_assets;

					this.questions = data.questions;
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
			this.editingContent = true;
			this.creatingContent = true;
		}
		else {
			this.editingContent = true;
			this.creatingContent = false;

			this.selectedContent = this.training!.content[index!];
		}
	}

	closeAction() {
		this.activeContent = "";
		this.activeHeading = "";
		this.activeAssets = [];
		this.available_assets = JSON.parse(JSON.stringify(this.training_assets));
		this.editingContent = false;
		this.creatingContent = false;
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

			if (this.creatingContent) {
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

	//questions
	editQuestionAction(create: boolean, index?: number) {
		this.editingQuestion = true;

		if (create) {
			this.creatingQuestion = true;
			this.activeOptions = JSON.parse(JSON.stringify(this.defaultOptions));//necessary to ensure that defaultOptions never changes
		}
		else {
			this.creatingQuestion = false;
			this.selectedQuestion = this.questions[index!];
		}
	}

	closeQuestionAction() {
		this.activeQuestion = "";
		this.activeOptions = [];
		this.editingQuestion = false;
		this.creatingQuestion = false;
		this.selectedQuestion = undefined;
	}

	resetQuestion() {
		this.activeQuestion = "";
		this.activeOptions = JSON.parse(JSON.stringify(this.defaultOptions));
	}

	selectText(index: number) {
		let elem = <HTMLInputElement>document.getElementById(`active_option_input_${index}`);
		// elem.setSelectionRange(0, 999);
		setTimeout(() => {
			elem.select();
		}, 100);
	}

	addOption() {
		this.activeOptions.push({
			text: `Option ${this.activeOptions.length + 1}`,
			index: this.activeOptions.length
		});
	}

	removeOption(index: number) {
		this.activeOptions.splice(index, 1);
	}

	validateQuestion() {
		let wsp = /^\s*$/;

		if (!this.activeQuestion || wsp.test(this.activeQuestion) || this.activeOptions.length < 2) {
			this.alerts.alert("Please provide a Question and at least two options", true);
		}
		else if (!this.validateOptions()) {
			this.alerts.alert("All Options must be filled out", true);
		}
		else {
			if (this.creatingQuestion) {
				this.createQuestion();
			}
			else {
				this.updateQuestion();
			}
		}
	}

	validateOptions() {
		let wsp = /^\s*$/;
		let valid = true;

		for (let i = 0; i < this.activeOptions.length; i++) {
			if (!this.activeOptions[i].text || wsp.test(this.activeOptions[i].text)) {
				valid = false;
			}
		}

		return valid;
	}

	createQuestion() {
		this.questionActionLoading = true;
		let options = [];

		for (let i = 0; i < this.activeOptions.length; i++) {
			options.push(this.activeOptions[i].text);
		}

		this.tService.addTestQuestion(this.t_id, this.activeQuestion, this.activeOptionKey, options).subscribe({
			next: (data) => {
				this.questionActionLoading = false;
				if (data.success) {
					this.alerts.alert("Question Created!", false);
					this.questions.push(data.question);
					this.resetQuestion();
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

	updateQuestion() {
		this.questionActionLoading = true;
		let options = [];

		for (let i = 0; i < this.activeOptions.length; i++) {
			options.push(this.activeOptions[i].text);
		}

		this.tService.updateTestQuestion(this.t_id, this.selectedQuestion!.q_id, this.activeQuestion, this.activeOptionKey, options).subscribe({
			next: (data) => {
				this.questionActionLoading = false;
				if (data.success) {
					this.alerts.alert("Question Updated!", false);

					for (let i = 0; i < this.questions.length; i++) {
						if (this.questions[i].q_id === this.selectedQuestion!.q_id) {
							let question = this.questions[i];

							question.question = this.activeQuestion;
							question.options = this.activeOptions;
							question.answer_index = this.activeOptionKey;
						}
					}

					this.closeQuestionAction();
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

	removeQuestion(index: number) {
		this.alerts.confirm("Do you want to remove this Test Question? This action cannot be undone").then((remove) => {
			if (remove) {
				this.tService.removeTestQuestion(this.questions[index].q_id).subscribe({
					next: (data) => {
						if (data.success) {
							if (index !== -1) {
								this.questions.splice(index, 1);
							}

							this.alerts.alert("Question Removed!", false);
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

	selectQuestion(index: number) {
		let question = this.questions[index];

		this.activeQuestion = question.question;
		this.activeOptionKey = question.answer_index;
		this.activeOptions = JSON.parse(JSON.stringify(question.options));
		this.editQuestionAction(false, index);
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
		else if (this.question_count < 5 || this.question_count > 100) {
			this.alerts.alert("Invalid Test Question Count", true);
		}
		else {
			this.updateLoading = true;

			this.tService.updateTraining(this.t_id, this.training_title, this.recurring, this.annual, this.even_years, this.internal, this.tiers, this.question_count, this.deadline.getTime(), this.deadline_warning, this.url).subscribe({
				next: (data) => {
					this.updateLoading = false;
					if (data.success) {
						this.alerts.alert("Training Updated!", false);
						setTimeout(() => {
							location.reload();
						}, 2000);
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

	activateTraining() {
		if (this.training!.content.length > 0 && this.questions.length >= this.training!.test_question_count) {
			this.alerts.confirm("Would you like to Activate this Training? Please note that future updates to Training Content or Training Settings will be restricted").then((activate) => {
				if (activate) {
					this.activationLoading = true;
					this.tService.activateTraining(this.t_id).subscribe({
						next: (data) => {
							this.activationLoading = false;
							if (data.success) {
								this.training!.active = true;

								this.alerts.alert("Training Activated!", false);
							}
							else if (data.login) {
								this.router.navigate(['/']);
							}
							else {
								this.alerts.alert(data.reason, true);
							}
						},
						error: () => {
							this.activationLoading = false;
							this.alerts.alert("An Error occured. Please Contact Tech Support", true);
						}
					});
				}
			});
		}
	}

	deactivateTraining() {
		this.alerts.confirm("Would you like to Deactivate this Training? Please note that progress on this Training will be lost for all employees taking the Training").then((deactivate) => {
			if (deactivate) {
				this.activationLoading = true;
				this.tService.deactivateTraining(this.t_id).subscribe({
					next: (data) => {
						this.activationLoading = false;
						if (data.success) {
							this.training!.active = false;

							this.alerts.alert("Training Deactivated!", false);
						}
						else if (data.login) {
							this.router.navigate(['/']);
						}
						else {
							this.alerts.alert(data.reason, true);
						}
					},
					error: () => {
						this.activationLoading = false;
						this.alerts.alert("An Error occured. Please Contact Tech Support", true);
					}
				});
			}
		});
	}
}
