import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
	full_name: string = '';
	loggedIn: boolean = false;
	uri: string = '';

	constructor(
		private authService: AuthService,
		private router: Router
	) {
		// this.checkLoggedIn();
	}

	ngOnInit(): void {
		this.full_name = localStorage.getItem('name') ?? '';
		this.uri = localStorage.getItem('uri') ?? '/assets/icon-grey.png';
		this.loggedIn = localStorage.getItem('token') ? true : false;
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

	logout() {
		localStorage.setItem('token', "");
		this.router.navigate(['/']);
	}
}
