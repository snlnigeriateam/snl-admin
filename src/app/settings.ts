import { Injectable } from '@angular/core';
import { Api } from './api';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class Settings {
	constructor(
		private request: Api
	) { }

	loadSettings(): Observable<any> {
		return this.request.request('settings/load', 'get');
	}

	updateAccount(f_name: string, l_name: string, p_email: string, phone: string, c_email_preferred: boolean): Observable<any> {
		return this.request.request('settings/update-account', 'post', {
			sect: 'a',
			f_name: f_name,
			l_name: l_name,
			p_email: p_email,
			phone: phone,
			c_email_preferred: c_email_preferred
		});
	}

	updatePassword(c_pass: string, n_pass: string): Observable<any> {
		return this.request.request('settings/update-account', 'post', {
			sect: 'p',
			c_pass: c_pass,
			n_pass: n_pass
		});
	}

	resetMFA(): Observable<any> {
		return this.request.request('settings/update-account', 'post', {
			sect: 'm',
		});
	}

	updateProfilePhoto(fData: FormData): Observable<any> {
		return this.request.request('settings/update-account', 'post', fData);
	}
}
