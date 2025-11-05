import { Component } from '@angular/core';
import { AccessLevel, Department, Event, User } from '../interfaces';
import { Calendar as CalendarService } from '../calendar'
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Alerts } from '../alerts/alerts';
import { CalendarDialog } from '../calendar-dialog/calendar-dialog';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { Loading } from '../loading/loading';

interface ViewEvent extends Event {
	access_levels: Array<string>;
	group_name: string;
	group_invitee_names: Array<string>;
}

interface EventYear {
	year: number;
	events: Array<ViewEvent>;
	loaded: boolean;
	loading: boolean;
}

@Component({
	selector: 'app-calendar',
	imports: [MatCardModule, MatExpansionModule, DatePipe, Loading],
	templateUrl: './calendar.html',
	styleUrl: './calendar.scss',
})
export class Calendar {
	pageLoading: boolean = false;
	pageLoaded: boolean = false;

	upcoming_events: Array<ViewEvent> = [];
	previous_events: Array<EventYear> = [];
	previous_years: Array<number> = [];
	start_year: number = 2025;

	access_levels: Array<AccessLevel> = [];

	departments: Array<Department> = [];
	staff: Array<User> = [];

	event_types: Array<string> = [
		'Training',
		'Meeting',
		'Public Holiday',
		'Conference',
		'Workshop',
		'Webinar',
		'Other'
	];

	spotlight_event_id: string = '';

	constructor(
		private alerts: Alerts,
		private calendarService: CalendarService,
		private dialog: MatDialog,
		private router: Router
	) {
		let route_params = this.router.parseUrl(this.router.url).queryParams;
		let event_id = route_params['eid'];
		if (event_id) {
			this.spotlight_event_id = event_id;
		}
		this.load();

		let currentYear = new Date().getFullYear();
		for (let i = currentYear; i >= this.start_year; i--) {
			this.previous_years.push(i);
			this.previous_events.push({
				year: i,
				events: [],
				loaded: false,
				loading: false
			});
		}
	}

	load() {
		this.pageLoading = true;
		this.calendarService.loadUpcomingEvents().subscribe({
			next: (response) => {
				this.pageLoading = false;
				if (response.success) {
					let upcoming_events = response.events;
					this.upcoming_events = this.transformEvents(upcoming_events);
					this.pageLoaded = true;
					if (this.spotlight_event_id.length > 0) {
						let event = this.upcoming_events.find(e => e.e_id === this.spotlight_event_id);
						if (event) {
							this.spotlightEvent(event);
						}
					}
				} else {
					this.alerts.alert(response.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	loadPreviousEvents(index: number) {
		let eventYear = this.previous_events[index];
		let year = eventYear.year;

		if (eventYear.loaded || eventYear.loading) {
			return; // Already loaded/loading
		}
		else {
			eventYear.loading = true;
			this.calendarService.loadPreviousEvents(year).subscribe({
				next: (response) => {
					eventYear.loading = false;
					if (response.success) {
						let events = this.transformEvents(response.events);
						eventYear.events = events;
						eventYear.loaded = true;
					} else if (response.login) {
						this.alerts.alert("Session expired, please log in again", true);
					} else {
						this.alerts.alert(response.reason, true);
					}
				},
				error: () => {
					eventYear.loading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}

	transformEvents(events: Array<Event>): Array<ViewEvent> {
		return events.map(event => ({
			...event,
			access_levels: event.tiers.map(tier => this.access_levels.find(level => level.tier === tier)?.name || 'Unknown'),
			group_name: event.group === 'd' ? 'Departments' : event.group === 'i' ? 'Individuals' : 'General',
			group_invitee_names: event.invitees.map(id => {
				if (event.group === 'd') {
					const dept = this.departments.find(dept => dept.d_id === id);
					return dept ? dept.name : 'Unknown';
				} else if (event.group === 'i') {
					const user = this.staff.find(user => user.a_id === id);
					return user ? `${user.f_name} ${user.l_name}` : 'Unknown';
				}
				return 'General';
			})
		} as ViewEvent));
	}

	spotlightEvent(event: ViewEvent) {
		this.spotlight_event_id = event.e_id;
		this.dialog.open(CalendarDialog, {
			data: {
				event: event,
				access_levels: this.access_levels
			},
			autoFocus: false,
		}).afterClosed().subscribe(() => {
			this.spotlight_event_id = '';
		});
	}
}
