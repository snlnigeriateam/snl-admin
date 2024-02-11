import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface DashItem {
	icon: string;
	title: string;
	url: string;
	subtitle: string;
}

@Component({
	selector: 'app-hiring',
	templateUrl: './hiring.component.html',
	styleUrl: './hiring.component.scss'
})
export class HiringComponent {
	items: Array<DashItem> = [
		{
			icon: 'icon-1.png',
			title: 'Positions',
			subtitle: 'Manage Positions: Create, Update and Remove Staff Positions',
			url: 'positions'
		},
		{
			icon: 'icon-2.png',
			title: 'Hiring Rounds',
			subtitle: 'Manage Hiring Rounds: Start and Close Open Rounds',
			url: 'hiring-rounds'
		},
	];

	constructor(
		private router: Router
	) { }

	nav(url: string) {
		this.router.navigate(['/hiring', url]);
	}
}
