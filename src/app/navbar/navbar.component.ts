import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UtilitiesService } from '../utilities.service';
import { AccessLevel, Department, Event, User, ViewEvent } from '../interfaces.service';
import { CalendarService } from '../calendar.service';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	full_name: string = '';
	loggedIn: boolean = false;
	uri: string = '/assets/icon-grey.png';

	today: string;
	upcoming_events: Array<ViewEvent> = [];
	pageLoading: boolean = false;
	pageLoaded: boolean = false;
	access_levels: Array<AccessLevel> = [];
	departments: Array<Department> = [];
	staff: Array<User> = [];

	constructor(
		private authService: AuthService,
		private router: Router,
		private utilities: UtilitiesService,
		private calendarService: CalendarService,
		private alerts: AlertsComponent
	) {
		this.today = this.utilities.dateFn(new Date(), false);
	}

	ngOnInit(): void {
		this.full_name = localStorage.getItem('name') ?? '';
		let t_uri = localStorage.getItem('uri') ?? '';
		this.loggedIn = localStorage.getItem('token') ? true : false;
		if (t_uri && t_uri.length > 0 && t_uri != 'undefined') {
			this.uri = t_uri;
		}

		this.loadUpcomingEvents();
		this.checkLoggedIn();
	}

	checkLoggedIn() {
		let route = location.pathname;

		if (route !== '/' && route !== '/onboarding') {
			this.authService.loggedIn().subscribe({
				next: (data) => {
					if (data.login) {
						this.loggedIn = false;
						this.router.navigate(['/']);
					}
					else {
						this.loggedIn = true;
					}
				},
				error: () => { },
			});
		}
		else {
			this.loggedIn = false;
		}
	}

	loadUpcomingEvents() {
		this.pageLoading = true;
		this.calendarService.loadUpcomingEvents().subscribe({
			next: (response) => {
				this.pageLoading = false;
				if (response.success) {
					let upcoming_events = response.events;
					this.upcoming_events = this.transformEvents(upcoming_events);
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

	logout() {
		localStorage.setItem('token', "");
		this.loggedIn = false;
		this.full_name = '';
		this.uri = '/assets/icon-grey.png';
		this.upcoming_events = [];
		this.pageLoaded = false;
		this.pageLoading = false;
		location.assign('/');
	}

	openCalendar(e_id: string) {
		this.router.navigate(['/calendar'], { queryParams: { eid: e_id } });
	}
}
