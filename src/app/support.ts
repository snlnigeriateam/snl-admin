import { Injectable } from '@angular/core';
import { Api } from './api';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class Support {
	constructor(
		private request: Api,
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
