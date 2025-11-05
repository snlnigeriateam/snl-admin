import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-dialog',
	imports: [MatDialogModule, MatButtonModule],
	templateUrl: './confirm-dialog.html',
	styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
	constructor(
		@Inject(MAT_DIALOG_DATA) public text: string
	) { }

	ngOnInit(): void {
	}
}
