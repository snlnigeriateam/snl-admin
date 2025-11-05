import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

interface alert {
	content: string,
	error: boolean
}

@Component({
	selector: 'app-alert-dialog',
	imports: [MatDialogModule, MatButtonModule],
	templateUrl: './alert-dialog.html',
	styleUrl: './alert-dialog.scss',
})
export class AlertDialog {
	constructor(
		public dialogRef: MatDialogRef<AlertDialog>,
		@Inject(MAT_DIALOG_DATA) public data: alert
	) { }

	ngOnInit(): void {
	}

	close() {
		this.dialogRef.close();
	}
}
