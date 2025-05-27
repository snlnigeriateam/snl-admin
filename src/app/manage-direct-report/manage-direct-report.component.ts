import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { StaffService } from '../staff.service';
import { Position, Property, Role, Training, User, UserTraining } from '../interfaces.service';
import { TrainingsService } from '../trainings.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface UserTrail {
	action: string,
	on: string,
	reason: string,
	by: string
}

interface DirectReport extends User {
	trail: Array<UserTrail>,
	pendingTrainings: Array<UserTraining>,
	completedTrainings: Array<UserTraining>,
}

interface Person {
	f_name: Property;
	l_name: Property;
	username: Property;
	email: Property;
	phone: Property;
	p_email: Property;
	c_email: Property;
	uri: Property;
	tier: Property;
	p_id: Property;
	active: boolean;
	revoked: boolean;
	suspension_deadline: Date | null;
}

@Component({
	selector: 'app-manage-direct-report',
	templateUrl: './manage-direct-report.component.html',
	styleUrl: './manage-direct-report.component.scss'
})
export class ManageDirectReportComponent {
	pageLoading: boolean = false;
	pendingTrainingsLoading: boolean = false;
	completedTrainingsLoading: boolean = false;
	pendingTrainingsLoaded: boolean = false;
	completedTrainingsLoaded: boolean = false;
	loaded: boolean = false;
	saveLoading: boolean = false;
	availableTrainingsLoading: boolean = false;
	availableTrainingsLoaded: boolean = false;
	availableTrainings: Array<Training> = [];

	r_id: string;
	user?: DirectReport;
	person?: Person;
	suspending: boolean = false;
	revoking: boolean = false;
	reinstating: boolean = false;
	suspendActionLoading: boolean = false;
	reason: string = "";
	authCode: string = "";
	suspensionDeadline: Date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
	min_date: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3);
	max_date: Date = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate());

	selectedTrainingCategory: string = "";
	trainingCategories: Array<{ name: string, value: string }> = [
		{ name: "Pending Trainings", value: "pending" },
		{ name: "Completed Trainings", value: "completed" }
	];
	positions: Array<Position> = [];
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

	constructor(
		private alerts: AlertsComponent,
		private sService: StaffService,
		private tService: TrainingsService,
		private router: Router,
	) {
		this.r_id = this.router.parseUrl(this.router.url).root.children['primary'].segments[2].path;
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.sService.loadDirectReport(this.r_id).subscribe({
			next: (data) => {
				this.pageLoading = false;
				if (data.success) {
					let user = data.report;
					user.pendingTrainings = [];
					user.completedTrainings = [];
					this.user = user;
					this.person = {
						f_name: {
							prop: this.user!.f_name,
							editable: false,
						},
						l_name: {
							prop: this.user!.l_name,
							editable: false,
						},
						username: {
							prop: this.user!.a_id,
							editable: true,
						},
						email: {
							prop: this.user!.email,
							editable: false,
						},
						p_email: {
							prop: '',
							editable: false, // Placeholder for personal email
							// This could be set to user.p_email if available
							// but currently not used in the interface and not provided by the backend
							// also, this property is not meant to be visible to the supervisor. Communication should be through the specified email (email)
							// which may be either the official email or the personal email based on the user's preference
						},
						c_email: {
							prop: this.user!.c_email,
							editable: true,
						},
						phone: {
							prop: this.user!.phone,
							editable: false,
						},
						p_id: {
							prop: this.user!.p_id,
							editable: true,
						},
						tier: {
							prop: this.user!.tier,
							editable: false,
						},
						uri: {
							prop: this.user!.uri,
							editable: false,
						},
						active: this.user!.active,
						revoked: this.user!.revoked,
						suspension_deadline: this.user!.suspension_deadline ? new Date(this.user!.suspension_deadline) : null,
					}
					this.positions = data.positions;

					this.loaded = true;
				} else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	loadPendingTrainings() {
		this.pendingTrainingsLoading = true;
		this.sService.loadTrainingsData(this.r_id, "pending").subscribe({
			next: (data) => {
				this.pendingTrainingsLoading = false;
				if (data.success) {
					let trainings = data.trainings;
					this.user!.pendingTrainings = trainings;
					this.pendingTrainingsLoaded = true;
				} else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pendingTrainingsLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	loadCompletedTrainings() {
		this.completedTrainingsLoading = true;
		this.sService.loadTrainingsData(this.r_id, "completed").subscribe({
			next: (data) => {
				this.completedTrainingsLoading = false;
				if (data.success) {
					let trainings = data.trainings;
					this.user!.completedTrainings = trainings;
					this.completedTrainingsLoaded = true;
				} else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.completedTrainingsLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	onTrainingCategoryChange(event: any) {
		this.selectedTrainingCategory = event.value;
		if (this.selectedTrainingCategory === "pending") {
			if (!this.pendingTrainingsLoaded && !this.pendingTrainingsLoading) {
				this.loadPendingTrainings();
			}
		} else if (this.selectedTrainingCategory === "completed") {
			if (!this.completedTrainingsLoaded && !this.completedTrainingsLoading) {
				this.loadCompletedTrainings();
			}
		}
	}

	validate() {
		let wsp = /^\s*$/;
		if (!this.person!.username.prop || !this.person!.c_email.prop || !this.person!.p_id.prop) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.person!.username.prop) || wsp.test(this.person!.c_email.prop) || wsp.test(this.person!.p_id.prop)) {
			this.alerts.alert("All fields are required", true);
		}
		else {
			this.saveLoading = true;
			this.sService.updateAdministrator(this.r_id, this.person!.username.prop, this.person!.c_email.prop, this.person!.p_id.prop, this.person!.tier.prop).subscribe({
				next: (data) => {
					this.saveLoading = false;
					if (data.success) {
						this.alerts.alert("User Account Updated", false);
						setTimeout(() => {
							location.reload();
						}, 1000);
					} else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.saveLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}

	loadAvailableTrainings() {
		this.availableTrainingsLoading = true;
		this.sService.loadAvailableTrainings(this.r_id).subscribe({
			next: (data) => {
				this.availableTrainingsLoading = false;
				if (data.success) {
					this.availableTrainings = data.trainings;
					this.availableTrainingsLoaded = true;
				} else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.availableTrainingsLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	assignTraining(t_id: string) {
		this.availableTrainingsLoading = true;
		this.tService.assignTrainingInstantly(t_id, this.r_id, false, false, 0, '', []).subscribe({
			next: (data) => {
				this.availableTrainingsLoading = false;
				if (data.success) {
					this.alerts.alert("Training Assigned", false);
					setTimeout(() => {
						location.reload();
					}, 1000);
				} else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.availableTrainingsLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	initialiseSuspend() {
		this.suspending = true;
		this.reinstating = false;
		this.revoking = false;
		this.reason = "";
	}

	initialiseRevoke() {
		this.revoking = true;
		this.reinstating = false;
		this.suspending = false;
		this.reason = "";
	}

	initialiseUnsuspend() {
		this.reinstating = true;
		this.revoking = false;
		this.suspending = false;
		this.reason = "";
	}

	cancelSuspendAction() {
		this.suspending = false;
		this.revoking = false;
		this.reinstating = false;
		this.reason = "";
	}

	setSuspensionDeadline(type: string, event: MatDatepickerInputEvent<Date>) {
		this.suspensionDeadline = event.value!;
	}

	suspend() {
		if (!this.reason || this.reason.trim() === "") {
			this.alerts.alert("Reason is required", true);
		}
		else if (this.suspensionDeadline.getTime() < new Date().getTime()) {
			this.alerts.alert("Suspension deadline must be in the future", true);
		}
		else {
			this.suspendActionLoading = true;
			this.sService.suspendAdministrator(this.r_id, this.reason, this.suspensionDeadline.getTime()).subscribe({
				next: (data) => {
					this.suspendActionLoading = false;
					if (data.success) {
						this.alerts.alert("User Suspended", false);
						setTimeout(() => {
							location.reload();
						}, 1000);
					} else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.suspendActionLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}

	reinstate() {
		if (!this.reason || this.reason.trim() === "") {
			this.alerts.alert("Reason is required", true);
		}
		else if (!this.authCode || this.authCode.trim() === "") {
			this.alerts.alert("Authentication Code is required", true);
		}
		else if (this.authCode.length < 6) {
			this.alerts.alert("Authentication Code must be at least 6 characters", true);
		}
		else {
			this.suspendActionLoading = true;
			this.sService.reinstateAdministrator(this.r_id, this.reason, this.authCode).subscribe({
				next: (data) => {
					this.suspendActionLoading = false;
					if (data.success) {
						this.alerts.alert("User Unsuspended", false);
						setTimeout(() => {
							location.reload();
						}, 1000);
					} else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.suspendActionLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}

	revoke() {
		if (!this.reason || this.reason.trim() === "") {
			this.alerts.alert("Reason is required", true);
		}
		else if (!this.authCode || this.authCode.trim() === "") {
			this.alerts.alert("Authentication Code is required", true);
		}
		else if (this.authCode.length < 6) {
			this.alerts.alert("Authentication Code must be at least 6 characters", true);
		}
		else {
			this.suspendActionLoading = true;
			this.sService.revokeAdministrator(this.r_id, this.reason, this.authCode).subscribe({
				next: (data) => {
					this.suspendActionLoading = false;
					if (data.success) {
						this.alerts.alert("User Revoked", false);
						setTimeout(() => {
							location.reload();
						}, 1000);
					} else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.suspendActionLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}
}
