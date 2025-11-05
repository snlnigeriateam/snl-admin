import { Component } from '@angular/core';
import { AccessLevel, Department, Position, Role } from '../interfaces';
import { Router } from '@angular/router';
import { Staff } from '../staff';
import { Alerts } from '../alerts/alerts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Loading } from '../loading/loading';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatSelectModule, Loading, MatButtonModule],
  templateUrl: './add-admin.html',
  styleUrl: './add-admin.scss',
})
export class AddAdmin {
pageLoading: boolean = false;
	loaded: boolean = false;
	createLoading: boolean = false;

	positions: Array<Position> = [];
	access_levels: Array<AccessLevel> = [];
	departments: Array<Department> = [];
	administrators: Array<Admin> = [];

	f_name: string = '';
	l_name: string = '';
	username: string = '';
	p_email: string = '';
	c_email: string = '';
	c_email_preferred: boolean = true;
	phone: string = '';
	access_level: string = '';
	p_id: string = '';
	d_id: string = '';
	s_id: string = '';

	constructor(
		private sService: Staff,
		private alerts: Alerts,
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
					this.access_levels = data.access_levels;
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

						// for(let k = 0; k<this.access_levels.length; k++){
						// 	let role = this.access_levels[k];

						// 	if(role.tier === admin.tier){
						// 		admin.role = role;
						// 		break;
						// 	}
						// }
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

		if (!this.username || !this.f_name || !this.l_name || !this.p_email || !this.c_email || !this.phone || !this.p_id || !this.d_id || !this.s_id || !this.access_level) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.username) || wsp.test(this.f_name) || wsp.test(this.l_name) || wsp.test(this.p_email) || wsp.test(this.c_email) || wsp.test(this.phone) || wsp.test(this.p_id) || wsp.test(this.d_id) || wsp.test(this.s_id) || wsp.test(this.access_level)) {
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
		this.sService.createAdministrator(this.username, this.f_name, this.l_name, this.p_email, this.c_email, this.c_email_preferred, this.phone, this.access_level, this.p_id, this.d_id, this.s_id).subscribe({
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
