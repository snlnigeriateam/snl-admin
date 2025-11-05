import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ViewEvent } from '../interfaces';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-calendar-dialog',
	imports: [MatDialogModule, MatCardModule, DatePipe, MatButtonModule],
	templateUrl: './calendar-dialog.html',
	styleUrl: './calendar-dialog.scss',
})

export class CalendarDialog {
	constructor(
		public dialogRef: MatDialogRef<CalendarDialog>,
		@Inject(MAT_DIALOG_DATA) public data: { event: ViewEvent, access_levels: Array<string> }
	) { }

	ngOnInit(): void {
	}

	close() {
		this.dialogRef.close();
	}
}
