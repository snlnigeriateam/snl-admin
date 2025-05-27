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

	loadCreateAdmin(): Observable<any> {
		return this.request.request('administrators/create-admin', 'get');
	}

	createAdministrator(username: string, f_name: string, l_name: string, p_email: string, c_email: string, c_email_preferred: boolean, phone: string, tier: number, p_id: string, d_id: string, s_id: string): Observable<any> {
		return this.request.request('administrators/create-admin', 'post', {
			username: username,
			f_name: f_name,
			l_name: l_name,
			p_email: p_email,
			c_email: c_email,
			c_email_preferred: c_email_preferred,
			phone: phone,
			tier: tier,
			p_id: p_id,
			d_id: d_id,
			s_id: s_id
		});
	}

	//management
	loadDirectReports(): Observable<any> {
		return this.request.request('administrators/direct-reports', 'get');
	}

	loadDirectReport(r_id: string): Observable<any> {
		return this.request.request('administrators/direct-report', 'post', {
			r_id: r_id
		});
	}

	loadTrainingsData(t_id: string, status: string): Observable<any> {
		return this.request.request('administrators/load-trainings-data', 'post', {
			a_id: t_id,
			status: status
		});
	}

	loadAvailableTrainings(a_id: string): Observable<any> {
		return this.request.request('administrators/available-trainings', 'post', {
			a_id: a_id
		});
	}

	updateAdministrator(a_id: string, username: string, c_email: string, p_id: string, tier: number): Observable<any> {
		return this.request.request('administrators/update-admin', 'post', {
			a_id: a_id,
			username: username,
			c_email: c_email,
			p_id: p_id,
			tier: tier
		});
	}

	suspendAdministrator(a_id: string, reason: string, deadline: number): Observable<any> {
		return this.request.request('administrators/suspend-admin', 'post', {
			username: a_id,
			reason: reason,
			deadline: deadline
		});
	}

	reinstateAdministrator(a_id: string, reason: string, code: string): Observable<any> {
		return this.request.request('administrators/reinstate-admin', 'post', {
			username: a_id,
			reason: reason,
			code: code
		});
	}

	revokeAdministrator(a_id: string, reason: string, code: string): Observable<any> {
		return this.request.request('administrators/revoke-admin', 'post', {
			username: a_id,
			reason: reason,
			code: code
		});
	}
}
