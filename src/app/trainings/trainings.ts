import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface DashItem {
	icon: string;
	title: string;
	url: string;
	subtitle: string;
}

@Component({
	selector: 'app-trainings',
	imports: [],
	templateUrl: './trainings.html',
	styleUrl: './trainings.scss',
})
export class Trainings {
	items: Array<DashItem> = [
		{
			icon: 'icon-1.png',
			title: 'Take a Training',
			subtitle: 'Complete your Training Schedule',
			url: 'available-trainings'
		},
		{
			icon: 'icon-2.png',
			title: 'Create Trainings',
			subtitle: 'Set Up a New Training',
			url: 'create-training'
		},
		{
			icon: 'icon-3.png',
			title: 'Manage Trainings',
			subtitle: 'Update Training Content and Assets',
			url: 'manage-trainings'
		},
	];

	constructor(
		private router: Router
	) { }

	nav(url: string) {
		this.router.navigate(['/trainings', url]);
	}
}
