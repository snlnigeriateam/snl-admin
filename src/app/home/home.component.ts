import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		this.scrollTrigger('.sect', {
			rootMargin: '-100px'
		});
	}

	scrollTrigger(selector: string, options = {}) {
		// Multiple elements can have same class/selector,
		// so we are using querySelectorAll
		let els = document.querySelectorAll(selector);
		// The above `querySelectorAll` returns a nodeList,
		// so we are converting it to an array
		// els = Array.from(els)
		// Now we are iterating over the elements in the array
		els.forEach(el => {
			// `addObserver function` will attach the IntersectionObserver to the element
			// We will create this function next
			this.addObserver(el, options);
		});
	}

	addObserver(el: Element, options: IntersectionObserverInit) {
		// Check if `IntersectionObserver` is supported
		if (!('IntersectionObserver' in window)) {
			// Simple fallback
			// The animation/callback will be called immediately so
			// the scroll animation doesn't happen on unsupported browsers
			el.classList.add('active');
			// We don't need to execute the rest of the code
			return
		}
		// We are creating a new IntersectionObserver instance
		let observer = new IntersectionObserver((entries, observer) => { // This takes a callback function that receives two arguments: the elements list and the observer instance.
			entries.forEach(entry => {
				// `entry.isIntersecting` will be true if the element is visible
				if (entry.isIntersecting) {
					entry.target.classList.add('active');
					// We are removing the observer from the element after adding the active class
					observer.unobserve(entry.target)
				}
			});
		}, options);
		// Adding the observer to the element
		observer.observe(el);
	}
}
