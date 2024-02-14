import { Component } from '@angular/core';
import { HiringService } from '../hiring.service';
import { StaffService } from '../staff.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router } from '@angular/router';

interface Position {
	name: string,
	description: string,
	p_id: string,
	unique: boolean
}

interface Role {
	name: string,
	tier: number
}

@Component({
	selector: 'app-add-admin',
	templateUrl: './add-admin.component.html',
	styleUrl: './add-admin.component.scss'
})

export class AddAdminComponent {
	pageLoading: boolean = false;
	loaded: boolean = false;
	createLoading: boolean = false;

	positions: Array<Position> = [];
	roles: Array<Role> = [
		{
			name: 'Executive',
			tier: 1
		},
		{
			name: 'Director',
			tier: 2
		},
		{
			name: 'Manager',
			tier: 3
		},
		{
			name: 'Senior Staff',
			tier: 4
		},
		{
			name: 'Junior Staff',
			tier: 5
		},
		{
			name: 'Support Staff',
			tier: 6
		}
	];

	f_name: string = '';
	l_name: string = '';
	username: string = '';
	p_email: string = '';
	c_email: string = '';
	c_email_preferred: boolean = true;
	phone: string = '';
	tier: number = 6;
	p_id: string = '';

	constructor(
		private hService: HiringService,
		private sService: StaffService,
		private alerts: AlertsComponent,
		private router: Router
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.hService.loadPositions().subscribe({
			next: (data) => {
				this.pageLoading = false;

				if (data.success) {
					this.positions = data.positions;
					this.loaded = true;
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	validate() {
		let wsp = /^\s*$/;

		if (!this.username || !this.f_name || !this.l_name || !this.p_email || !this.c_email || !this.phone || !this.p_id) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.username) || wsp.test(this.f_name) || wsp.test(this.l_name) || wsp.test(this.p_email) || wsp.test(this.c_email) || wsp.test(this.phone) || wsp.test(this.p_id)) {
			this.alerts.alert("All fields are required", true);
		}
		else {
			let index = this.c_email.indexOf('@');
			if(index !== -1){
				this.c_email = this.c_email.slice(0, index);
			}
			this.create();
		}
	}

	create() {
		this.createLoading = true;
		this.sService.createAdministrator(this.username, this.f_name, this.l_name, this.p_email, this.c_email, this.c_email_preferred, this.phone, this.tier, this.p_id).subscribe({
			next: (data) => {
				this.createLoading = false;
				if (data.success) {
					this.alerts.alert("Administrator Account Provisioned", false);
					this.router.navigate(['/staff']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.createLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
