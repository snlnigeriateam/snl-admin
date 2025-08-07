import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UtilitiesService } from '../utilities.service';
import { Event } from '../interfaces.service';
import { CalendarService } from '../calendar.service';

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
	upcoming_events: Array<Event> = [];

	constructor(
		private authService: AuthService,
		private router: Router,
		private utilities: UtilitiesService,
		private calendarService: CalendarService
	) {
		this.today = this.utilities.dateFn(new Date(), false);
	}

	ngOnInit(): void {
		this.full_name = localStorage.getItem('name') ?? '';
		let t_uri = localStorage.getItem('uri') ?? '';
		this.loggedIn = localStorage.getItem('token') ? true : false;
		if(t_uri && t_uri.length > 0 && t_uri != 'undefined'){
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
		this.calendarService.loadUpcomingEvents().subscribe({
			next: (data) => {
				if (data.success) {
					this.upcoming_events = data.events;
				}
			},
			error: () => { }
		});
	}

	logout() {
		localStorage.setItem('token', "");
		this.router.navigate(['/']);
	}

	calendar() {
		this.router.navigate(['/calendar']);
	}
}
