import { Component } from '@angular/core';
import { StaffService } from '../staff.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router } from '@angular/router';
import { Department, Position, Role } from '../interfaces.service';

interface Admin {
	a_id: string,
	tier: number,
	f_name: string,
	l_name: string,
	role: Role,
	position: Position
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
	departments: Array<Department> = [];
	administrators: Array<Admin> = [];

	f_name: string = '';
	l_name: string = '';
	username: string = '';
	p_email: string = '';
	c_email: string = '';
	c_email_preferred: boolean = true;
	phone: string = '';
	tier: number = 6;
	p_id: string = '';
	d_id: string = '';
	s_id: string = '';

	constructor(
		private sService: StaffService,
		private alerts: AlertsComponent,
		private router: Router
	) {
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.sService.loadCreateAdmin().subscribe({
			next: (data) => {
				this.pageLoading = false;

				if (data.success) {
					this.positions = data.positions;
					this.departments = data.departments;
					let tmp_admins = data.administrators;

					for(let i = 0; i<tmp_admins.length; i++){
						let admin = tmp_admins[i];

						for(let j = 0; j < this.positions.length; j++){
							let pos = this.positions[j];

							if(pos.p_id === admin.p_id){
								admin.position = pos;
								break;
							}
						}

						for(let k = 0; k<this.roles.length; k++){
							let role = this.roles[k];

							if(role.tier === admin.tier){
								admin.role = role;
								break;
							}
						}
						this.administrators.push(admin);
					}

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

		if (!this.username || !this.f_name || !this.l_name || !this.p_email || !this.c_email || !this.phone || !this.p_id || !this.d_id || !this.s_id) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.username) || wsp.test(this.f_name) || wsp.test(this.l_name) || wsp.test(this.p_email) || wsp.test(this.c_email) || wsp.test(this.phone) || wsp.test(this.p_id) || wsp.test(this.d_id) || wsp.test(this.s_id)) {
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
		this.sService.createAdministrator(this.username, this.f_name, this.l_name, this.p_email, this.c_email, this.c_email_preferred, this.phone, this.tier, this.p_id, this.d_id, this.s_id).subscribe({
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
