import { Component } from '@angular/core';
import { Alerts } from '../alerts/alerts';
import { Utilities } from '../utilities';
import { Support } from '../support';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { Loading } from '../loading/loading';
import { MatButtonModule } from '@angular/material/button';

interface Query {
	query: string,
	nature: number,
	nature_val: string,
	resolved: boolean,
	assigned_on: any,
	assigned: boolean,
	assigned_to: boolean,
	name: string,
	phone: string,
	q_id: string,
	email: string,
	on: Date,
	website: string,
}

@Component({
	selector: 'app-queries',
	imports: [MatIconModule, Loading, MatButtonModule],
	templateUrl: './queries.html',
	styleUrl: './queries.scss',
})
export class Queries {
	pageLoading: boolean = false;
	loaded: boolean = false;

	queries: Array<Query> = [];

	selQuery!: Query;
	viewing: boolean = false;

	constructor(
		private alerts: Alerts,
		public utilities: Utilities,
		private sService: Support,
		private clipboard: Clipboard
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.sService.loadQueries().subscribe({
			next: (data) => {
				if (data.success) {
					let queries = data.queries;

					for (let i = 0; i < queries.length; i++) {
						let c_query = queries[i];
						c_query.on = new Date(c_query.on);
						c_query.nature_val = "";

						switch (c_query.nature) {
							case 1:
								c_query.nature_val = "General Inquiries";
								break;
							case 2:
								c_query.nature_val = "Consultation";
								break;
							case 3:
								c_query.nature_val = "Press";
								break;

							default:
								break;
						}
						if (c_query.resolved) {
							c_query.resolved_on = new Date(c_query.resolved_on);
						}
					}
					this.queries = queries;
					this.pageLoading = false;
					this.loaded = true;
				}
				else {
					this.pageLoading = false;
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	nav(index: number) {
		this.selQuery = this.queries[index];
		this.viewing = true;
	}

	copyAdd() {
		let copied = this.clipboard.copy(this.selQuery!.email);
		if (copied) {
			this.alerts.alert("Email Address Copied to Clipboard", false);
		}
	}

	copyPhone() {
		let copied = this.clipboard.copy(this.selQuery!.phone);
		if (copied) {
			this.alerts.alert("Phone Number Copied to Clipboard", false);
		}
	}
}
