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

	createTraining(title: string, recurring: boolean, annual: boolean, even_years: boolean, internal: boolean, tiers: Array<number>, question_count: number, pass_percentage: number, deadline: number, deadline_warning: number, link: string): Observable<any> {
		return this.request.request('trainings/create-training', 'post', {
			title,
			recurring,
			annual,
			even_years,
			internal,
			tiers,
			question_count,
			pass_percentage,
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

	updateTraining(t_id: string, title: string, recurring: boolean, annual: boolean, even_years: boolean, internal: boolean, tiers: Array<number>, question_count: number, pass_percentage: number, deadline: number, deadline_warning: number, link: string): Observable<any> {
		return this.request.request('trainings/update-training', 'post', {
			t_id,
			title,
			recurring,
			annual,
			even_years,
			internal,
			tiers,
			question_count,
			pass_percentage,
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

	addTestQuestion(t_id: string, question: string, answer_index: number, options: Array<string>): Observable<any> {
		return this.request.request('trainings/add-test-question', 'post', {
			t_id,
			question,
			answer_index,
			options
		});
	}

	updateTestQuestion(t_id: string, q_id: string, question: string, answer_index: number, options: Array<string>): Observable<any> {
		return this.request.request('trainings/update-test-question', 'post', {
			t_id,
			q_id,
			question,
			answer_index,
			options
		});
	}

	removeTestQuestion(q_id: string): Observable<any> {
		return this.request.request('trainings/remove-test-question', 'post', { q_id: q_id });
	}

	activateTraining(t_id: string): Observable<any> {
		return this.request.request('trainings/activate-training', 'post', { t_id: t_id });
	}

	deactivateTraining(t_id: string): Observable<any> {
		return this.request.request('trainings/deactivate-training', 'post', { t_id: t_id });
	}
}
