import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { AccessLevel } from '../interfaces.service';

@Component({
	selector: 'app-access-levels',
	templateUrl: './access-levels.component.html',
	styleUrl: './access-levels.component.scss'
})
export class AccessLevelsComponent {
	access_levels: Array<AccessLevel> = [];
	pageLoading: boolean = true;
	pageLoaded: boolean = false;

	constructor(
		private authService: AuthService,
		private alerts: AlertsComponent
	){
		this.load();
	}

	load(){
		this.pageLoading = true;
		this.authService.loadAccessLevels().subscribe({
			next: (data) => {
				this.pageLoading = false;
				if(data.success){
					this.access_levels = data.access_levels;
				this.pageLoaded = true;
				} else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert('Please check your connection', true);
			}
		});
	}
}
