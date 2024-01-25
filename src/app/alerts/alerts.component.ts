import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
	selector: 'app-alerts',
	templateUrl: './alerts.component.html',
	styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
	constructor(
		private dialog: MatDialog,
	) { }

	ngOnInit(): void {
	}

	public alert(text: string, err: boolean) {
		this.dialog.open(AlertDialogComponent, { data: { content: text, error: err } });
	}

	public confirm(text: string): Promise<boolean> {
		let dRef = this.dialog.open(ConfirmDialogComponent, { data: text });
		return new Promise((resolve, reject) => {
			dRef.afterClosed().subscribe({
				next: (data) => {
					resolve(data);
				}, error: (err) => {
					reject(err);
				}
			});
		});
	}
}
