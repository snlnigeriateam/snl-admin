import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { AddressService } from '../address.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	loading: boolean = false;
	qr_code: string = "";
	wsp: RegExp = /^\s*$/;

	username: string = "";
	password: string = "";
	code: string = "";
	code_to_copy: string = "";
	code_to_display: string = "";
	obscurePassword: boolean = true;

	verifying: boolean = false;
	firstUse: boolean = false;

	constructor(
		private auth: AuthService,
		private alerts: AlertsComponent,
		private address: AddressService,
		private clipboard: Clipboard
	) { }

	ngOnInit(): void {
	}

	login() {
		if (!this.username || !this.password) {
			this.alerts.alert("Both fields are required", true);
		}
		else if (this.wsp.test(this.username) || this.wsp.test(this.password)) {
			this.alerts.alert("Both fields are required", true);
		}
		else {
			this.loading = true;
			this.auth.loginPre(this.username, this.password).subscribe({
				next: (data) => {
					this.loading = false;

					if (data.success) {
						this.verifying = true;
						if (data.first_use) {
							this.firstUse = true;
							this.code_to_copy = data.code_to_copy;
							for(let i = 0; i<this.code_to_copy.length; i += 4){
								this.code_to_display += this.code_to_copy.slice(i, i+4);
								this.code_to_display += " ";
							}
							this.qr_code = data.code;
							localStorage.setItem('token', data.token);
						}
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.loading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}

	toggleObscurity() {
		this.obscurePassword = !this.obscurePassword;
	}

	copySetupKey() {
		if (this.code_to_copy.length > 0) {
			let copied = this.clipboard.copy(this.code_to_copy);
			if (copied) {
				this.alerts.alert("Setup Key Copied to Clipboard", false);
			}
		}
	}

	validate() {
		if (!this.code || this.wsp.test(this.code)) {
			this.alerts.alert("Please provide your Authentication Code", true);
		}
		else {
			this.loading = true;
			this.auth.validateMFA(this.code).subscribe({
				next: (data) => {
					this.loading = false;

					if (data.success) {
						localStorage.setItem('token', data.token);
						let full_name = `${data.f_name} ${data.l_name}`;
						localStorage.setItem('name', full_name);
						localStorage.setItem('tier', data.tier);
						localStorage.setItem('uri', data.uri);
						this.alerts.alert("Logged In!", false);
						location.assign(`${this.address.SITE_ADDRESS}/home`);
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.loading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}

	verify() {
		if (!this.code || this.wsp.test(this.code)) {
			this.alerts.alert("Please provide your Authentication Code", true);
		}
		else {
			this.loading = true;
			this.auth.loginPost(this.username, this.password, this.code).subscribe({
				next: (data) => {
					this.loading = false;

					if (data.success) {
						localStorage.setItem('token', data.token);
						let full_name = `${data.f_name} ${data.l_name}`;
						localStorage.setItem('name', full_name);
						localStorage.setItem('tier', data.tier);
						localStorage.setItem('uri', data.uri);
						this.alerts.alert("Logged In!", false);
						location.assign(`${this.address.SITE_ADDRESS}/home`);
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.loading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}
}
