import { Component } from '@angular/core';
import { AlertsComponent } from '../alerts/alerts.component';
import { HiringService } from '../hiring.service';
import { Position } from '../interfaces.service';

@Component({
	selector: 'app-positions',
	templateUrl: './positions.component.html',
	styleUrl: './positions.component.scss'
})
export class PositionsComponent {
	pageLoading: boolean = false;
	positions: Array<Position> = [];

	constructor(
		private alerts: AlertsComponent,
		private hService: HiringService
	) {
		this.load();
	}

	load(){
		this.pageLoading = true;
		this.hService.loadPositions().subscribe({
			next: (data)=>{
				this.pageLoading = false;
				
				if(data.success){
					for(let i = 0; i<data.positions.length; i++){
						let c_pos = data.positions[i];

						this.positions.push(c_pos);
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
