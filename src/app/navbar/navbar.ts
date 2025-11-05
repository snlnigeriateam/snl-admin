import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ViewEvent, AccessLevel, Department, User, Event } from '../interfaces';
import { Auth } from '../auth';
import { Utilities } from '../utilities';
import { Calendar } from '../calendar';
import { Alerts } from '../alerts/alerts';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DatePipe } from '@angular/common';
import { Loading } from '../loading/loading';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, MatCardModule, MatSidenavModule, RouterLink, DatePipe, Loading],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
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
		private authService: Auth,
		private router: Router,
		private utilities: Utilities,
		private calendarService: Calendar,
		private alerts: Alerts
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
						this.loadUpcomingEvents();
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

	openCalendar() {
		this.router.navigate(['/calendar']);
	}

	openCalendarEvent(e_id: string) {
		this.router.navigate(['/calendar'], { queryParams: { eid: e_id } });
	}
}
