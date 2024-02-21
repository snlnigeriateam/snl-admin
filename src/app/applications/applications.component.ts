import { Component } from '@angular/core';
import { AlertsComponent } from '../alerts/alerts.component';
import { HiringService } from '../hiring.service';
import { UtilitiesService } from '../utilities.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

interface Application {
	a_id: string,
	f_name: string,
	l_name: string,
	o_name: string,
	applied_on: Date,
	email: string,
	address: string,
	p_id: string,
	phone: string,
	r_id: string,
	ref_id: string,
	uri: string
}

@Component({
	selector: 'app-applications',
	templateUrl: './applications.component.html',
	styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
	r_id: string;

	pageLoading: boolean = false;
	loaded: boolean = false;

	viewing: boolean = false;

	round_name: string = '';
	applications: Array<Application> = [];
	selApp!: Application;

	constructor(
		private alerts: AlertsComponent,
		private hService: HiringService,
		public utilities: UtilitiesService,
		private clipboard: Clipboard,
		private router: Router,
		private title: Title
	){
		this.r_id = this.router.parseUrl(this.router.url).root.children['primary'].segments[2].path;
		this.load();
	}

	nav(index: number){
		this.selApp = this.applications[index];
		this.viewing = true;
	}

	load(){
		this.pageLoading = true;
		this.hService.loadApplications(this.r_id).subscribe({
			next: (data) => {
				if (data.success) {
					let applications = data.applications;
					this.round_name = data.round_name;
					this.title.setTitle(`${this.round_name} - Applications | SNL Nigeria Insiders`)
					let positions = data.positions;

					for(let i = 0; i<applications.length; i++){
						let c_app = applications[i];
						c_app.applied_on = new Date(c_app.applied_on);
						
						for(let j = 0; j<positions.length; j++){
							if(positions[j].p_id === c_app.p_id){
								c_app.p_id = positions[j].name;
							}
						}
					}
					this.applications = applications;
					
					this.title.setTitle(`${this.round_name} - Hiring | SNL Nigeria Insiders`);
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

	copyAdd() {
		let copied = this.clipboard.copy(this.selApp!.email);
		if(copied){
			this.alerts.alert("Email Address Copied to Clipboard", false);
		}
	}

	copyPhone() {
		let copied = this.clipboard.copy(this.selApp!.phone);
		if(copied){
			this.alerts.alert("Phone Number Copied to Clipboard", false);
		}
	}

	download(){
		// const link = document.createElement('a');
        // if (link.download !== undefined) {
        //     // Browsers that support HTML5 download attribute
        //     const url = URL.createObjectURL(blob);
        //     link.setAttribute('href', url);
        //     link.setAttribute('download', filename);
        //     link.style.visibility = 'hidden';
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        // }
		window.open(this.selApp!.uri, '_blank');
	}
}
