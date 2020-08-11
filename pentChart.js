var pentCounts = [0,0,0,0,0];
var temp = [0,0,0,0,0];
var options = {'title':'Where is the word', 'width':550, 'height':400};
var hoptions = {'title':'Where is the word', 'width':550, 'height':400};
var doneLooking = false;

function pentSearch(){
    var i = 0;
    doneLooking = false;
    pentCounts = [0,0,0,0,0];
    var lookup = document.getElementById("keyword").value;
    if(!(/^[a-zA-Z]+$/.test(lookup))){
        alert("Please only use English letters");
        return;
    }
    for (i = 0; i<50;i++){
        countInstEng(lookup,i+1,"Genesis", 0);
    }
    for (i = 0; i<40;i++){
        countInstEng(lookup,i+1,"Exodus", 1);
    }
    for (i = 0; i<27;i++){
        countInstEng(lookup,i+1,"Leviticus", 2);
    }
    for (i = 0; i<36;i++){
        countInstEng(lookup,i+1,"Numbers", 3);
    }
    for (i = 0; i<34;i++){
        countInstEng(lookup,i+1,"Deuteronomy", 4);
    }
    options['title'] = 'Location of English word: ' + lookup
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    drawChart();
    
}
var reps = 0;
function drawChart(){
    reps += 1;
    if (doneLooking){
        var data = new google.visualization.arrayToDataTable([
            ['Book', 'Occurrences of keyword'],
            ['Genesis', pentCounts[0]],
            ['Exodus', pentCounts[1]],
            ['Leviticus', pentCounts[2]],
            ['Numbers', pentCounts[3]],
            ['Deuteronmoy', pentCounts[4]]
        ]);  
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
        reps = 0;
    }
    else{
        if (reps <200){
            setTimeout(() => { drawChart(); }, 500);
        }
        else{
            alert("Sorry, the request timed out. Try reloading the page and checking your connection.")
        }
    }
}

function countInstEng(lookup, perek, book, index){
    var jqxhr = jQuery.getJSON( "https://www.sefaria.org/api/texts/" + book + "." + String(perek), function(data) {
        var everses = jqxhr.responseJSON.text
        for (var i =0; i<everses.length;i++){
            pentCounts[index] += strOccur(everses[i], lookup);
        }
        if (perek == 34 && book == "Deuteronomy") {doneLooking = true};
    });
}

function strOccur(string, subString) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);
    string = string.toLowerCase();
    subString = subString.toLowerCase();
    var n = 0,
        pos = 0,
        step = 1;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}


//Now the same for Hebrew

function pentSearchHeb(){
    var i = 0;
    doneLooking = false;
    pentCounts = [0,0,0,0,0];
    var lookup = document.getElementById("keyword").value;
    if(!(/^[א-ת]+$/.test(lookup))){
        alert("Please only use Hebrew letters");
        return;
    }
    for (i = 0; i<50;i++){
        countInstHeb(lookup,i+1,"Genesis", 0);
    }
    for (i = 0; i<40;i++){
        countInstHeb(lookup,i+1,"Exodus", 1);
    }
    for (i = 0; i<27;i++){
        countInstHeb(lookup,i+1,"Leviticus", 2);
    }
    for (i = 0; i<36;i++){
        countInstHeb(lookup,i+1,"Numbers", 3);
    }
    for (i = 0; i<34;i++){
        countInstHeb(lookup,i+1,"Deuteronomy", 4);
    }
    options['title'] = 'Location of Hebrew word: ' + lookup
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    drawChart();
    
}
//אברהם
function countInstHeb(lookup, perek, book, index){
    var jqxhr = jQuery.getJSON( "https://www.sefaria.org/api/texts/" + book + "." + String(perek), function(data) {
        hverses = jqxhr.responseJSON.he;
        for (var i = 0; i<hverses.length;i++){
            var temp = strOccurHeb(hverses[i],lookup);
            pentCounts[index] += temp;
            if (temp > 0 && book == "Genesis"){ console.log(hverses[i]);}
        }
        if (perek == 34 && book == "Deuteronomy") {doneLooking = true};
    });
}

function strOccurHeb(string, subString) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);
    var n = 0;
    var subindex = 0;
    for (var i = 0; i <string.length;i++){
        thisChar = string.charAt(i)
        if (thisChar == subString.charAt(subindex)){
            subindex += 1;
        }
        else {if (thisChar == " " || thisChar == "-" || (/^[א-ת]+$/.test(thisChar))){
            subindex = 0;
        }}
        if (subindex == subString.length){
            n += 1;
            subindex = 0;
        }

    }
    return n;
}

function drawChartHeb(){
    reps += 1;
    if (doneLooking){
        var data = new google.visualization.arrayToDataTable([
            ['Book', 'Occurrences of keyword'],
            ['בראשית', pentCounts[0]],
            ['שמות', pentCounts[1]],
            ['ויקרא', pentCounts[2]],
            ['במדבר', pentCounts[3]],
            ['דברים', pentCounts[4]]
        ]);
        var chart = new google.visualization.PieChart(document.getElementById('piechartHeb'));
        chart.draw(data, hoptions);
        reps = 0;
    }
    else{
        if (reps <200){
            setTimeout(() => { drawChart(); }, 500);
        }
        else{
            alert("Sorry, the request timed out. Try reloading the page and checking your connection.")
        }
    }
}

document.getElementById('submit').addEventListener('click', pentSearch);
document.getElementById('hebmit').addEventListener('click', pentSearchHeb);
