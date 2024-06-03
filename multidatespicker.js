var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();

var months = [];
var selectedDates = [];
var selectedimppDates = [];
var selecteddefinedDates = [];
var selectedurlaubDates = [];
var selecteddefLerntagDates = [];
var years = [];

// parameters to be set for the datepicker to run accordingly
var minYear = 2020;
var maxYear = 2030;
var startMonth = 0;
var endMonth = 11;
var highlightToday = true;
var dateSeparator = ', ';

// constants that would be used in the script

const listWeekdays = ["M","D","M","D","F","S","S"]
const listMonths = ["0","Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]

//this class will add a background to the selected date
const highlightClass = 'highlight';

$(document).ready(function (e) {
    today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    var json_str = getCookie('Kex');
    if (json_str != ""){
        var cookievals = JSON.parse(json_str);
        let input = document.querySelector("input[name='bookmark']");
        input.setAttribute("value", cookievals['bookmark']);
        selectedDates = cookievals["selectedDates"];
        selectedimppDates = cookievals["selectedimppDates"];
        selecteddefinedDates = cookievals["selecteddefinedDates"];
        selectedurlaubDates = cookievals["selectedurlaubDates"];
        selecteddefLerntagDates = cookievals["selecteddefLerntagDates"];
        var formData = cookievals["formData"];
        loadControl(currentMonth, currentYear);
        for (i = 0, len = selectedDates.length; i < len; i++) {
            let selectedDate = new Date(selectedDates[i]);
            appendForm(selectedDate, selectedDates[i], formData[selectedDates[i]]);
        }
        for (i = 0, len = selectedimppDates.length; i < len; i++) {
            let selectedDate = new Date(selectedimppDates[i]);
            appendForm(selectedDate, selectedimppDates[i], "M2");
        }
    }
    loadControl(currentMonth, currentYear);
});

function change(object) {
    selectedimppDates = [];
    try {
        let input = document.querySelectorAll("input[value='M2']")
        input[0].parentNode.remove();
        input[1].parentNode.remove();
        input[2].parentNode.remove();
    }catch (e){
        console.log(e);
    }

    let array = object.value.split("-");
    if (parseInt(array[1]) < 6){
        currentMonth = 10;
        currentYear = parseInt(array[0]) -1;
    } else if (parseInt(array[1]) > 6){
        currentMonth = 4;
        currentYear = parseInt(array[0]);
    }
    loadControl(currentMonth, currentYear);
    for (let i = 0; i < 3; i++) {
        let cellid = (parseInt(array[1]).toString() + "/" + (parseInt(array[2]) + i).toString() + "/" + array[0]);
        let inputid = array[0] + "-" + array[1] + "-" + ("00" + ((parseInt(array[2]) + i).toString())).slice(-2);
        let m2date = document.getElementById(cellid);
        m2date.classList.add("impp");
        let selectedDate = new Date(cellid);
        if (i == 0){
            let diff = document.createTextNode("Es sind noch " + date_diff_indays(today, selectedDate) + " Tage bis zum Examen.");
            let child1 = document.getElementById('numExamen').firstChild;
            document.getElementById('numExamen').replaceChild(diff, child1);
        }
        appendForm(selectedDate, cellid);
        let input = document.querySelector("input[name='" + inputid + "']");
        input.setAttribute("value", "M2");
        selectedimppDates.push((selectedDate.getMonth() + 1).toString() + '/' + selectedDate.getDate().toString() + '/' + selectedDate.getFullYear());
        //selectedDates.push((selectedDate.getMonth() + 1).toString() + '/' + selectedDate.getDate().toString() + '/' + selectedDate.getFullYear());
    }
    

};
function previous() {
    if (currentMonth < 6){
        currentMonth = currentMonth - 6 + 12;
        currentYear = currentYear - 1;
    }
    else {
        currentMonth = currentMonth - 6;
    }
    loadControl(currentMonth, currentYear);
};
function next() {
    if (currentMonth > 5){
        currentMonth = currentMonth + 6 - 12;
        currentYear = currentYear + 1;
    }
    else {
        currentMonth = currentMonth + 6;
    }
    loadControl(currentMonth, currentYear);
};


function loadControl(month, year) {

     // body of the calendar
    var divpane = document.querySelector("#div-pane");
    // clearing all previous cells
    divpane.innerHTML = "";
    
    // add the selected dates here to preselect
    //selectedDates.push((month + 1).toString() + '/' + date.toString() + '/' + year.toString());

    //create cells here
    month = month - 1; 
    //display next 6 Months
    for (let monthIterator = 0; monthIterator < 6; monthIterator++) {
        month++;
        if (month >= 12){
            month = month - 12;
            year++;
        }
        let divmonth = document.createElement("div");
        divmonth.classList.add("vc-pane");
        let divheader = document.createElement("div");
        divheader.classList.add("vc-header");
        divheader.classList.add("align-center");
        let divtitle = document.createElement("div");
        divtitle.classList.add("vc-title");
        let title = document.createTextNode(listMonths[month + 1] + " " + year.toString());
        divtitle.appendChild(title);
        divheader.appendChild(divtitle);
        divmonth.appendChild(divheader);
        let divweeks = document.createElement("div");
        divweeks.classList.add("vc-weeks");
        for (let i = 0; i < 7; i++){
            let divweekday = document.createElement("div");
            divweekday.classList.add("vc-weekday");
            let text = document.createTextNode(listWeekdays[i]);
            divweekday.appendChild(text);
            divweeks.appendChild(divweekday);
        }
        let date = 1;
        let firstDay = (new Date(year, month)).getDay();
        if (firstDay == 0){
            firstDay = 7;
        }
        firstDay = firstDay - 1;
                 //creating individual cells, filing them up with data.
                for (let cellIterated = 0; cellIterated < 42 && date <= daysInMonth(month, year); cellIterated++) {

                    // create a table data cell
                    celldiv = document.createElement("div");
                    celldiv.classList.add("vc-day")
                    cell = document.createElement("span");
                    cell.classList.add("vc-day-content");
                    let textNode = "";

                    // check if this is the valid date for the month
                    if (cellIterated >= firstDay) {
                        cell.id =  (month + 1).toString() + '/' + date.toString() + '/' + year.toString();
                        cell.classList.add("clickable");
                        textNode = date;

                        // this means that highlightToday is set to true and the date being iterated it todays date,
                        // in such a scenario we will give it a background color
                        if (highlightToday
                            && date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                            cell.classList.add("today-color");
                        }

                        // set the previous dates to be selected
                        // if the selectedDates array has the dates, it means they were selected earlier. 
                        // add the background to it.
                        if (selectedDates.indexOf((month + 1).toString() + '/' + date.toString() + '/' + year.toString()) >= 0) {
                            cell.classList.add(highlightClass);
                        }
                        if (selectedimppDates.indexOf((month + 1).toString() + '/' + date.toString() + '/' + year.toString()) >= 0) {
                            cell.classList.add("impp");
                        } else if (selecteddefinedDates.indexOf((month + 1).toString() + '/' + date.toString() + '/' + year.toString()) >= 0) {
                            cell.classList.add("defined");
                        }else if (selectedurlaubDates.indexOf((month + 1).toString() + '/' + date.toString() + '/' + year.toString()) >= 0) {
                            cell.classList.add("urlaub");
                        }else if (selecteddefLerntagDates.indexOf((month + 1).toString() + '/' + date.toString() + '/' + year.toString()) >= 0) {
                            cell.classList.add("defLerntag");
                        }
                        

                        date++;
                    }

                    cellText = document.createTextNode(textNode);
                    cell.appendChild(cellText);
                    celldiv.appendChild(cell);
                    divweeks.appendChild(celldiv);
                }
        divmonth.appendChild(divweeks);
        divpane.appendChild(divmonth);
    }
    // this adds the button panel at the bottom of the calendar
    //addButtonPanel(divpane);

    // function when the date cells are clicked
    $("#div-pane div div div span").click(function (e) {
        var id = $(this).attr('id');
        // check the if cell clicked has a date
        // those with an id, have the date
        if (typeof id !== typeof undefined) {
            var classes = $(this).attr('class');
            if (typeof classes === typeof undefined || !classes.includes(highlightClass)) {
                var selectedDate = new Date(id);
                selectedDates.push((selectedDate.getMonth() + 1).toString() + '/' + selectedDate.getDate().toString() + '/' + selectedDate.getFullYear());
                // Append Form with Dates
                appendForm(selectedDate, id);
            }
            else {
                var index = selectedDates.indexOf(id);
                rmid = "_" + id
                document.getElementById(rmid).remove();
                if (index > -1) {
                    selectedDates.splice(index, 1);
                }
                removehighlightflavor(id);
            }
            //$(this).className = "vc-day-content clickable highlight"
            $(this).toggleClass(highlightClass);
            let celltotoggle = document.getElementById(id);
            if (celltotoggle.classList.contains("defined")){celltotoggle.classList.remove("defined");}
            if (celltotoggle.classList.contains("defLerntag")){celltotoggle.classList.remove("defLerntag");}
            if (celltotoggle.classList.contains("urlaub")){celltotoggle.classList.remove("urlaub");}
        }

        // sort the selected dates array based on the latest date first
        var sortedArray = selectedDates.sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        // update the selectedValues text input
        //document.getElementById('selectedValues').value = datesToString(sortedArray);
        updatemessage();

    });


    var $search = $('#selectedValues');
    var $dropBox = $('#parent');
    
    $search.on('blur', function (event) {
        //$dropBox.hide();
    }).on('focus', function () {
        $dropBox.show();
    });
}


// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function date_diff_indays(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

function updatemessage() {
    let count = document.createTextNode("Du hast schon "+ Object.keys(selectedDates).length + " Tage ausgewählt (davon ca. "+ (Object.keys(selectedDates).length - Object.keys(selectedurlaubDates).length - Object.keys(selecteddefinedDates).length) + " Lerntage).");
    let child1 = document.getElementById('numSelected').firstChild;
    document.getElementById('numSelected').replaceChild(count, child1);
}

function appendForm(selectedDate, id, value) {
    let parag = document.createElement("p");
    parag.id = "_" + id;
    display = document.createTextNode(("00" + selectedDate.getDate().toString()).slice(-2) + '.' + ("00" + (selectedDate.getMonth() + 1).toString()).slice(-2) + '.' + selectedDate.getFullYear() + ": ");
    parag.appendChild(display);
    let newDay = document.createElement("input");
    newDay.setAttribute("type", "text");
    newDay.setAttribute("class", "date-values");
    newDay.setAttribute("name", selectedDate.getFullYear() + "-" + ("00" + (selectedDate.getMonth() + 1).toString()).slice(-2) + "-" + ("00" + selectedDate.getDate().toString()).slice(-2));
    newDay.setAttribute("placeholder", "Lerntag");
    if (typeof value === 'undefined' || value === 'null'){
        value = "";
    }
    newDay.setAttribute("value", value);
    newDay.setAttribute("onblur", "blurValue(this)");
    parag.appendChild(newDay);
    var form = document.querySelector("#form1");
    form.appendChild(parag); 
    sortChildrenDivsById("#form1");
};

function blurValue(object) {
    let parent = object.parentNode;
    let cellid = parent.id.substring(1);
    let blurdate = document.getElementById(cellid);
    if ((object.value.toLowerCase()).includes("urlaub")){
        blurdate.className = "vc-day-content clickable highlight";
        blurdate.classList.add("urlaub");
        removehighlightflavor(cellid);
        selectedurlaubDates.push(cellid);
    } else if ((object.value.toLowerCase()).includes("lerntag")){
        blurdate.className = "vc-day-content clickable highlight";
        blurdate.classList.add("defLerntag");
        removehighlightflavor(cellid);
        selecteddefLerntagDates.push(cellid);
    } else if (!(object.value === "" )){
        blurdate.className = "vc-day-content clickable highlight";
        blurdate.classList.add("defined");
        removehighlightflavor(cellid);
        selecteddefinedDates.push(cellid);
    } else {
        blurdate.className = "vc-day-content clickable highlight";
        removehighlightflavor(cellid);
    }
    updatemessage();
}

function removehighlightflavor(cellid) {
    let index_defined = selecteddefinedDates.indexOf(cellid);
    if (index_defined > -1) {
        selecteddefinedDates.splice(index_defined, 1);
    }
    let index_defLerntag = selecteddefLerntagDates.indexOf(cellid);
    if (index_defLerntag > -1) {
        selecteddefLerntagDates.splice(index_defLerntag, 1);
    }
    let index_urlaub = selectedurlaubDates.indexOf(cellid);
    if (index_urlaub > -1) {
        selectedurlaubDates.splice(index_urlaub, 1);
    }
}

resetCalendar = function resetCalendar() {
    // reset all the selected dates
    selectedDates = [];
    $('#dive-pane div div div').each(function () {
        $(this).find('span').each(function () {
            // $(this) will be the current cell
            $(this).removeClass(highlightClass);
        });
    });
};

function datesToString(dates) {
    return dates.join(dateSeparator);
}

function prepareCookie() {
    var cookievals = {};
    cookievals["bookmark"] = document.querySelector("input[name='bookmark']").value;
    cookievals["selectedDates"] = selectedDates;
    cookievals["selectedimppDates"] = selectedimppDates;
    cookievals["selecteddefinedDates"] = selecteddefinedDates;
    cookievals["selectedurlaubDates"] = selectedurlaubDates;
    cookievals["selecteddefLerntagDates"] = selecteddefLerntagDates;
    cookievals["formData"] = saveFormValues();
    var json_str = JSON.stringify(cookievals);
    createCookie("Kex", json_str, 185);
}

function createCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function saveFormValues() {
    var parent = document.querySelector("#form1");
    var children = parent.getElementsByTagName("p");
    var values = {}, i, len;
    for (i = 2, len = children.length; i < len; i++) {
        let saveid = children[i].id.toString().replace('_',"");
        values[saveid] = children[i].lastChild.value;
    }
    return values;
    
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function sortChildrenDivsById(parentId) {
    var parent = document.querySelector(parentId);
    // get child divs
    var children = parent.getElementsByTagName("p");
    var ids = [], obj, i, len;
    // build an array of objects that has both the element 
    // and a parsed div number in it so we can sort
    for (i = 0, len = children.length; i < len; i++) {
        obj = {};
        obj.element = children[i];
        obj.date = new Date(children[i].id.replace("/_/g",""));
        ids.push(obj);
    }
    
    // sort the array
    //ids.sort(function(a, b) {return(a.idNum - b.idNum);});
    ids.sort((a, b) => a.date - b.date);
    // append in sorted order
    for (i = 0; i < ids.length; i++) {
        //if (i>1){ids[i].element.lastChild.setAttribute("placeholder", "Lerntag " + (i - 1).toString());}
        parent.appendChild(ids[i].element);
    }
}

// to add the button panel at the bottom of the calendar
function addButtonPanel(tbl) {
    // after we have looped for all the days and the calendar is complete,
    // we will add a panel that will show the buttons, reset and done
    let row = document.createElement("tr");
    row.className = 'buttonPanel';
    cell = document.createElement("td");
    cell.colSpan = 7;
    var parentDiv = document.createElement("div");
    parentDiv.classList.add('row');
    parentDiv.classList.add('buttonPanel-row');
    

    var div = document.createElement("div");
    div.className = 'col-sm';
    var resetButton = document.createElement("button");
    resetButton.className = 'btn';
    resetButton.value = 'Reset';
    resetButton.onclick = function () { resetCalendar(); };
    var resetButtonText = document.createTextNode("Reset");
    resetButton.appendChild(resetButtonText);

    div.appendChild(resetButton);
    parentDiv.appendChild(div);
   

    var div2 = document.createElement("div");
    div2.className = 'col-sm';
    var doneButton = document.createElement("button");
    doneButton.className = 'btn';
    doneButton.value = 'Done';
    doneButton.onclick = function () { endSelection(); };
    var doneButtonText = document.createTextNode("Done");
    doneButton.appendChild(doneButtonText);

    div2.appendChild(doneButton);
    parentDiv.appendChild(div2);

    cell.appendChild(parentDiv);
    row.appendChild(cell);
    // appending each row into calendar body.
    tbl.appendChild(row);
}
