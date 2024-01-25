import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	username: string = "";
	password: string = "";
	code: string = "";

	verifying: boolean = true;
	firstUse: boolean = true;

	dataUrl: string = "";

	constructor(
		private auth: AuthService,
		// private alerts: 
	) { }

	ngOnInit(): void {
	}

	login() { }

	verify() { }
}
