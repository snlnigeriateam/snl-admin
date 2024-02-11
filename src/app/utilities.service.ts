import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UtilitiesService {

	constructor() { }

	timing(d: Date) {
		let now = new Date();
		let then = new Date(d);

		let diff = now.getTime() - then.getTime();
		let finalTime = '';

		if (diff < 5000) {
			finalTime = "Just Now";
		}
		else if (diff >= 5000 && diff < 60000) {
			finalTime = `${Math.round(diff / 1000)}s ago`;
		}
		else if (diff >= 60000 && diff < 3600000) {
			finalTime = `${Math.round(diff / 60000)}m ago`;
		}
		else if (diff >= 3600000 && diff < 7200000) {
			finalTime = `1h ago`;
		}
		else {
			finalTime = this.default(then, now);
		}

		return finalTime;
	}

	default(d: Date, now: Date) {
		let hour = d.getHours();
		let minute = d.getMinutes();
		let hString = hour.toString();
		let mString = minute.toString();

		let suffix: string;

		if ((hour) < 12) {
			suffix = 'AM';
		}
		else {
			hString = String(hour - 12);
			suffix = 'PM';
		}

		if (minute < 10) {
			mString = '0' + minute;
		}
		if (hour - 12 === 0 || hour === 0) {
			hString = '12';
		}

		let fullTime = hString + ":" + mString + " " + suffix;

		let day = d.getDay();
		let month = d.getMonth();
		let date = d.getDate();
		let year = d.getFullYear();

		let daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		let monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		let f_day;
		let f_month;

		f_day = daysArr[day];
		f_month = monthsArr[month];
		let separator = ','

		let fullDate = `${f_month} ${date}, ${year}`;

		if (now.getFullYear() === d.getFullYear()) {
			let dateDiff = Math.abs(now.getDate() - d.getDate());
			if (now.getMonth() === d.getMonth() && dateDiff < 7) {
				fullDate = `${f_day}`;
			}
			else {
				fullDate = `${f_month} ${date}`;
			}
		}
		else {
			separator = ';'
		}


		return `${fullDate}${separator} ${fullTime}`;
	}


	dateFn(d: Date, con: Boolean) {
		let month = d.getMonth();
		let date = d.getDate();
		let year = d.getFullYear();

		let monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let conMonthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		let f_month: string;

		if (con) {
			f_month = conMonthsArr[month];
		}
		else {
			f_month = monthsArr[month];
		}

		let fullDate = `${f_month} ${date}, ${year}`;
		return fullDate;
	}

	dateTimeFn(d: Date, con: Boolean) {
		let month = d.getMonth();
		let date = d.getDate();
		let year = d.getFullYear();

		let monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let conMonthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		let f_month: string;

		if (con) {
			f_month = conMonthsArr[month];
		}
		else {
			f_month = monthsArr[month];
		}

		let hour = d.getHours();
		let minute = d.getMinutes();
		let suffix = 'AM';

		if (hour > 12) {
			hour -= 12;
		}

		if (hour >= 12) {
			suffix = 'PM'
		}

		let hString = hour.toString();
		let mString = minute.toString();

		if (minute < 10) {
			mString = `0${mString}`;
		}

		let fullDate = `${f_month} ${date}, ${year}`;
		let fullTime = `${hString}:${mString} ${suffix}`;

		return { date: fullDate, time: fullTime };
	}

	format_float(number_str: string) {
		let trailing_index = number_str.indexOf('.');
		let trailing = '.00';
		if (trailing_index > -1) {
			trailing = number_str.slice(trailing_index);
			number_str = number_str.slice(0, trailing_index);
		}

		let indices = [];
		let lt = number_str.length;
		let fin_str = '';
		if (lt > 3) {
			let end = false;
			let e_index = lt;
			while (!end) {
				let tmp_str = number_str.slice(0, e_index);
				let tmp_index = this.mini_format(tmp_str);
				indices.push(tmp_index);
				let fin_str = tmp_str.slice(0, tmp_index);
				if (fin_str.length > 3) {
					e_index = tmp_index;
				}
				else {
					end = true;
				}
			}
		}

		indices.reverse();
		let start_index = 0;
		for (let i = 0; i <= indices.length; i++) {
			fin_str += number_str.slice(start_index, indices[i]);
			start_index = indices[i];
			if (i !== indices.length) {
				fin_str += ',';
			}
		}

		return fin_str += trailing;
	}

	mini_format(num_str: string) {
		let m_lt = num_str.length;
		return m_lt - 3;
	}
}
