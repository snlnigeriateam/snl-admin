import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class StaffService {

	constructor(
		private request: ApiService
	) { }

	loadAdministrators(): Observable<any> {
		return this.request.request('administrators/load-administrators', 'get');
	}

	createAdministrator(username: string, f_name: string, l_name: string, p_email: string, c_email: string, c_email_preferred: boolean, phone: string, tier: number, p_id: string): Observable<any> {
		return this.request.request('administrators/create-admin', 'post', {
			username: username,
			f_name: f_name,
			l_name: l_name,
			p_email: p_email,
			c_email: c_email,
			c_email_preferred: c_email_preferred,
			phone: phone,
			tier: tier,
			p_id: p_id
		});
	}
}
