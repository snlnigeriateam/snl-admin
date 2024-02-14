import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-verify-code',
	templateUrl: './verify-code.component.html',
	styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent {
	verifyLoading: boolean = false;

	code: string = '';
	username: string = '';
	password: string = '';
	c_pass: string = '';

	constructor(
		private router: Router,
		private alerts: AlertsComponent,
		private aService: AuthService
	) { }

	validate() {
		let wsp = /^\s*$/;

		if (!this.code || !this.username || !this.password || !this.c_pass) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.code) || wsp.test(this.username) || wsp.test(this.password) || wsp.test(this.c_pass)) {
			this.alerts.alert("All fields are required", true);
		}
		else if (!this.checkPassword(this.password)) {
			this.alerts.alert("Your Password must be at least eight characters long and should contain a mix of letters and numbers", true);
		}
		else if (this.password !== this.c_pass) {
			this.alerts.alert("Your Password and Confirmation do not match", true);
		}
		else {
			this.verify();
		}
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

	verify() {
		this.verifyLoading = true;
		this.aService.verifyCode(this.code, this.username, this.password).subscribe({
			next: (data) => {
				this.verifyLoading = false;
				if (data.success) {
					this.alerts.alert("Password set successfully! Please log in with your new password", false);
					this.router.navigate(['/']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
