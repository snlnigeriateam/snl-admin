import { Injectable } from '@angular/core';
import { Api } from './api';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class Departments {
	constructor(
		private request: Api
	) { }

	loadDepartments(): Observable<any> {
		return this.request.request('departments', 'get');
	}

	loadDepartment(d_id: string): Observable<any> {
		return this.request.request('departments/department', 'post', { d_id: d_id });
	}

	createDepartment(name: string): Observable<any> {
		return this.request.request('departments/create-department', 'post', { name: name });
	}

	updateDepartment(d_id: string, name: string, head: string): Observable<any> {
		return this.request.request('departments/update-department', 'post', { d_id: d_id, name: name, head: head });
	}

	removeDepartment(d_id: string): Observable<any> {
		return this.request.request('departments/remove-department', 'post', { d_id: d_id });
	}
}
