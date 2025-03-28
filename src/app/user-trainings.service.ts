import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class UserTrainingsService {

	constructor(
		private request: ApiService
	) { }

	loadTrainings(): Observable<any> {
		return this.request.request('trainings/user/trainings', 'get');
	}

	loadTraining(t_id: string): Observable<any> {
		return this.request.request('trainings/user/training', 'post', { t_id: t_id });
	}

	updateTrainingProgress(t_id: string, c_id: string): Observable<any> {
		return this.request.request('trainings/user/update-progress', 'post', { t_id: t_id, c_id: c_id });
	}

	startTraining(t_id: string): Observable<any> {
		return this.request.request('trainings/user/start-training', 'post', { t_id: t_id });
	}
}
