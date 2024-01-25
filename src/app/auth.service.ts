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
}
