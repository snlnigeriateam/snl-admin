import { Component, Inject } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AccessLevel, Department, Event, User } from '../interfaces';
import { Calendar } from '../calendar';
import { Alerts } from '../alerts/alerts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { Loading } from '../loading/loading';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface InviteGroup {
	name: string;
	value: string;
}

@Component({
	selector: 'app-edit-event',
	imports: [MatFormFieldModule, FormsModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatSelectModule, MatRadioModule, MatCardModule, Loading, MatButtonModule],
	templateUrl: './edit-event.html',
	styleUrl: './edit-event.scss',
})
export class EditEvent {
	saveLoading: boolean = false;

	invite_groups: Array<InviteGroup> = [
		{ name: 'General', value: 'g' },
		{ name: 'Departments', value: 'd' },
		{ name: 'Individuals', value: 'i' }
	];

	event_invite_group: InviteGroup;

	min_date: Date = new Date();
	max_date: Date = new Date(new Date().setMonth(11, 31)); // Set to December 31st of the current year

	constructor(
		public dialogRef: MatDialogRef<EditEvent>,
		private calendarService: Calendar,
		private alerts: Alerts,
		@Inject(MAT_DIALOG_DATA) public data: { event: Event, access_levels: Array<AccessLevel>, departments: Array<Department>, event_types: Array<string>, staff: Array<User> }
	) {
		this.data.event.start_date = new Date(this.data.event.start_date);
		this.data.event.end_date = new Date(this.data.event.end_date);
		this.event_invite_group = this.invite_groups.find((group) => group.value == this.data.event.group) ?? this.invite_groups[0];
	}

	ngOnInit(): void {
	}

	close(reload: boolean) {
		this.dialogRef.close(reload);
	}

	setEventDate(type: string, event: MatDatepickerInputEvent<Date>, start: boolean) {
		if (start) {
			this.data.event.start_date = new Date(event.value!);
			this.data.event.end_date = new Date(event.value!);
		}
		else {
			this.data.event.end_date = new Date(event.value!);
		}
	}

	selectAllLevels() {
		this.data.event.tiers = this.data.access_levels.map(level => level.tier);
	}

	validate() {
		let wsp = /^\s*$/;

		if (!this.data.event.name || wsp.test(this.data.event.name)) {
			this.alerts.alert("Please provide a valid event name", true);
		}
		else if (!this.data.event.start_date || isNaN(this.data.event.start_date.getTime())) {
			this.alerts.alert("Please provide a valid event start date", true);
		}
		else if (!this.data.event.end_date || isNaN(this.data.event.end_date.getTime())) {
			this.alerts.alert("Please provide a valid event end date", true);
		}
		else if (this.data.event.start_date > this.data.event.end_date) {
			this.alerts.alert("Event start date cannot be after the end date", true);
		}
		else if (!this.data.event.type || wsp.test(this.data.event.type)) {
			this.alerts.alert("Please select a valid event type", true);
		}
		else if (this.event_invite_group.value === 'd' && this.data.event.invitees.length === 0) {
			this.alerts.alert("Please select at least one department to invite", true);
		}
		else if (this.event_invite_group.value === 'i' && this.data.event.invitees.length === 0) {
			this.alerts.alert("Please select at least one staff member to invite", true);
		}
		else if (this.data.event.tiers.length === 0 && this.event_invite_group.value !== 'i') {
			this.alerts.alert("Please select at least one Access Level this event applies to", true);
		}
		else {
			this.saveLoading = true;

			this.calendarService.updateEvent(this.data.event.e_id, this.data.event.name, this.data.event.start_date.getTime(), this.data.event.end_date.getTime(), this.data.event.tiers, this.data.event.type, this.data.event.description, this.event_invite_group.value, this.data.event.invitees).subscribe({
				next: (response) => {
					this.saveLoading = false;
					if (response.success) {
						this.alerts.alert("Event updated successfully!", false);
						this.close(true);
					} else if (response.login) {
						this.alerts.alert("Session expired, please log in again", true);
					} else {
						this.alerts.alert(response.reason, true);
					}
				},
				error: () => {
					this.saveLoading = false;
					this.alerts.alert("Please check your connection", true);
				}
			});
		}
	}
}
