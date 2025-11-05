import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from '../alert-dialog/alert-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
	selector: 'app-alerts',
	imports: [],
	templateUrl: './alerts.html',
	styleUrl: './alerts.scss',
})
export class Alerts {
	constructor(
		private dialog: MatDialog,
	) { }

	ngOnInit(): void {
	}

	public alert(text: string, err: boolean) {
		this.dialog.open(AlertDialog, { data: { content: text, error: err } });
	}

	public confirm(text: string): Promise<boolean> {
		let dRef = this.dialog.open(ConfirmDialog, { data: text });
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
