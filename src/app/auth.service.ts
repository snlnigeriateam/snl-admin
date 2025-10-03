import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(
		private request: ApiService
	) { }

	verifyCode(code: string, username: string, password: string): Observable<any> {
		return this.request.request('verify-code', 'post', {
			code: code,
			username: username,
			password: password
		});
	}

	loginPre(username: string, password: string): Observable<any> {
		return this.request.request('login', 'post', {
			username: username,
			password: password,
			mfa: false
		});
	}

	validateMFA(token: string): Observable<any> {
		return this.request.request('validate-mfa', 'post', {
			token: token
		});
	}

	loginPost(username: string, password: string, token: string): Observable<any> {
		return this.request.request('login', 'post', {
			username: username,
			password: password,
			code: token,
			mfa: true
		});
	}

	loggedIn(): Observable<any> {
		return this.request.request('logged-in', 'get');
	}

	loadDashboard(): Observable<any> {
		return this.request.request('dashboard', 'get');
	}

	loadAccessLevels(): Observable<any> {
		return this.request.request('access-levels', 'get');
	}

	createAccessLevel(name: string, tier: number, permissions: Array<string>): Observable<any> {
		return this.request.request('access-levels/create-access-level', 'post', {
			access_level_name: name,
			tier: tier,
			access_level_permissions: permissions
		});
	}

	updateAccessLevel(l_id: string, name: string, tier: number, permissions: Array<string>): Observable<any> {
		return this.request.request('access-levels/update-access-level', 'post', {
			l_id: l_id,
			access_level_name: name,
			tier: tier,
			access_level_permissions: permissions
		});
	}

	retrievePasskeyRegistrationOptions(): Observable<any> {
		return this.request.request('passkeys/registration-options', 'get');
	}

	verifyPasskeyRegistrationResponse(response: any): Observable<any> {
		return this.request.request('passkeys/verify-registration', 'post', {
			response: response
		});
	}

	retrievePasskeyAuthenticationOptions(a_id: string): Observable<any> {
		return this.request.request('passkeys/authentication-options', 'post', {
			a_id: a_id
		});
	}

	verifyPasskeyAuthenticationResponse(response: any): Observable<any> {
		return this.request.request('passkeys/verify-authentication', 'post', {
			response: response
		});
	}
}
