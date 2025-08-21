import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEvent } from '../interfaces.service';

@Component({
	selector: 'app-calendar-dialog',
	templateUrl: './calendar-dialog.component.html',
	styleUrl: './calendar-dialog.component.scss'
})
export class CalendarDialogComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<CalendarDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { event: ViewEvent, access_levels: Array<string> }
	) { }

	ngOnInit(): void {
	}

	close() {
		this.dialogRef.close();
	}

}
