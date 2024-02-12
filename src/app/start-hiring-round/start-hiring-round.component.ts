import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsComponent } from '../alerts/alerts.component';
import { HiringService } from '../hiring.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface Position {
	name: string,
	description: string,
	p_id: string,
	unique: boolean
}

interface Segment {
	s_id: number,
	p_id: string,
	position: Position,
	compartments: Array<Compartment>
}

interface Compartment {
	text: string,
	format: string,
	html: string,
}

interface Style {
	title: string,
	class: string
}

@Component({
	selector: 'app-start-hiring-round',
	templateUrl: './start-hiring-round.component.html',
	styleUrl: './start-hiring-round.component.scss'
})
export class StartHiringRoundComponent {
	pageLoading: boolean = false;
	createLoading: boolean = false;
	c_seg: number = -1;
	showingSegments: boolean = false;

	positions: Array<Position> = [];
	styles: Array<Style> = [];
	start_date: Date = new Date();
	min_date: Date = new Date();

	name: string = "";
	sel_pos: Array<string> = [];
	duration: number = 10;
	segments: Array<Segment> = [];

	constructor(
		private router: Router,
		private alerts: AlertsComponent,
		private hService: HiringService
	) {
		this.start_date.setDate(this.start_date.getDate() + 2);
		this.min_date.setDate(this.min_date.getDate() + 1);
		this.load();

		this.styles = [
			{
				class: 'f1',
				title: 'Heading 1',
			},
			{
				class: 'f2',
				title: 'Heading 2',
			},
			{
				class: 'f3',
				title: 'Heading 3',
			},
			{
				class: 'c1',
				title: 'Content 1',
			},
			{
				class: 'c2',
				title: 'Content 2',
			},
			{
				class: 'c3',
				title: 'Content 3',
			},
			{
				class: 'c4',
				title: 'Content 4',
			},
		];
	}

	load() {
		this.pageLoading = true;
		this.hService.loadPositions().subscribe({
			next: (data) => {
				this.pageLoading = false;
				if (data.success) {
					this.positions = data.positions;
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.pageLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.start_date = event.value!;
	}

	validateNext() {
		let wsp = /^\s*$/;
		let d = new Date();
		if (!this.name || !this.sel_pos || !this.duration || !this.start_date) {
			this.alerts.alert("All fields are required", true);
		}
		else if (wsp.test(this.name) || this.sel_pos.length === 0 || isNaN(this.duration) || isNaN(this.start_date.getTime())) {
			this.alerts.alert("All fields are required", true);
		}
		else if (this.start_date <= d) {
			this.alerts.alert("Your Start Date must be a date in the future", true);
		}
		else {
			this.segments = [];
			for (let i = 0; i < this.sel_pos.length; i++) {
				let pos_id = -1;
				for (let j = 0; j < this.positions.length; j++) {
					let c_pos = this.positions[j];
					if (c_pos.p_id === this.sel_pos[i]) {
						pos_id = j;
					}
				}
				if (pos_id > -1) {
					this.segments.push({
						s_id: i,
						p_id: this.sel_pos[i],
						position: this.positions[pos_id],
						compartments: []
					});
				}
			}
			this.next();
		}
	}

	next() {
		if (this.segments.length - 1 > this.c_seg) {
			this.showingSegments = true;
			this.c_seg++;
		}
	}

	prev() {
		if (this.c_seg > -1) {
			if (this.c_seg === 0) {
				this.showingSegments = false;
			}
			this.c_seg--;
		}
	}

	addCompartment() {
		this.segments[this.c_seg].compartments.push({
			text: '',
			format: 'c2',
			html: ''
		});
	}

	updateComp(index: number) {
		let text = this.segments[this.c_seg].compartments[index].text;
		this.segments[this.c_seg].compartments[index].html = text.replace(/\n/g, '<br>');
	}

	validateSegment() {
		let seg = this.segments[this.c_seg];
		let wsp = /^\s*$/;

		let valid = true;
		for (let i = 0; i < seg.compartments.length; i++) {
			let comp = seg.compartments[i];
			if (!comp.text || wsp.test(comp.text)) {
				this.alerts.alert("All Text Segments must have content", true);
				valid = false;
			}
		}

		if (seg.compartments.length === 0) {
			valid = false;
			this.alerts.alert("Please add Text Segments to this Job Posting", true);
		}

		if (valid) {
			this.next();
		}
	}

	validate() {
		let segments = [];

		let valid = true;
		let e_text = "";
		for (let i = 0; i < this.segments.length; i++) {
			let c_seg = this.segments[i];
			let wsp = /^\s*$/;
			let final_compartments = [];

			for (let j = 0; j < c_seg.compartments.length; j++) {
				let comp = c_seg.compartments[j];
				if (!comp.text || wsp.test(comp.text)) {
					valid = false;
					e_text = "All Text Segments must have content";
				}
				else {
					final_compartments.push({
						format: comp.format,
						text: comp.text
					});
				}
			}

			if (!c_seg.compartments || c_seg.compartments.length === 0) {
				e_text = "Please add Text Segments to this Job Posting";
				valid = false;
			}
			else {
				let final_segment = {
					p_id: c_seg.p_id,
					segments: final_compartments
				}
				segments.push(final_segment);
			}
		}

		if (!valid) {
			this.alerts.alert(e_text, true);
		}
		else {
			this.createRound(segments);
		}
	}

	private createRound(segments: Array<any>) {
		this.createLoading = true;

		this.hService.startHiringRound(this.name, false, segments, this.duration, this.start_date.getTime()).subscribe({
			next: (data) => {
				this.createLoading = false;
				if (data.success) {
					this.alerts.alert("Hiring Round Created Successfully!", false);
					this.router.navigate(['/hiring', 'hiring-rounds']);
				}
				else {
					this.alerts.alert(data.reason, true);
				}
			},
			error: () => {
				this.createLoading = false;
				this.alerts.alert("Please check your connection", true);
			}
		});
	}
}
