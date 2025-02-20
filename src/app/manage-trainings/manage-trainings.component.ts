import { Component } from '@angular/core';
import { TrainingsService } from '../trainings.service';
import { AlertsComponent } from '../alerts/alerts.component';
import { Training } from '../interfaces.service';

@Component({
	selector: 'app-manage-trainings',
	templateUrl: './manage-trainings.component.html',
	styleUrl: './manage-trainings.component.scss'
})
export class ManageTrainingsComponent {
	pageLoading: boolean = false;
	trainings: Array<Training> = [];

	constructor(
		private tService: TrainingsService,
		private alerts: AlertsComponent
	){
		this.load();
	}

	load(){
		this.pageLoading = true;
		this.tService.loadTrainings().subscribe({
			next: (data)=>{
				this.pageLoading = false;
				
				if(data.success){
					for(let i = 0; i<data.trainings.length; i++){
						let c_training = data.trainings[i];

						this.trainings.push(c_training);
					}
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: ()=>{
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
