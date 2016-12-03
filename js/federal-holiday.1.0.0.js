
Date.prototype.addDays = function(days) {
	this.setDate(this.getDate() + parseInt(days));
	return this;
};

function getHolidayByName(holidayList, holidayName) {
	for (var h = 0; h < holidayList.length; h++) {
		if (holidayList[h].name == holidayName) {
			return holidayList[h]; // found
		}
	}
	return undefined; // not found
}

// month is NOT zero indexed like javascript date
function getNthDayOf(n, weekday, month, year) {
	var count = 0, idate = new Date(year, month-1, 1);
	while (true) {
		if (idate.getDay() === weekday) {
			if (++count == n || count > 6) {
				break;
			}
		}
		idate.setDate(idate.getDate() + 1);
	}
	return idate;
}

// month is NOT zero indexed like javascript date
function getLastDayOf(n, weekday, month, year) {
	var count = 0, idate = new Date(year, month, 1).addDays(-1); // get last day of month
	while (true) {
		if (idate.getDay() === weekday) {
			if (++count == n || count > 6) {
				break;
			}
		}
		idate.addDays(-1);
	}
	return idate;
}

function isHoliday(dateVal) {
	const allHolidays = allFederalHolidaysForYear(dateVal.getFullYear());
	for (let day of allHolidays) {
		if (day.dateString == dateVal.toLocaleDateString("en-US")) {
			return day.name;
		}
	}
	return null;
}

function isDayOff(dateVal = new Date()) {
	const allHolidays = allFederalHolidaysForYear(dateVal.getFullYear());
	for (let day of allHolidays) {
		if (day.dateString == dateVal.toLocaleDateString("en-US")) {
			return day.name;
		}
	}
	return null;
}

function allFederalHolidaysForYear(year = (new Date().getFullYear())) {
	var thanksgiving = getNthDayOf(4, 4, 11, year);
	var dayAfterThanksgiving = getNthDayOf(4, 4, 11, year).addDays(1);
	let holidays = [
		{ name: "New Year's Day", enabled: true, date: new Date(Date.parse(`1/1/${year}`)) },
		{ name: "Martin Luther King Day", enabled: false, date: getNthDayOf(3, 1, 1, year) },
		{ name: "President's Day", enabled: false, date: getNthDayOf(3, 1, 2, year) },
		{ name: "Memorial Day", enabled: true, date: getLastDayOf(1, 1, 5, year) },
		{ name: "Independence Day", enabled: true, date: new Date(Date.parse(`7/4/${year}`)) },
		{ name: "Labor Day", enabled: true, date: getNthDayOf(1, 1, 9, year) },
		{ name: "Columbus Day", enabled: false, date: getNthDayOf(2, 1, 10, year) },
		{ name: "Veterans Day", enabled: false, date: new Date(Date.parse(`11/11/${year}`)) },
		{ name: "Thanksgiving Day", enabled: true, date: thanksgiving },
		{ name: "Day After Thanksgiving", enabled: true, date: dayAfterThanksgiving },
		{ name: "Christmas Day", enabled: true, date: new Date(Date.parse(`12/25/${year}`)) }
	];
	
	for (let holiday of holidays) {
		const dow = holiday.date.getUTCDay();
		if (dow == 0) { // holiday is saturday, its observed on monday
			holiday.date = holiday.date.addDays(1);
			holiday.shifted = true;
		} else if (dow == 6) { // holiday is saturday, its observed on friday
			holiday.date = holiday.date.addDays(-1);
			holiday.shifted = true;
		}
		else {
			holiday.shifted = false;
		}
		
		holiday.dateString = holiday.date.toLocaleDateString("en-US");
	}
	
	return holidays;
}