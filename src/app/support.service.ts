import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class SupportService {

	constructor(
		private request: ApiService,
	) { }

	loadQueries(): Observable<any> {
		return this.request.request('support/queries', 'get');
	}

	loadQuery(q_id: string): Observable<any> {
		return this.request.request('support/query', 'post', {
			q_id: q_id
		});
	}
}
