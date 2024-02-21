import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { HiringService } from '../hiring.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { UtilitiesService } from '../utilities.service';
import { Title } from '@angular/platform-browser';

interface Round {
	name: string,
	special: boolean,
	positions: Array<Position>,
	start_date: String,
	end_date: String,
	r_id: string,
	p_ids: Array<string>,
	open: boolean,
	url: string
}

interface Position {
	p_id: string,
	name: string,
	segments: Array<Segment>,
}

interface Segment {
	format: string,
	text: string
}

@Component({
	selector: 'app-hiring-round',
	templateUrl: './hiring-round.component.html',
	styleUrl: './hiring-round.component.scss'
})
export class HiringRoundComponent {
	r_id: string;
	pageLoading: boolean = false;
	loaded: boolean = false;
	closeLoading: boolean = false;

	round: Round = {
		name: '',
		special: false,
		positions: [],
		start_date: '',
		end_date: '',
		r_id: '',
		p_ids: [],
		open: false,
		url: ''
	};

	constructor(
		private router: Router,
		private alerts: AlertsComponent,
		private hService: HiringService,
		private clipboard: Clipboard,
		private utilities: UtilitiesService,
		private title: Title
	) {
		this.r_id = this.router.parseUrl(this.router.url).root.children['primary'].segments[2].path;
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.hService.loadHiringRound(this.r_id).subscribe({
			next: (data) => {
				if (data.success) {
					let c_round = data.hiring_round;
					let positions = data.positions;

					c_round.start_date = this.utilities.dateFn(new Date(c_round.start_date), false);
					c_round.end_date = this.utilities.dateFn(new Date(c_round.end_date), false);

					for(let i = 0; i < c_round.positions.length; i++){
						let c_pos = c_round.positions[i];

						for(let j = 0; j<positions.length; j++){
							if(positions[j].p_id === c_pos.p_id){
								c_pos.name = positions[j].name;
							}
						}

						for(let k = 0; k<c_pos.segments.length; k++){
							let c_seg = c_pos.segments[k];
							c_seg.text = c_seg.text.replace(/\n/g, '<br>');
						}
					}

					this.round = c_round;
					this.title.setTitle(`${this.round.name} - Hiring | SNL Nigeria Insiders`);
					this.pageLoading = false;
					this.loaded = true;
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	copyUrl() {
		let copied = this.clipboard.copy(this.round.url);
		if(copied){
			this.alerts.alert("URL Copied to Clipboard", false);
		}
	}

	confirmClose() {
		this.alerts.confirm("Do you want to close this Hiring Round? This Action cannot be undone").then((close) => {
			if (close) {
				this.closeRound();
			}
		});
	}

	closeRound() {
		this.closeLoading = true;
		this.hService.closeHiringRound(this.r_id).subscribe({
			next: (data) => {
				if (data.success) {
					this.closeLoading = false;

					this.round.open = false;
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.closeLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	view() {
		this.router.navigate(['/hiring', 'hiring-rounds', this.r_id, 'applications']);
	}
}
