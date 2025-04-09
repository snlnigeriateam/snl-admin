import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TrainingsService } from '../trainings.service';
import { Role } from '../interfaces.service';

@Component({
	selector: 'app-create-training',
	templateUrl: './create-training.component.html',
	styleUrl: './create-training.component.scss'
})
export class CreateTrainingComponent {
	pageLoading: boolean = false;
	actionLoading: boolean = false;

	deadline: Date = new Date();
	min_date: Date = new Date();
	max_date: Date = new Date();

	title: string = "";
	recurring: boolean = true;
	annual: boolean = true;
	even_years: boolean = false;
	internal: boolean = true;
	tiers: Array<number> = [];
	training_date: number = 0;
	training_month: number = 1;
	deadline_warning: number = 10;
	question_count: number = 30;
	test_duration: number = 30;
	pass_percentage: number = 60;
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
		private router: Router,
		private alerts: AlertsComponent,
		private tService: TrainingsService
	) {
		this.deadline.setMonth(this.deadline.getMonth() + 1);
		this.min_date.setMonth(this.min_date.getMonth() + 1);
		this.max_date.setMonth(11);
		this.max_date.setDate(31);
		this.max_date.setFullYear(this.min_date.getFullYear() + 1);
		this.training_date = this.deadline.getDate();
		this.training_month = this.deadline.getMonth();
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.deadline = event.value!;
		this.training_date = this.deadline.getDate();
		this.training_month = this.deadline.getMonth();
	}

	validate() {
		let wsp = /^\s*$/;

		if (!this.title || wsp.test(this.title) || !this.deadline_warning || isNaN(this.deadline_warning)) {
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
		else if(this.test_duration < 10 || this.test_duration > 180){
			this.alerts.alert("Invalid Test Duration. All tests must take at least 10 minutes and at most 3 hours (180 minutes)", true);
		}
		else if (this.pass_percentage < 50) {
			this.alerts.alert("A passing grade for Tests must be greater than or equal to 50%", true);
		}
		else {
			this.actionLoading = true;

			this.tService.createTraining(this.title, this.recurring, this.annual, this.even_years, this.internal, this.tiers, this.question_count, this.pass_percentage, this.test_duration, this.deadline.getTime(), this.deadline_warning, this.url).subscribe({
				next: (data) => {
					this.actionLoading = false;
					if (data.success) {
						this.alerts.alert("Training Created!", false);
						this.router.navigate(['/trainings', 'manage-training', data.t_id]);
					}
					else if (data.login) {
						this.router.navigate(['/']);
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.actionLoading = false;
					this.alerts.alert("An Error occured. Please Contact Tech Support", true);
				}
			});
		}
	}
}
