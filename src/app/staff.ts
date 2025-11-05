import { Injectable } from '@angular/core';
import { Api } from './api';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class Staff {
	constructor(
		private request: Api
	) { }

	loadAdministrators(): Observable<any> {
		return this.request.request('administrators/load-administrators', 'get');
	}

	loadAdministrator(a_id: string): Observable<any> {
		return this.request.request('administrators/load-administrator', 'post', { a_id: a_id });
	}

	loadCreateAdmin(): Observable<any> {
		return this.request.request('administrators/create-admin', 'get');
	}

	createAdministrator(username: string, f_name: string, l_name: string, p_email: string, c_email: string, c_email_preferred: boolean, phone: string, access_level: string, p_id: string, d_id: string, s_id: string): Observable<any> {
		return this.request.request('administrators/create-admin', 'post', {
			username: username,
			f_name: f_name,
			l_name: l_name,
			p_email: p_email,
			c_email: c_email,
			c_email_preferred: c_email_preferred,
			phone: phone,
			access_level: access_level,
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

	updateStaff(a_id: string, s_id: string, access_level: string, p_id: string, dept: string): Observable<any> {
		return this.request.request('administrators/update-staff', 'post', {
			a_id: a_id,
			s_id: s_id,
			access_level: access_level,
			p_id: p_id,
			dept: dept
		});
	}
}
