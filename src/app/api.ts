import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class Api {
	api: string = environment.apiURL;
	token: any = '';

	constructor(
		private http: HttpClient,
	){}

	request(path: string, method: string, body?: any): Observable<any> {
        this.token = localStorage.getItem('token');
        if (this.token) {
            if (method === 'post') {
                return this.http.post(`${this.api}/snlg/${path}`, body, { headers: { Authorization: `Bearer ${this.token}` } });
            }
            else {
                return this.http.get(`${this.api}/snlg/${path}`, { headers: { Authorization: `Bearer ${this.token}` } });
            }
        }
        else {
            if (method === 'post') {
                return this.http.post(`${this.api}/snlg/${path}`, body);
            }
            else {
                return this.http.get(`${this.api}/snlg/${path}`);
            }
        }
    }

    userRequest(path: string, method: string, body?: any): Observable<any> {
        if (method === 'post') {
            return this.http.post(`${this.api}/${path}`, body);
        }
        else {
            return this.http.get(`${this.api}/${path}`);
        }
    }

    fileRequest(path: string, method: string, body?: any): Observable<any> {
        this.token = localStorage.getItem('token');
        if (this.token) {
            if (method === 'post') {
                return this.http.post(`${this.api}/snlg/${path}`, body, { headers: { Authorization: `Bearer ${this.token}` }, responseType: 'blob' as 'json' });
            }
            else {
                return this.http.get(`${this.api}/snlg/${path}`, { headers: { Authorization: `Bearer ${this.token}` }, responseType: 'blob' as 'json' });
            }
        }
        else {
            if (method === 'post') {
                return this.http.post(`${this.api}/snlg/${path}`, body);
            }
            else {
                return this.http.get(`${this.api}/snlg/${path}`);
            }
        }
    }
}
