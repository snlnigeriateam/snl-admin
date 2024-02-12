import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { HiringService } from '../hiring.service';
import { UtilitiesService } from '../utilities.service';

interface Round {
	name: string,
	url: string,
	r_id: string,
	open: boolean,
	special: boolean,
	start_date: Date,
	end_date: Date,
	positions: Array<any>
}

@Component({
	selector: 'app-hiring-rounds',
	templateUrl: './hiring-rounds.component.html',
	styleUrl: './hiring-rounds.component.scss'
})
export class HiringRoundsComponent {
	pageLoading: boolean = false;
	rounds: Array<Round> = [];

	constructor(
		private router: Router,
		private alerts: AlertsComponent,
		private hService: HiringService,
		public utilities: UtilitiesService
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.hService.loadHiringRounds().subscribe({
			next: (data) => {
				this.pageLoading = false;

				for (let i = 0; i < data.rounds.length; i++) {
					let c_round = data.rounds[i];

					c_round.start_date = new Date(c_round.start_date);
					c_round.end_date = new Date(c_round.end_date);
				}

				this.rounds = data.rounds;
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	nav(r_id: string) {
		this.router.navigate(['/hiring', 'hiring-rounds', r_id]);
	}
}
