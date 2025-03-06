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
	uri: string = '/assets/icon-grey.png';

	constructor(
		private authService: AuthService,
		private router: Router
	) {
		// this.checkLoggedIn();
	}

	ngOnInit(): void {
		this.full_name = localStorage.getItem('name') ?? '';
		let t_uri = localStorage.getItem('uri') ?? '';
		this.loggedIn = localStorage.getItem('token') ? true : false;
		if(t_uri && t_uri.length > 0 && t_uri != 'undefined'){
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
