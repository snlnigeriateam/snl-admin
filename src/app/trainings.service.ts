import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TrainingAsset } from './interfaces.service';

@Injectable({
	providedIn: 'root'
})
export class TrainingsService {

	constructor(
		private request: ApiService
	) { }

	createTraining(title: string, recurring: boolean, annual: boolean, even_years: boolean, internal: boolean, tiers: Array<number>, deadline: number, deadline_warning: number, link: string): Observable<any> {
		return this.request.request('trainings/create-training', 'post', {
			title,
			recurring,
			annual,
			even_years,
			internal,
			tiers,
			deadline,
			deadline_warning,
			link
		});
	}

	loadTrainings(): Observable<any> {
		return this.request.request('trainings/load-trainings', 'get');
	}

	loadTraining(t_id: string): Observable<any> {
		return this.request.request('trainings/load-training', 'post', { t_id: t_id });
	}

	updateTraining(title: string, recurring: boolean, annual: boolean, even_years: boolean, internal: boolean, tiers: Array<number>, deadline: number, deadline_warning: number, link: string): Observable<any> {
		return this.request.request('trainings/update-training', 'post', {
			title,
			recurring,
			annual,
			even_years,
			internal,
			tiers,
			deadline,
			deadline_warning,
			link
		});
	}

	uploadAsset(fData: FormData): Observable<any> {
		return this.request.request('trainings/add-training-asset', 'post', fData);
	}

	addTrainingContent(t_id: string, content: string, heading: string, assets: Array<TrainingAsset>): Observable<any> {
		return this.request.request('trainings/add-training-content', 'post', {
			t_id,
			content,
			heading,
			assets
		});
	}

	updateTrainingContent(t_id: string, c_id: string, content: string, heading: string, assets: Array<TrainingAsset>): Observable<any> {
		return this.request.request('trainings/update-training-content', 'post', {
			t_id,
			c_id,
			content,
			heading,
			assets
		});
	}

	removeTrainingContent(t_id: string, c_id: string): Observable<any> {
		return this.request.request('trainings/remove-training-content', 'post', {
			t_id,
			c_id
		});
	}
}
