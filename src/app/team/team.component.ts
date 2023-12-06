import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-team',
	templateUrl: './team.component.html',
	styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
	t_1: string = `
	Lanre is the Managing Director of SNL Nigeria.
	He's an avid aerospace enthusiast with 20 years of technical and leadership experience in aerospace, aviation,
	and defense industries across Africa, Europe, and the United States. He is an alum of Kingston University, UK;
	George Washington University, USA; and University of Michigan, Ann Arbor, USA. He is also a senior member of
	multiple Aerospace and Aviation professional bodies.
	<br><br>
	Lanre's interests in aerospace and science more broadly spring from his desire to see everyday people improve
	through the many applications of science to modern-day society. He is a practical thinker who is mission-minded
	and enjoys well-earned time off with his wife and 3 kids.
	`;
	t_2: string = `
	
	`;

	t_3: string = `
	Wale Sanya is the Director of Operations at SNL Nigeria.
	He manages the day to day activities of the establishment and oversees other departments of our organisation
	<br><br>
	Wale is a published COREN certified engineer who holds a bachelor's degree from the University of Ilorin and a
	Masters Degree in Mechanical Engineering from Federal University of Technology, Minna.
	<br><br>
	Wale believes in dignity, honesty, humanity, dedication and professionalism.
	He is passionate about success, people's welfare, and learning; he also enjoys reading as well as watching
	and playing football.
	`;
	
	t_4: string = `
	Bamkat Ephraim Musa is the Project Architect at SNL Nigeria. He works on general building construction
	at SNL Nigeria.
	<br><br>
	Bamkat is a graduate of architecture with the University of Jos, Nigeria, and has worked on various federal and state
	projects. He believes in using advanced solutions to bring about global change and having to explore potentials to
	attain maximum satisfaction. He's passionate about advanced technology bringing simplicity into day to day living.
	<br><br>
	In his spare time, he enjoys cycling as well as playing basketball and the drums.
	`;

	t_5: string = `
	Makan King David coordinates Media and IT endeavours at SNL Nigeria. From sonic and visual elements to
	things going on in the background that make what we do work. He's a jack of all trades and an adept master of one or
	two.
	<br><br>
	He has worked in the media industry for over 15 years in various capacities. In between, he has picked up a degree in
	Information Technology and has added work in mobile design, web design, and digital marketing as well as an
	international publication.
	<br><br>
	Makan strongly believes that people should be at the centre of everything we do, which is why creating the most immersive
	human experiences is all he's dedicated his life to. There's a laundry list of things he has been part of, and looks
	forward to being part of work that embodies this belief. He looks forward to having the most meaningful fun with as many people as possible.
	`;

	t_6: string = `
	Daniel Sule is the Lead Software Developer at SNL Nigeria. His job includes managing and working on the
	various digital properties managed by SNL Nigeria, including this one ;) as well as managing other developers on our Team.
	<br><br>
	Daniel holds a degree in Computer Science from the University of Jos, Nigeria and followed his current path
	from then on. He works as Lead Software Developer/Founder of Nucleus Technologies, Nigeria, overseeing the
	development and release of in-house and client projects.
	<br><br>
	Daniel has always been fascinated by the idea of science being used for the benefit of the common man. The fact that
	advances in technology have democratized innovation in addition to being a huge part of his story, gives him hope for
	the strides we can make going forward. That, after all, is what SNL Nigeria stands for.
	`;
	// elements: Array<string> = ['h1', 'h2', 'h3', 'h4'];

	constructor() { }

	ngOnInit(): void {
		// let docElements: Array<HTMLElement | null> = [];
		// this.elements.forEach((el)=>{
		// 	docElements.push(document.getElementById(el));
		// });

		// let defOffset = window.innerHeight;

		// document.addEventListener('scroll', (ev)=>{
		// 	docElements.forEach((el)=>{
		// 		if(el){
		// 			let yOffset = el.getBoundingClientRect().y;
		// 			if(yOffset < defOffset && yOffset > 0){
		// 				//should be in view
		// 				if(el.style.position != 'sticky'){
		// 					el.style.position = 'sticky';
		// 				}
		// 			}
		// 			else {
		// 				//should not be in view
		// 				if(el.style.position == 'sticky'){
		// 					el.style.position = 'relative';
		// 				}
		// 			}
		// 		}
		// 	})
		// });
	}
}
