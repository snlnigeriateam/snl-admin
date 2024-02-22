import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})

export class HiringService {
	constructor(
		private request: ApiService
	) { }

	loadPositions(): Observable<any> {
		return this.request.request('hiring/positions', 'get');
	}

	loadPosition(p_id: string): Observable<any> {
		return this.request.request('hiring/positions', 'post', {
			p_id: p_id
		});
	}

	createPosition(name: string, unique: boolean, description: string): Observable<any> {
		return this.request.request('hiring/create-position', 'post', {
			name: name,
			unique: unique,
			description: description
		});
	}

	updatePosition(p_id: string, name: string, unique: boolean, description: string): Observable<any> {
		return this.request.request('hiring/update-position', 'post', {
			p_id: p_id,
			name: name,
			unique: unique,
			description: description
		});
	}

	removePosition(p_id: string): Observable<any> {
		return this.request.request('hiring/remove-position', 'post', {
			p_id: p_id
		});
	}

	loadHiringRounds(): Observable<any> {
		return this.request.request('hiring/load-rounds', 'get');
	}

	loadHiringRound(r_id: string): Observable<any> {
		return this.request.request('hiring/load-round', 'post', {
			r_id: r_id
		});
	}

	startHiringRound(name: string, special: boolean, positions:Array<any>, duration: number, start_date: number): Observable<any> {
		return this.request.request('hiring/start-round', 'post', {
			name: name,
			special: special,
			positions: positions,
			duration: duration,
			start_date: start_date
		});
	}

	closeHiringRound(r_id: string): Observable<any> {
		return this.request.request('hiring/close-round', 'post', {
			r_id: r_id
		});
	}

	loadApplications(r_id: string): Observable<any> {
		return this.request.request('hiring/load-applications', 'post', {
			r_id: r_id
		});
	}

	inviteToInterview(a_id: string, date: string, time: string, platform: string, link: string): Observable<any> {
		return this.request.request('hiring/invite', 'post', {
			a_id: a_id,
			date: date,
			time: time,
			platform: platform,
			link: link
		});
	}

	rejectApplicant(a_id: string, position: string, reason: string): Observable<any> {
		return this.request.request('hiring/reject-application', 'post', {
			a_id: a_id,
			position: position,
			reason: reason
		});
	}
}
