import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Alerts } from '../alerts/alerts';
import { Hiring } from '../hiring';
import { Utilities } from '../utilities';
import { MatIconModule } from '@angular/material/icon';
import { Loading } from '../loading/loading';
import { MatButtonModule } from '@angular/material/button';

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
	imports: [RouterLink, MatIconModule, Loading, MatButtonModule],
	templateUrl: './hiring-rounds.html',
	styleUrl: './hiring-rounds.scss',
})
export class HiringRounds {
	pageLoading: boolean = false;
	rounds: Array<Round> = [];

	constructor(
		private router: Router,
		private alerts: Alerts,
		private hService: Hiring,
		public utilities: Utilities
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
