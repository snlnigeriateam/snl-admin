import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { SettingsService } from '../settings.service';

interface Property {
	prop: string;
	editable: boolean;
}

interface Person {
	f_name: Property;
	l_name: Property;
	username: Property;
	email: Property;
	phone: Property;
	p_email: Property;
	c_email: Property;
	role: Property;
	uri: Property;
}

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss'
})

export class SettingsComponent {
	pageLoading: boolean = false;
	pageLoaded: boolean = false;
	uploadLoading: boolean = false;
	updateLoading: boolean = false;

	person!: Person;
	c_email_preferred: boolean = true;

	constructor(
		private sService: SettingsService,
		private router: Router,
		private alerts: AlertsComponent,
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.sService.loadSettings().subscribe({
			next: (data) => {
				this.pageLoading = false;
				if (data.success) {
					let a_data = data.admin;

					this.person = {
						f_name: {
							prop: a_data.f_name,
							editable: true,
						},
						l_name: {
							prop: a_data.l_name,
							editable: true,
						},
						username: {
							prop: a_data.username,
							editable: false,
						},
						email: {
							prop: a_data.email,
							editable: true,
						},
						p_email: {
							prop: a_data.p_email,
							editable: true,
						},
						c_email: {
							prop: a_data.c_email,
							editable: false,
						},
						phone: {
							prop: a_data.phone,
							editable: true,
						},
						role: {
							prop: a_data.role,
							editable: false,
						},
						uri: {
							prop: a_data.uri,
							editable: true,
						},
					}

					this.c_email_preferred = this.person.email.prop === this.person.c_email.prop;

					this.pageLoaded = true;
				}
				else if (data.login) {
					this.router.navigate(['/']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("An Error occured. Please Contact Tech Support", true);
			}
		});
	}

	validate() {
		let wsp = /^\s*$/;

		if(!this.person.f_name.prop || !this.person.l_name.prop || !this.person.p_email.prop){
			this.alerts.alert("All fields are required", true);
		}
		else if(wsp.test(this.person.f_name.prop) || wsp.test(this.person.l_name.prop) || wsp.test(this.person.p_email.prop)){
			this.alerts.alert("All fields are required", true);
		}
		else {
			this.updateLoading = true;
			this.sService.updateAccount(this.person.f_name.prop, this.person.l_name.prop, this.person.p_email.prop, this.person.phone.prop, this.c_email_preferred).subscribe({
				next: (data) => {
					this.updateLoading = false;

					if (data.success) {
						this.alerts.alert("Profile Updated", false);
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

	selectFile() {
		if (!this.uploadLoading) {
			document.getElementById('file-upload')?.click();
		}
	}

	uploadFile(ev: any) {
		if (ev.target) {
			let fList: FileList = ev.target.files;
			if (fList.length > 0) {
				let size = fList[0].size;
				if (size > 5242880) {
					this.alerts.alert("Your file must be less than 5MB in size", true);
				}
				else {
					console.log('done');
					let photo = fList[0];

					let fData = new FormData();

					fData.append('profile_photo', photo);
					fData.append('sect', 'i');

					this.uploadLoading = true;
					this.sService.updateProfilePhoto(fData).subscribe({
						next: (data) => {
							this.uploadLoading = false;

							if (data.success) {
								this.person.uri.prop = data.uri;
								this.alerts.alert("Profile Photo Updated", false);
							}
							else {
								this.alerts.alert(data.reason, true);
							}
						},
						error: () => {
							this.uploadLoading = false;
							this.alerts.alert("Please check your connection", true);
						}
					});
				}
			}
		}
	}
}
