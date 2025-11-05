import { Injectable } from '@angular/core';
import { Api } from './api';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserTrainings {
	constructor(
		private request: Api
	) { }

	loadTrainings(): Observable<any> {
		return this.request.request('trainings/user/trainings', 'get');
	}

	loadTraining(t_id: string): Observable<any> {
		return this.request.request('trainings/user/training', 'post', { t_id: t_id });
	}

	updateTrainingProgress(t_id: string, c_id: string, url: string, notes: string): Observable<any> {
		return this.request.request('trainings/user/update-progress', 'post', { t_id: t_id, c_id: c_id, url: url, notes: notes });
	}

	startTraining(t_id: string): Observable<any> {
		return this.request.request('trainings/user/start-training', 'post', { t_id: t_id });
	}

	startTest(t_id: string): Observable<any> {
		return this.request.request('trainings/user/start-training-test', 'post', { t_id: t_id });
	}

	endTest(t_id: string, right_responses: Array<string>, wrong_responses: Array<string>): Observable<any> {
		return this.request.request('trainings/user/end-training-test', 'post', { t_id, right_responses, wrong_responses });
	}

	resetTrainingProgress(t_id: string, right_responses: Array<string>, wrong_responses: Array<string>): Observable<any> {
		return this.request.request('trainings/user/reset-training-progress', 'post', { t_id, right_responses, wrong_responses });
	}
}
