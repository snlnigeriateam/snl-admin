import { Component } from '@angular/core';
import { AlertsComponent } from '../alerts/alerts.component';
import { HiringService } from '../hiring.service';
import { UtilitiesService } from '../utilities.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

interface Application {
	a_id: string,
	f_name: string,
	l_name: string,
	o_name: string,
	applied_on: Date,
	email: string,
	address: string,
	p_id: string,
	phone: string,
	r_id: string,
	ref_id: string,
	uri: string,
	invited: boolean,
	rejected: boolean
}

@Component({
	selector: 'app-applications',
	templateUrl: './applications.component.html',
	styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
	r_id: string;

	pageLoading: boolean = false;
	loaded: boolean = false;
	updateLoading: boolean = false;

	viewing: boolean = false;
	editing: boolean = false;
	inviting: boolean = false;

	round_name: string = '';
	applications: Array<Application> = [];
	selApp!: Application;

	//invites
	date: string = "";
	time: string = "";
	platform: string = "";
	link: string = "";

	//rejections
	reason: string = "";

	constructor(
		private alerts: AlertsComponent,
		private hService: HiringService,
		public utilities: UtilitiesService,
		private clipboard: Clipboard,
		private router: Router,
		private title: Title
	) {
		this.r_id = this.router.parseUrl(this.router.url).root.children['primary'].segments[2].path;
		this.load();
	}

	nav(index: number) {
		this.selApp = this.applications[index];
		this.viewing = true;
	}

	load() {
		this.pageLoading = true;
		this.hService.loadApplications(this.r_id).subscribe({
			next: (data) => {
				if (data.success) {
					let applications = data.applications;
					this.round_name = data.round_name;
					this.title.setTitle(`${this.round_name} - Applications | SNL Nigeria Insiders`)
					let positions = data.positions;

					for (let i = 0; i < applications.length; i++) {
						let c_app = applications[i];
						c_app.applied_on = new Date(c_app.applied_on);

						for (let j = 0; j < positions.length; j++) {
							if (positions[j].p_id === c_app.p_id) {
								c_app.p_id = positions[j].name;//changes to this must be reflected in the rejection method which depends on the position name being p_id
							}
						}
					}
					this.applications = applications;

					this.title.setTitle(`${this.round_name} - Hiring | SNL Nigeria Insiders`);
					this.pageLoading = false;
					this.loaded = true;
				}
				else {
					this.pageLoading = false;
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	copyAdd() {
		let copied = this.clipboard.copy(this.selApp!.email);
		if (copied) {
			this.alerts.alert("Email Address Copied to Clipboard", false);
		}
	}

	copyPhone() {
		let copied = this.clipboard.copy(this.selApp!.phone);
		if (copied) {
			this.alerts.alert("Phone Number Copied to Clipboard", false);
		}
	}

	download() {
		window.open(this.selApp!.uri, '_blank');
	}

	stopEditing() {
		this.editing = false;
	}

	invite() {
		this.editing = true;
		this.inviting = true;
	}

	reject() {
		this.editing = true;
		this.inviting = false;
	}

	validateInvite() {
		this.alerts.confirm("Please confirm that you would like to send an Invite Email to this Candidate").then((yes) => {
			if (yes) {
				let wsp = /^\s*$/;

				if (!this.date || !this.time || !this.platform || !this.link) {
					this.alerts.alert("All fields are required", true);
				}
				else if (wsp.test(this.date) || wsp.test(this.time) || wsp.test(this.platform) || wsp.test(this.link)) {
					this.alerts.alert("All fields are required", true);
				}
				else {
					this.updateLoading = true;

					this.hService.inviteToInterview(this.selApp!.a_id, this.date, this.time, this.platform, this.link).subscribe({
						next: (data) => {
							this.updateLoading = false;
							if (data.success) {
								this.selApp.invited = true;
								this.alerts.alert("Invite Email sent successfully", false);
								this.editing = false;
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
		});
	}

	validateRejection() {
		this.alerts.confirm("This Action cannot be undone. Do you want to send a Rejection Email to this Applicant?").then((yes) => {
			if (yes) {
				let wsp = /^\s*$/;

				if (!this.reason || wsp.test(this.reason)) {
					this.alerts.alert("Please provide a reason for the rejection", true);
				}
				else {
					this.updateLoading = true;

					this.hService.rejectApplicant(this.selApp!.a_id, this.selApp!.p_id, this.reason).subscribe({
						next: (data) => {
							this.updateLoading = false;
							if (data.success) {
								this.selApp.rejected = true;
								this.alerts.alert("Rejection Email sent", false);
								this.editing = false;
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
		});
	}
}
