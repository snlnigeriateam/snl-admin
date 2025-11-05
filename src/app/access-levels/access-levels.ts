import { Component } from '@angular/core';
import { AccessLevel } from '../interfaces';
import { Auth } from '../auth';
import { Alerts } from '../alerts/alerts';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { Loading } from '../loading/loading';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-access-levels',
	imports: [RouterLink, MatIcon, Loading, MatButtonModule],
	templateUrl: './access-levels.html',
	styleUrl: './access-levels.scss',
})
export class AccessLevels {
	access_levels: Array<AccessLevel> = [];
	pageLoading: boolean = true;
	pageLoaded: boolean = false;

	constructor(
		private authService: Auth,
		private alerts: Alerts
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.authService.loadAccessLevels().subscribe({
			next: (data) => {
				this.pageLoading = false;
				if (data.success) {
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
