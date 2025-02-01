import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { SettingsService } from '../settings.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

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
	styleUrl: './settings.component.scss',
})

export class SettingsComponent {
	pageLoading: boolean = false;
	pageLoaded: boolean = false;
	uploadLoading: boolean = false;
	updateLoading: boolean = false;

	person!: Person;
	c_email_preferred: boolean = true;

	c_pass: string = '';
	n_pass: string = '';
	confirm_pass: string = '';

	obscureCurrent: boolean = true;
	obscureNew: boolean = true;
	obscureConf: boolean = true;

	//cropping images
	imageChangedEvent: any = '';
	croppedImage: any = '';
	croppedImageBlob!: Blob;
	croppingImage: boolean = false;

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

		if (!this.person.f_name.prop || !this.person.l_name.prop || !this.person.p_email.prop) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.person.f_name.prop) || wsp.test(this.person.l_name.prop) || wsp.test(this.person.p_email.prop)) {
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

	uploadFile() {
		let fData = new FormData();

		fData.append('profile_photo', this.croppedImageBlob);
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

//trainings: frequency, tiers applicable, title, deadline, deadline_warning_days, annual, even_years_only, link, content, tests, internal,
//user_trainings: date_started, days_logged, date_completed
	toggleVisibilityCurrent() {
		this.obscureCurrent = !this.obscureCurrent;
	}

	toggleVisibilityNew() {
		this.obscureNew = !this.obscureNew;
	}

	toggleVisibilityConfirm() {
		this.obscureConf = !this.obscureConf;
	}

	validatePassword() {
		let wsp = /^\s*$/;

		if (!this.c_pass || !this.n_pass || !this.confirm_pass) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.c_pass) || wsp.test(this.n_pass) || wsp.test(this.confirm_pass)) {
			this.alerts.alert("All fields are required", true);
		}
		else if (this.n_pass !== this.confirm_pass) {
			this.alerts.alert("Your New Password and Confirmation do not match", true);
		}
		else if (!this.checkPassword(this.n_pass)) {
			this.alerts.alert("Your Password must be at least eight (8) characters long and must contain a combination of letters and numbers", true);
		}
		else {
			this.updateLoading = true;
			this.sService.updatePassword(this.c_pass, this.n_pass).subscribe({
				next: (data) => {
					this.updateLoading = false;

					if (data.success) {
						this.alerts.alert("Password Updated. Please log in with your new password", false);
						localStorage.setItem('token', "");
						this.router.navigate(['/']);
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

	resetMFA() {
		this.alerts.confirm("Confirm MFA Reset").then((confirmed) => {
			if (confirmed) {
				this.updateLoading = true;
				this.sService.resetMFA().subscribe({
					next: (data) => {
						this.updateLoading = false;

						if (data.success) {
							this.alerts.alert("MFA Reset. Please log in once more", false);
							localStorage.setItem('token', "");
							this.router.navigate(['/']);
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
		}).catch(e => {
			this.alerts.alert("An error occured", true);
		});
	}

	checkPassword(password: string) {
		let valid = true;
		let l_pat = /[a-zA-Z]/;
		let d_pat = /\d/;

		if (password.length < 8) {
			valid = false;
		}
		if (!l_pat.test(password)) {
			valid = false;
		}
		if (!d_pat.test(password)) {
			valid = false;
		}
		return valid;
	}

	//cropping

	fileChangeEvent(event: any): void {
		if (event.target) {
			let fList: FileList = event.target.files;
			if (fList.length > 0) {
				let size = fList[0].size;
				if (size > 5242880) {
					this.alerts.alert("Your file must be less than 5MB in size", true);
				}
				else {
					this.croppingImage = true;
					this.imageChangedEvent = event;
				}
			}
		}
	}

	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
		if(event.blob != null){
			this.croppedImageBlob = event.blob;
		}
	}

	cropCompleted(){
		this.croppingImage = false;
		this.uploadFile();
	}

	cropCanceled(){
		this.croppingImage = false;
	};
	
	imageLoaded(image: LoadedImage) {
		// show cropper
	}
	cropperReady() {
		// cropper ready
	}
	loadImageFailed() {
		// show message
	}
}
