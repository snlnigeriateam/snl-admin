import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AddressService {
	// SERVER_ADDRESS: string = 'https://space-park.herokuapp.com';
	// SITE_ADDRESS: string = 'https://spacepark.com';

	// SERVER_ADDRESS: string = "https://space-park.herokuapp.com";
	// SITE_ADDRESS: string = "https://stirring-crepe-d2b5cf.netlify.app";

	SERVER_ADDRESS: string = 'http://192.168.0.124:9100';
	SITE_ADDRESS: string = "http://192.168.0.124:9700";
	SUPPORT_EMAIL: string = "support@snlglobal.net";
	SECURE_KEY: string = "FLWSECK-";

	constructor() {
	}

	getApi() {
		return this.SERVER_ADDRESS;
	}

	getAddress() {
		return this.SITE_ADDRESS;
	}
}
