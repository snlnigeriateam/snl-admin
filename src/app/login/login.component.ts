import { Component, OnInit } from '@angular/core';

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

	constructor() { }

	ngOnInit(): void {
	}

	login() { }

	verify() { }
}
