import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router } from '@angular/router';
// external trainings - log daily/on a frequency, have the individual work outside then log start times along with the URL for that day.
interface DashItem {
	icon: string;
	title: string;
	url: string;
	subtitle: string;
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
	pageLoading: boolean = false;
	pageLoaded: boolean = false;
	
	displayItems: Array<DashItem> = [];

	items: Array<DashItem> = [
		{
			icon: 'icon-1.png',
			title: 'Staff',
			subtitle: 'Actions on Staff Members',
			url: 'staff'
		},
		{
			icon: 'icon-2.png',
			title: 'Support Queries',
			subtitle: 'Respond to Inquiries',
			url: 'support'
		},
		{
			icon: 'icon-3.png',
			title: 'Hiring',
			subtitle: 'Manage Hiring Rounds',
			url: 'hiring'
		},
		{
			icon: 'icon-4.png',
			title: 'Trainings',
			subtitle: 'Take a Training Course',
			url: 'trainings/available-trainings'
		},
		{
			icon: 'icon-4.png',
			title: 'Trainings',
			subtitle: 'Actions on Training Courses',
			url: 'trainings'
		},
		{
			icon: 'icon-5.png',
			title: 'Departments',
			subtitle: "Manage Company Departments",
			url: 'departments'
		},
		{
			icon: 'icon-6.png',
			title: 'Staff Management',
			subtitle: "Manage your Direct Reports",
			url: 'management'
		}
	];

	constructor(
		private auth: AuthService,
		private alerts: AlertsComponent,
		private router: Router
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.auth.loadDashboard().subscribe({
			next: (data) => {
				this.pageLoading = false;
				if (data.success) {
					let a_data = data.admin_data;

					let tier = a_data.tier;

					this.displayItems.push(this.items[1]);
					this.displayItems.push(this.items[3]);

					if (tier < 3) {
						this.displayItems.push(this.items[0]);
						this.displayItems.push(this.items[2]);
						this.displayItems.push(this.items[4]);
						this.displayItems.push(this.items[5]);
					}

					if(tier < 4){
						this.displayItems.push(this.items[6]);
					}

					this.pageLoaded = true;
				}
				else if (data.login) {
					this.router.navigate(['/']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("An Error occured. Please Contact Tech Support", true);
			}
		});
	}

	nav(url: string) {
		this.router.navigate([url]);
	}
}
