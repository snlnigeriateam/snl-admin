import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { UserTrainingsService } from '../user-trainings.service';
import { TrainingAsset, TrainingContent, UserTestQuestion, UserTraining } from '../interfaces.service';

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
	testLoading: boolean = false;
	testLoaded: boolean = false;
	testInProgress: boolean = false;
	submitLoading: boolean = false;
	scoring: boolean = false;
	scoringCompleted: boolean = false;

	training?: UserTraining;
	isPending: boolean = true;

	training_assets: Array<TrainingAsset> = [];
	activeContent?: TrainingContent;
	content_index: number = 0;


	//previewing assets
	previewing: boolean = false;
	preview_uri: string = "";

	//tests
	questions: Array<UserTestQuestion> = [];
	score: number = 0;
	percentage_score: number = 0;
	pass_percentage: number = 0.0;
	question_index: number = 0;
	prevQuestionActive: boolean = false;
	nextQuestionActive: boolean = false;

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
					else {
						this.nextActive = false;
					}
					if (this.content_index > 0) {
						this.prevActive = true;
					}
					else {
						this.prevActive = false;
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
		else {
			this.nextActive = false;
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
		else {
			this.prevActive = false;
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

	previewAsset(index: number) {
		let asset = this.training_assets[index];
		if (asset.type === 2) {
			this.preview_uri = asset.uri;
			this.previewing = true;
		}
	}

	closePreview() {
		this.preview_uri = "";
		this.previewing = false;
	}

	downloadAsset(uri: string) {
		window.open(uri, '_blank');
	}

	startTest() {
		this.testLoading = true;
		this.testInProgress = true;

		this.tService.startTest(this.t_id).subscribe({
			next: (data) => {
				this.testLoading = false;
				if (data.success) {
					let questions = data.questions;
					for (let i = 0; i < questions.length; i++) {
						let question = questions[i];
						question.selected_index = null;
						this.questions.push(question);
					}

					this.pass_percentage = data.pass_percentage;
					this.nextQuestionActive = true;

					this.testLoaded = true;
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.testLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	nextQuestion() {
		let question = this.questions[this.question_index];

		if (question.selected_index != null) {
			if (this.question_index + 1 < this.questions.length) {
				this.question_index++;
			}

			if (this.questions.length > this.question_index + 1) {
				this.nextQuestionActive = true;
			}
			else {
				this.nextQuestionActive = false;
			}
			if (this.question_index > 0) {
				this.prevQuestionActive = true;
			}
		}
		else {
			this.alerts.alert("Please provide a response before proceeding", true);
		}
	}

	prevQuestion() {
		if (this.question_index > 0) {
			this.question_index--;
		}

		if (this.questions.length > this.question_index + 1) {
			this.nextQuestionActive = true;
		}
		if (this.question_index > 0) {
			this.prevQuestionActive = true;
		}
		else {
			this.prevQuestionActive = false;
		}
	}

	scoreTest() {
		let question = this.questions[this.question_index];

		if (question.selected_index != null) {
			this.scoring = true;
			let right_responses: Array<string> = [];
			let wrong_responses: Array<string> = [];
			let score = 0;
			let total = this.questions.length;

			for (let i = 0; i < this.questions.length; i++) {
				let question = this.questions[i];

				if (question.selected_index! == question.answer_index) {
					right_responses.push(question.q_id);
					score++;
				}
				else {
					wrong_responses.push(question.q_id);
				}
			}

			this.percentage_score = (score / total) * 100;

			if (this.percentage_score >= this.pass_percentage) {
				this.tService.endTest(this.t_id, right_responses, wrong_responses).subscribe({
					next: (data) => {
						this.scoring = false;
						if (data.success) {
							this.scoringCompleted = true;
						}
						else {
							this.alerts.alert(data.reason, true);
						}
					},
					error: () => {
						this.testLoading = false;
						this.alerts.alert("Please check your connection", true);
					}
				});
			}
			else {
				this.resetTrainingProgress(right_responses, wrong_responses);
				this.alerts.confirm(`You scored ${this.percentage_score.toFixed(2)}% on this test, less than the ${this.pass_percentage}% required for a passing grade. You may retake the Training and return to this test later. Would you like to begin now?`).then((retake) => {
					if (retake) {
						this.alerts.alert("Saving Progress...", false);

						setTimeout(() => {
							location.reload();
						}, 1500);
					}
				});
			}
		}
		else {
			this.alerts.alert("Please provide a response", true);
		}
	}

	resetTrainingProgress(right_responses: Array<string>, wrong_responses: Array<string>) {
		this.tService.resetTrainingProgress(this.t_id, right_responses, wrong_responses).subscribe({
			next: (data) => {
				if (!data.success) {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
