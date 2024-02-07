import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { AddressService } from '../address.service';

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

	verifying: boolean = false;
	firstUse: boolean = false;

	constructor(
		private auth: AuthService,
		private alerts: AlertsComponent,
		private address: AddressService
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
