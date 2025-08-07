import { Component } from '@angular/core';
import { StaffService } from '../staff.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Router } from '@angular/router';
import { Role, Position, Department, AccessLevel } from '../interfaces.service';

interface Admin {
	a_id: string,
	tier: number,
	f_name: string,
	l_name: string,
	role: Role,
	access_level: string,
	position: Position,
	d_id: string,
	s_id: string,
	active: boolean
}

@Component({
	selector: 'app-manage-personnel',
	templateUrl: './manage-personnel.component.html',
	styleUrl: './manage-personnel.component.scss'
})
export class ManagePersonnelComponent {
	a_id: string;
	admin?: Admin;

	pageLoading: boolean = false;
	loaded: boolean = false;
	updateLoading: boolean = false;

	positions: Array<Position> = [];
	access_levels: Array<AccessLevel> = [];
	departments: Array<Department> = [];
	administrators: Array<Admin> = [];

	tier: number = 6;
	access_level: string = '';
	p_id: string = '';
	d_id: string = '';
	s_id: string = '';

	constructor(
		private sService: StaffService,
		private alerts: AlertsComponent,
		private router: Router
	) {
		this.a_id = this.router.parseUrl(this.router.url).root.children['primary'].segments[2].path;
		this.load();
	}

	load() {
		this.pageLoading = true;
		this.sService.loadCreateAdmin().subscribe({
			next: (data) => {
				if (data.success) {
					this.positions = data.positions;
					this.departments = data.departments;
					this.access_levels = data.access_levels;
					let tmp_admins = data.administrators;

					for (let i = 0; i < tmp_admins.length; i++) {
						let admin = tmp_admins[i];

						for (let j = 0; j < this.positions.length; j++) {
							let pos = this.positions[j];

							if (pos.p_id === admin.p_id) {
								admin.position = pos;
								break;
							}
						}

						// for (let k = 0; k < this.roles.length; k++) {
						// 	let role = this.roles[k];

						// 	if (role.tier === admin.tier) {
						// 		admin.role = role;
						// 		break;
						// 	}
						// }
						this.administrators.push(admin);
					}

					this.sService.loadAdministrator(this.a_id).subscribe({
						next: (data) => {
							this.pageLoading = false;

							if (data.success) {
								let tmp_admin = data.administrator;

								for (let l = 0; l < this.positions.length; l++) {
									let pos = this.positions[l];

									if (pos.p_id === tmp_admin.p_id) {
										tmp_admin.position = pos;
										break;
									}
								}
								this.admin = tmp_admin;
								this.p_id = this.admin!.position.p_id;
								this.access_level = this.admin!.access_level;
								this.d_id = this.admin!.d_id;
								this.s_id = this.admin!.s_id;
								this.tier = this.admin!.tier;

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

	updateAdmin() {
		if (!this.p_id || !this.d_id || !this.s_id) {
			this.alerts.alert("All fields are required", true);
		}
		else {
			this.updateLoading = true;
			this.sService.updateStaff(this.a_id, this.s_id, this.access_level, this.p_id, this.d_id).subscribe({
				next: (data) => {
					this.updateLoading = false;

					if (data.success) {
						this.alerts.alert("Update Successful!", false);
					}
					else {
						this.alerts.alert(data.reason, true);
					}
				},
				error: () => {
					this.updateLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}
}
