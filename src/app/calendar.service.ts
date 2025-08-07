import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CalendarService {

	constructor(
		private request: ApiService
	) { }

	loadCalendarEvents(): Observable<any> {
		return this.request.request('events/load-events', 'get');
	}

	createEvent(event_name: string, event_start_date: number, event_end_date: number, event_tiers: Array<number>, event_type: string, event_description: string, event_group: string, invitees: Array<string>): Observable<any> {
		return this.request.request('events/create-event', 'post', {
			event_name: event_name,
			event_start_date: event_start_date,
			event_end_date: event_end_date,
			event_tiers: event_tiers,
			event_type: event_type,
			event_description: event_description,
			event_group: event_group,
			invitees: invitees
		});
	}

	loadEditPage(): Observable<any> {
		return this.request.request('events/calendar-edit', 'get');
	}

	loadUpcomingEvents(): Observable<any> {
		return this.request.request('events/upcoming-events', 'get');
	}
}
