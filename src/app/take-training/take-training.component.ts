import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { UserTrainingsService } from '../user-trainings.service';
import { TrainingActivity, TrainingAsset, TrainingContent, UserTestQuestion, UserTraining } from '../interfaces.service';

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
	testTimeElapsed: boolean = false;
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
	test_duration: number = 0;
	elapsed_duration: number = 0;
	test_time: string = "";
	elapsed_time: string = "00:00";
	prevQuestionActive: boolean = false;
	nextQuestionActive: boolean = false;

	timer?: NodeJS.Timeout;
	time_colour: string = "";

	//external trainings
	previous_progress: Array<TrainingActivity> = [];
	url: string = "";
	notes: string = "";
	updateLoading: boolean = false;

	constructor(
		private title: Title,
		private router: Router,
		private tService: UserTrainingsService,
		private alerts: AlertsComponent
	) {
		this.t_id = this.router.parseUrl(this.router.url).root.children['primary'].segments[2].path;
		this.load();
	}

	ngOnDestroy() {
		if (this.timer != null) {
			clearInterval(this.timer);
		}
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
		if (this.training!.internal) {
		this.nextLoading = true;
			this.tService.updateTrainingProgress(this.t_id, this.training!.content[this.content_index].c_id, "", "").subscribe({
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
		else {
			if (!this.url || this.url.trim().length === 0) {
				this.alerts.alert("Please provide the URL you're about to visit", true);
			}
			else {
				this.updateLoading = true;
				this.tService.updateTrainingProgress(this.t_id, "", this.url, this.notes).subscribe({
					next: (data) => {
						this.updateLoading = false;
						if (data.success) {
							this.url = "";
							this.notes = "";
							this.training!.progress.activity.push(data.progress);
							this.alerts.alert("Progress Logged!", false);
						}
						else {
							this.alerts.alert(data.reason, true);
						}
					},
					error: () => {
						this.updateLoading = false;
						this.alerts.alert("Please check your connection", true);
					}
				});
			}
		}
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
					this.test_duration = data.test_duration * 60;
					let timing = this.computeTime(this.test_duration);

					this.test_time = timing.time_string;
					if (timing.hours > 0) {
						this.elapsed_time = "00:00:00";
					}
					this.nextQuestionActive = true;

					this.testLoaded = true;

					// this.timer = setInterval(this.clockTick, 1000);
					this.timer = setInterval(() => {
						this.elapsed_duration++;
						if (this.elapsed_duration >= this.test_duration / 2) {
							this.time_colour = "warn";
						}

						if (this.elapsed_duration >= this.test_duration - 120) {
							this.time_colour = "danger";
						}

						if (this.elapsed_duration >= this.test_duration - 60) {
							this.time_colour = "danger flash";
						}

						let timing = this.computeTime(this.elapsed_duration);

						this.elapsed_time = timing.time_string;

						if (this.elapsed_duration === this.test_duration) {
							this.testTimeElapsed = true;
							clearInterval(this.timer);
						}
					}, 1000);
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
		this.scoring = true;
		let right_responses: Array<string> = [];
		let wrong_responses: Array<string> = [];
		let score = 0;
		let total = this.questions.length;

		for (let i = 0; i < this.questions.length; i++) {
			let question = this.questions[i];

			if (question.selected_index != null) {
				if (question.selected_index! == question.answer_index) {
					right_responses.push(question.q_id);
					score++;
				}
				else {
					wrong_responses.push(question.q_id);
				}
			}
		}

		this.percentage_score = (score / total) * 100;

		return {
			right_responses: right_responses,
			wrong_responses: wrong_responses,
			percentage_score: this.percentage_score
		}
	}

	completeTest(skipCurrent: boolean) {
		let question = this.questions[this.question_index];

		if (question.selected_index != null || skipCurrent) {
			let results = this.scoreTest();

			if (this.percentage_score >= this.pass_percentage) {
				this.tService.endTest(this.t_id, results.right_responses, results.wrong_responses).subscribe({
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
				this.resetTrainingProgress(results.right_responses, results.wrong_responses);
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

	computeTime(time_in_seconds: number) {
		let hours = 0;
		let minutes = 0;
		let seconds = 0;

		hours = Math.floor(time_in_seconds / 3600);
		if (hours > 0) {
			let remainder_in_seconds = time_in_seconds % 3600;
			minutes = Math.floor(remainder_in_seconds / 60);

			if (minutes > 0) {
				seconds = remainder_in_seconds % 60;
			}
			else {
				seconds = remainder_in_seconds;
			}
		}
		else {
			minutes = Math.floor(time_in_seconds / 60);

			if (minutes > 0) {
				seconds = time_in_seconds % 60;
			}
			else {
				seconds = time_in_seconds;
			}
		}

		let hh = hours.toString();
		let mm = minutes.toString();
		let ss = seconds.toString();
		let time_string = "";

		if (hours !== 0) {
			if (hh.length === 1) {
				hh = `0${hh}`;
			}
			if (mm.length === 1) {
				mm = `0${mm}`;
			}
			if (ss.length === 1) {
				ss = `0${ss}`;
			}

			time_string = `${hh}:${mm}:${ss}`;
		}
		else {
			if (mm.length === 1) {
				mm = `0${mm}`;
			}
			if (ss.length === 1) {
				ss = `0${ss}`;
			}

			time_string = `${mm}:${ss}`;
		}

		return { hours: hours, minutes: minutes, seconds: seconds, time_string: time_string };
	}

	retakeTraining() {
		let results = this.scoreTest();
		this.resetTrainingProgress(results.right_responses, results.wrong_responses);

		this.alerts.confirm(`You scored ${this.percentage_score.toFixed(2)}% on this test. You may retake the Training and return to this test later. Would you like to begin now?`).then((retake) => {
			if (retake) {
				this.alerts.alert("Saving Progress...", false);

				setTimeout(() => {
					location.reload();
				}, 1500);
			}
		});
	}

	// clockTick(){
	// 	this.elapsed_duration++;

	// 	let timing = this.computeTime(this.elapsed_duration);

	// 	this.elapsed_time = timing.time_string;
	// }
}
