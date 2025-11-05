import { Component } from '@angular/core';
import { Auth } from '../auth';
import { Alerts } from '../alerts/alerts';
import { startAuthentication, startRegistration, platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import { environment } from '../../environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Loading } from '../loading/loading';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface LoginResponse {
	success: boolean;
	token: string;
	f_name: string;
	l_name: string;
	tier: string;
	uri: string;
	reason?: string;
}

@Component({
	selector: 'app-login',
	imports: [MatFormFieldModule, FormsModule, MatInputModule, MatIconModule, Loading, MatInputModule, MatButtonModule],
	templateUrl: './login.html',
	styleUrl: './login.scss',
})
export class Login {
	loading: boolean = false;
	usernameProvided: boolean = false;
	qr_code: string = "";
	wsp: RegExp = /^\s*$/;

	supportsPasskeys: boolean = false;
	hasPasskeys: boolean = false;
	passkeyLoading: boolean = false;

	username: string = "";
	password: string = "";
	code: string = "";
	code_to_copy: string = "";
	code_to_display: string = "";
	obscurePassword: boolean = true;
	createPasskey: boolean = false;

	verifying: boolean = false;
	firstUse: boolean = false;

	constructor(
		private auth: Auth,
		private alerts: Alerts,
		private clipboard: Clipboard
	) { }

	ngOnInit(): void {
		platformAuthenticatorIsAvailable().then((available) => {
			if (available) {
				this.supportsPasskeys = true;
			} else {
				this.supportsPasskeys = false;
			}
		});
	}

	searchForPasskeys() {
		if (!this.username || this.wsp.test(this.username)) {
			this.alerts.alert("Please provide your Username", true);
		}
		else {
			this.passkeyLoading = true;
			this.auth.searchForPasskeys(this.username).subscribe({
				next: (data) => {
					this.passkeyLoading = false;

					if (data.success) {
						this.usernameProvided = true;
						if (data.found) {
							this.authenticateWithPasskey();
							this.hasPasskeys = true;
						}
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.passkeyLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}

	login(registerPasskey: boolean = false) {
		if (!this.username || !this.password) {
			this.alerts.alert("Both fields are required", true);
		}
		else if (this.wsp.test(this.username) || this.wsp.test(this.password)) {
			this.alerts.alert("Both fields are required", true);
		}
		else {
			this.loading = true;
			if (registerPasskey) {
				this.createPasskey = true;
			}

			this.auth.loginPre(this.username, this.password).subscribe({
				next: (data) => {
					this.loading = false;

					if (data.success) {
						this.verifying = true;
						if (data.first_use) {
							this.firstUse = true;
							this.code_to_copy = data.code_to_copy;
							for (let i = 0; i < this.code_to_copy.length; i += 4) {
								this.code_to_display += this.code_to_copy.slice(i, i + 4);
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
			this.code = String(this.code);
			this.auth.validateMFA(this.code).subscribe({
				next: (data) => {
					this.loading = false;

					if (data.success) {
						localStorage.setItem('token', data.token);
						if (this.createPasskey) {
							this.registerPasskey();
						}
						else {
							this.postLogin(data);
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
						if (this.createPasskey) {
							this.registerPasskey();
						}
						else {
							this.postLogin(data);
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

	registerPasskey() {
		this.passkeyLoading = true;
		this.auth.retrievePasskeyRegistrationOptions().subscribe({
			next: async (resp) => {
				if (resp.success) {
					try {
						const attResp = await startRegistration({ optionsJSON: resp.options });
						this.auth.verifyPasskeyRegistrationResponse(attResp).subscribe({
							next: (data) => {
								this.passkeyLoading = false;
								if (data.success) {
									this.alerts.alert("Passkey Created!", false);
									location.assign(`${environment.site_address}/home`);
								}
								else {
									this.alerts.alert(data.reason, true);
								}
							},
							error: () => {
								this.passkeyLoading = false;
								this.alerts.alert("Please check your connection", true);
							}
						});
					} catch (error) {
						console.log(error);
						this.passkeyLoading = false;
						this.alerts.alert("Error creating passkey. Please try again.", true);
					}
				}
				else {
					this.passkeyLoading = false;
					this.alerts.alert(resp.reason, true);
				}
			},
			error: () => {
				this.passkeyLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	authenticateWithPasskey() {
		this.passkeyLoading = true;
		this.auth.retrievePasskeyAuthenticationOptions(this.username).subscribe({
			next: async (resp) => {
				if (resp.success) {
					try {
						const authResponse = await startAuthentication({ optionsJSON: resp.options });
						this.auth.verifyPasskeyAuthenticationResponse(authResponse, this.username).subscribe({
							next: (data) => {
								this.passkeyLoading = false;
								if (data.success) {
									this.postLogin(data);
								}
								else {
									this.alerts.alert(data.reason, true);
								}
							},
							error: () => {
								this.passkeyLoading = false;
								this.alerts.alert("Please check your connection", true);
							}
						});
					} catch (error) {
						this.passkeyLoading = false;
						this.alerts.alert("Passkey authentication interrupted. Please log in with your Password", true);
					}
				}
				else {
					this.passkeyLoading = false;
					this.alerts.alert(resp.reason, true);
				}
			},
			error: () => {
				this.passkeyLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	postLogin(data: LoginResponse) {
		localStorage.setItem('token', data.token);
		let full_name = `${data.f_name} ${data.l_name}`;
		localStorage.setItem('name', full_name);
		localStorage.setItem('tier', data.tier);
		localStorage.setItem('uri', data.uri);
		this.alerts.alert("Logged In!", false);
		location.assign(`${environment.site_address}/home`);
	}
}
