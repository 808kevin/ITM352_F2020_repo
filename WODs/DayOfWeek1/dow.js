day = 9;
month = 'Nov';
year = 2000;

step1 = year % 100;
step2 = parseInt(step1 / 4);
step3 = step1 + step2;
if (month == "Jan") {
    step5 = day + step3;
}
else {
    switch (month) {
        case "Feb":
            step4 = 3; break;
        case "Mar":
            step4 = 3; break;
        case "Apr":
            step4 = 6; break;
        case "May":
            step4 = 1; break;
        case "Jun":
            step4 = 4; break;
        case "Jul":
            step4 = 6; break;
        case "Aug":
            step4 = 2; break;
        case "Sep":
            step4 = 5; break;
        case "Oct":
            step4 = 0; break;
        case "Nov":
            step4 = 3; break;
        case "Dec":
            step4 = 5; break;
    }
    step6 = step4 + step3;
    step7 = day + step6;
}
step8 = (typeof step5 !== 'undefined') ? step5 : step7;

isLeapYear = ((year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0));

if (parseInt(year / 100) == 19) {
    if (isLeapYear) {
        if (month == "Jan" || month == "Feb") {
            step9 = step8 - 1;
        }
    }
}
else {
    if (isLeapYear) {
        if (month == "Jan" || month == "Feb") {
            step9 = step8 - 2;}
        else {
            step9 = step8 - 1; 
        }
    } else {
        step9 = step8 - 1;
    }
}

step10 = step9 % 7;

if (step10 == 0) {
    dow = 'Sunday'
}
else if (step10 ==1) {
    dow = 'Monday'
}
else if (step10 ==2) {
    dow = 'Tuesday'
}
else if (step10 ==3) {
    dow = 'Wednesday'
}
else if (step10 ==4) {
    dow = 'Thursday'
}
else if (step10 ==5) {
    dow = 'Friday'
}
else if (step10 ==6) {
    dow = 'Saturday'
}

console.log(`${month}/${day}/${year} is a ${dow}`);