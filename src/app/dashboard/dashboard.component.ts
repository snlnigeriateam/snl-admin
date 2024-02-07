import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router } from '@angular/router';

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
				if (data.success) {
					let a_data = data.admin_data;
				}
				else if (data.login) {
					this.router.navigate(['/']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.alerts.alert("An Error occured. Please Contact Tech Support", true);
			}
		});
	}
}
