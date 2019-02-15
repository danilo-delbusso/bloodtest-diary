/**
 * Controller functions to get dates using a frequency foramt
 * @module calendar-controller
 * @author Danilo Del Busso
 * @version 0.0.1
 */
const Holidays = require('date-holidays');
const hd = new Holidays('GB');

/**
 * Get all the next dates based on the frequency notation.
 * It does NOT return the original date
 * @param {string} frequency the frequency expressed as frequency notation
 * @param {Date} startingDate the starting date (not included in the result)
 * @returns {array<Date>} an array containing the next dates but not the given starting date
 */
function getNextDates(frequency, startingDate) {
    const f = frequency.split(':');
    if (f.length != 2 || f[1] < 0) {
        //console.error("The frequency format is wrong.")
        return null;
    }
    const repetitions = parseInt(f[1]);
    const allDates = [];
    let date = getNextDate(f[0], startingDate);

    for (let i = 0; i < repetitions; i++) {
        allDates.push(date);
        date = getNextDate(f[0], date);
    }

    return allDates;
}

/**
 * Get the next date
 * @example <caption>Example usage of getNextDate with X-D notation.</caption>
 * // returns Date object of value 2018-01-04T00:00:00.000Z
 * getNextDate('3-D', new Date(2018, 0 , 1));
 * 
 * @param {string} frequency the frequency in the given format
 * @param {date} startingDate the starting date from which to calculate the next date
 */
function getNextDate(frequency, startingDate) {
    if (frequency === null || frequency.split('-').length > 2 || frequency.split('-').length < 1) {
        //console.error("Error in formatting date. Date is either null or not in the right format");
        return null;
    }
    const f_value = parseInt(frequency.split('-')[0]); // the '3' in '3-Y'
    if (isNaN(f_value) || !stringIsInteger(frequency.split('-')[0])) {
        //console.error("Value must be a number")
        return null;
    }
    const f_format = frequency.split('-')[1]; // the 'Y' in '2-Y'
    let date = null;
    let year = startingDate.getFullYear();
    const month = startingDate.getMonth();
    let day = startingDate.getDate()

    switch (f_format) {
        case 'Y':
            {
                year += f_value;
                date = new Date(year, startingDate.getMonth(), startingDate.getDate()); //month is month_number-1 e.g. Jan is 0 and December is 11
                break;
            }
        case 'W':
            {
                day += (f_value * 7);
                date = new Date(year, month, day);
                break;
            }
        case 'D':
            {
                day += f_value;
                date = new Date(startingDate.getFullYear(), startingDate.getMonth(), day);
                break;
            }
        default:
            //console.error("Error in formatting date");
            return null;
    }

    if (validDate(date))
        return date;


    return null;
}


/**
 * Check if date is valid
 * @param {date} date the date
 */
function validDate(date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
        if (isNaN(date.getTime())) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

/**
 * Check if a date is a holiday in the UK
 * @param {date} date the date to check
 */
function isHoliday(date) {
    hd.isHoliday(date);
}

/**
 * Check if given string is an integer
 * @param {string} str 
 * @returns {boolean} true if string is an integer
 */
function stringIsInteger(str) {
    const n = Math.floor(Number(str));
    return String(n) === str;
}

module.exports = {
    isHoliday,
    getNextDates
}