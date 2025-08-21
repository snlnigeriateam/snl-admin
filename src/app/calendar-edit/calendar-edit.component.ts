import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AccessLevel, Department, User, Event, ViewEvent } from '../interfaces.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { CalendarService } from '../calendar.service';

interface InviteGroup {
	name: string;
	value: string;
}

interface EventYear {
	year: number;
	events: Array<ViewEvent>;
	loaded: boolean;
	loading: boolean;
}

@Component({
	selector: 'app-calendar-edit',
	templateUrl: './calendar-edit.component.html',
	styleUrl: './calendar-edit.component.scss'
})
export class CalendarEditComponent {
	pageLoading: boolean = false;
	pageLoaded: boolean = false;
	saveLoading: boolean = false;

	upcoming_events: Array<ViewEvent> = [];
	previous_events: Array<EventYear> = [];
	previous_years: Array<number> = [];
	start_year: number = 2023;

	invite_groups: Array<InviteGroup> = [
		{ name: 'General', value: 'g' },
		{ name: 'Departments', value: 'd' },
		{ name: 'Individuals', value: 'i' }
	];

	event_name: string = '';
	event_type: string = '';
	event_start_date: Date = new Date();
	event_end_date: Date = new Date();
	event_access_levels: Array<number> = [];
	event_description: string = '';
	event_invite_group: InviteGroup;
	group_value: Array<string> = [];

	min_date: Date = new Date();
	max_date: Date = new Date(new Date().setMonth(11, 31)); // Set to December 31st of the current year

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

	constructor(
		private alerts: AlertsComponent,
		private calendarService: CalendarService
	) {
		this.event_invite_group = this.invite_groups[0];
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
		this.calendarService.loadEditPage().subscribe({
			next: (response) => {
				this.pageLoading = false;
				if (response.success) {
					this.access_levels = response.access_levels;
					this.departments = response.departments;
					this.staff = response.staff;
					let events = response.events;
					events = this.transformEvents(events)
					this.upcoming_events = events;
					this.pageLoaded = true;
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
			this.calendarService.loadAllPreviousEvents(year).subscribe({
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

	setEventDate(type: string, event: MatDatepickerInputEvent<Date>, start: boolean) {
		if (start) {
			this.event_start_date = new Date(event.value!);
			this.event_end_date = new Date(event.value!);
		}
		else {
			this.event_end_date = new Date(event.value!);
		}
	}

	selectAllLevels() {
		this.event_access_levels = this.access_levels.map(level => level.tier);
	}

	validate() {
		let wsp = /^\s*$/;

		if (!this.event_name || wsp.test(this.event_name)) {
			this.alerts.alert("Please provide a valid event name", true);
		}
		else if (!this.event_start_date || isNaN(this.event_start_date.getTime())) {
			this.alerts.alert("Please provide a valid event start date", true);
		}
		else if (!this.event_end_date || isNaN(this.event_end_date.getTime())) {
			this.alerts.alert("Please provide a valid event end date", true);
		}
		else if (this.event_start_date > this.event_end_date) {
			this.alerts.alert("Event start date cannot be after the end date", true);
		}
		else if (!this.event_type || wsp.test(this.event_type)) {
			this.alerts.alert("Please select a valid event type", true);
		}
		else if (this.event_invite_group.value === 'd' && this.departments.length === 0) {
			this.alerts.alert("Please select at least one department to invite", true);
		}
		else if (this.event_invite_group.value === 'i' && this.staff.length === 0) {
			this.alerts.alert("Please select at least one staff member to invite", true);
		}
		else if (this.event_access_levels.length === 0 && this.event_invite_group.value !== 'i') {
			this.alerts.alert("Please select at least one Access Level this event applies to", true);
		}
		else {
			this.saveLoading = true;

			this.calendarService.createEvent(this.event_name, this.event_start_date.getTime(), this.event_end_date.getTime(), this.event_access_levels, this.event_type, this.event_description, this.event_invite_group.value, this.group_value).subscribe({
				next: (response) => {
					this.saveLoading = false;
					if (response.success) {
						this.alerts.alert("Event created successfully!", false);
						// Reset form fields after successful save
						this.event_name = '';
						this.event_start_date = new Date();
						this.event_end_date = new Date();
						this.event_access_levels = [];
						this.event_description = '';
						this.event_invite_group = this.invite_groups[0];
						this.group_value = [];
						let newEvent: ViewEvent = this.transformEvents([response.event_data])[0];

						this.upcoming_events.push(newEvent);

						this.upcoming_events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
					} else if (response.login) {
						this.alerts.alert("Session expired, please log in again", true);
					} else {
						this.alerts.alert(response.reason, true);
					}
				},
				error: () => {
					this.saveLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}
}
