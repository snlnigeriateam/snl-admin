import { Component } from '@angular/core';

@Component({
	selector: 'app-footer',
	imports: [],
	templateUrl: './footer.html',
	styleUrl: './footer.scss',
})
export class Footer {
	year: string;

	constructor() {
		this.year = new Date().getFullYear().toString();
	}

	ngOnInit(): void {
	}
}
