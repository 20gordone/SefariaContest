var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < 3; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.children[2];
    var title = this.children[1]
    if (panel.style.display === "block") {
        title.innerText = this.id + " (click to expand)"
        panel.style.display = "none";
    }
    else {
        title.innerText = this.id + " (click to compress)"
        panel.style.display = "block";
    }
  });
}

function recollapse(id){
    thisacc = document.getElementById(id);
    thisacc.classList.toggle("active");
    var panel = thisacc.children[2];
    var title = thisacc.children[1]
    if (panel.style.display === "block") {
        title.innerText = thisacc.id + " (click to expand)"
        panel.style.display = "none";
    }
    else {
        title.innerText = thisacc.id + " (click to compress)"
        panel.style.display = "block";
    }
}

/*
for (var i = 0; i < 3; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    var title = this.children[1]
    if (panel.style.display === "block") {
        title.innerText = this.id + " (click to expand)"
        panel.style.display = "none";
    }
    else {
        title.innerText = this.id + " (click to compress)"
        panel.style.display = "block";
    }
  });
}*/

function hebTest(l2, perek, book, fillVal){
    var lookup = l2.replace(/\s/g, '')
    var jqxhr = jQuery.getJSON( "https://www.sefaria.org/api/texts/" + book + "." + String(perek), function(data) {
        hverses = jqxhr.responseJSON.he
        for (var i =0; i<hverses.length;i++){
            if(hverses[i].length<400 && contained(lookup,hverses[i])){
                addElement(l2, book,String(perek),String(i+1),jqxhr.responseJSON.text[i])
            }
        }
        widthString = document.getElementById("myBar").style.width
        document.getElementById("myBar").style.width = (Number(widthString.substring(0,widthString.length-1))+fillVal) + "%"
        if (Number(widthString.substring(0,widthString.length-1))+fillVal>99){
            setTimeout(() => { resetbar(); }, 500);
        }
    });
}

function resetbar(){
    document.getElementById("loadbar").innerHTML = ""
    document.getElementById("searching").textContent = ""
    setTimeout(() => { noresults(); }, 100);

}

function nameSearch(){
    //var lookup = "לאהובנ";
    document.getElementById("includePA").hidden = true;
    document.getElementById("save").disabled = true;
    document.getElementById("names").disabled = true;
    document.getElementById("shems").disabled = true;
    document.getElementById("artProduct").innerHTML = ""
    document.getElementById("vary").innerHTML = ""
    document.getElementById("aPButtons").innerHTML = ""
    var l2 = document.getElementById("names").value;
    var lookup = l2.replace(/\s/g, '')
    if(lookup == "" || !(/^[א-ת]+$/.test(lookup))){
        alert("Please use Hebrew letters")
        document.getElementById("includePA").hidden = false;
        document.getElementById("save").disabled = false;
        document.getElementById("names").disabled = false;
        document.getElementById("shems").disabled = false;
        return;
    }
    if (l2.charAt(0) == " " || l2.charAt(l2.length-1) == " "){
        alert("Please don't begin with a space")
        document.getElementById("includePA").hidden = false;
        document.getElementById("save").disabled = false;
        document.getElementById("names").disabled = false;
        document.getElementById("shems").disabled = false;
        return;
    }
    var numbooks = 0.0
    var checkPA = document.getElementById("1Pirkei Avot").checked
    var sections = ["tormenu","promenu","writmenu"]
    for (var x=0;x<3;x++){
        currentdropdown = document.getElementById(sections[x]).children;
        for (var i = 1; i<currentdropdown.length;i+= 1){
            if (currentdropdown[i].checked){
                numbooks += Number(currentdropdown[i].value)
            }
        }
    }
    if (checkPA){
        numbooks += 6
    }
    if (numbooks == 0.0){
        alert("Please select some books to search");
        document.getElementById("includePA").hidden = false;
        document.getElementById("save").disabled = false;
        document.getElementById("names").disabled = false;
        document.getElementById("shems").disabled = false;
        return;
    }
    document.getElementById("vary").innerHTML ="<label for=\"versesdropdown\"><i>Search results:</i></label><select id=\"versesdropdown\" class=\"brownfill\"></select>"
    document.getElementById("searching").textContent = "Searching..."
    document.getElementById("loadbar").innerHTML = "<div id=\"myProgress\"><div id=\"myBar\"></div></div>"
    currentdropdown = document.getElementById('tormenu').children;
    var fillVal = 100/numbooks
    if (checkPA){
        for (var i = 0; i<6; i++){
            hebTest(lookup,i+1,"Pirkei Avot", fillVal)
        }
    }
    for (var x=0;x<3;x++){
        currentdropdown = document.getElementById(sections[x]).children;
        for (i = 1; i<currentdropdown.length;i+= 1){
            if (currentdropdown[i].checked){
                for (var j = 0; j<Number(currentdropdown[i].value);j++){
                    hebTest(l2,j+1,currentdropdown[i].name,fillVal);
                }
            }
        }
    }
}


function noresults(){
    var item = document.getElementById("vary");
    if (document.getElementById("versesdropdown").innerHTML == ""){
        item.innerHTML = "Sorry, there don't seem to be any results for that search"
    }
    else if (item.children[item.children.length-1].id != "countresults"){
        item.innerHTML += "<br> <button id = \"noVowel\" onclick = \"fA20()\" class=\"brownfill\">Render Without Vowels</button>"
        item.innerHTML += "<button id = \"Vowel\" onclick = \"fA10()\" class=\"brownfill\">Render With Vowels</button>"
        item.innerHTML += "<button id = \"goSefaria\" button title=\"goverse\" class=\"action primary tocart brownfill\" onclick = \" openLink(); return false;\">Go to this verse on Sefaria</button>"
        var resultCount = item.children[1].children.length
        if (resultCount == 1) {
            item.innerHTML += "<br> <p id=\"countresults\"> Sorry, there was only one result. I hope it's a good one!</p>"
        }
        if (resultCount > 1){
            item.innerHTML += "<br> <p id=\"countresults\"> There were a whopping " + String(resultCount) + " results! Yay!</p>"
        }

    }
    document.getElementById("shems").disabled = false;
    document.getElementById("save").disabled = false;
    document.getElementById("names").disabled = false;

}

function openLink(){
    URLval = document.getElementById("versesdropdown").value.split(".");
    window.open('https://www.sefaria.org/' + URLval[1] + "." + URLval[2] + '.' + URLval[3], '_blank');
    return false;
}

function contained(str1, verse){
    var str = "";
    if (document.getElementById('shems').checked){
        var v2 = ""
        for (var i = 0; i<verse.length;i++){
            if (/[א-ת ־]+$/.test(verse.charAt(i)))
                v2 += verse.charAt(i)
        }
        v2 = v2.split("יהוה").join("")
        v3 = v2.split(" ")
        for (var i = 0; i<v3.length;i++){
            if (v3[i].includes("אלהי")){
                v3[i]= ""
            }
        }
        v2 = v3.join(" ")
        verse = v2
    }
    for (var i = 0; i<2*str1.length;i++){
        if (i %2 == 0){
            str += str1.charAt(i/2);
        }
        else {
            str += " ";
        }
    }
    var index = 0;
    for (i = 0; i<verse.length; i++){
        if (verse.charAt(i) == str.charAt(index)){

            index++;
        }
        if (index == str.length) {
            return true;
        }
    }
    return false;
}



document.getElementById('save').addEventListener('click', nameSearch);


function addElement(lookup, book, chapter, verse, eText){
    var text = book + " " + chapter + ":" + verse + " --> " + eText; //What the option should appear as, rendered fully
    if (text.length>153){
        text = text.substring(0,150) + "..." //Limit the length
    }
    var url = "https://www.sefaria.org/" + book + "." + chapter + "." + verse;
    var buttonId = lookup  + "." + book + "." + chapter + "." + verse
    document.getElementById("versesdropdown").innerHTML += "<option value = \"" + buttonId + "\" title=\"" + eText + "\">" + text + "</option>"
}




function checkTorah(){
    currentdropdown = document.getElementById('tormenu').children;
    document.getElementById("Include Torah").classList.toggle("active");
    var panel = document.getElementById('tormenu');
    var title = document.getElementById("Include Torah").children[1]
    if (panel.style.display === "block") {
        title.textContent = "Include Torah (click to expand)"
        panel.style.display = "none";
    }
    else {
        title.textContent = "Include Torah (click to compress)"
        panel.style.display = "block";
    }
    if (document.getElementById("Wholetorah").checked == true){
        for (i = 1; i<currentdropdown.length;i+= 1){
            currentdropdown[i].checked = true
        }
    }
    else{
        for (i = 1; i<currentdropdown.length;i+= 1){
            currentdropdown[i].checked = false
        }
    }
}

function checkProphets(){
    currentdropdown = document.getElementById('promenu').children;
    document.getElementById("Include Prophets").classList.toggle("active");
    var panel = document.getElementById('promenu');
    var title = document.getElementById("Include Prophets").children[1]
    if (panel.style.display === "block") {
        title.textContent = "Include Prophets (click to expand)"
        panel.style.display = "none";
    }
    else {
        title.textContent = "Include Prophets (click to compress)"
        panel.style.display = "block";
    }
    if (document.getElementById("Wholeproph").checked == true){
        for (i = 1; i<currentdropdown.length;i+= 1){
            currentdropdown[i].checked = true
        }
    }
    else{
        for (i = 1; i<currentdropdown.length;i+= 1){
            currentdropdown[i].checked = false
        }
    }
}

function checkWritings(){
    currentdropdown = document.getElementById('writmenu').children;
    document.getElementById("Include Writings").classList.toggle("active");
    var panel = document.getElementById('writmenu');
    var title = document.getElementById("Include Writings").children[1]
    if (panel.style.display === "block") {
        title.textContent = "Include Writings (click to expand)"
        panel.style.display = "none";
    }
    else {
        title.textContent = "Include Writings (click to compress)"
        panel.style.display = "block";
    }
    if (document.getElementById("Wholewrit").checked == true){
        for (i = 1; i<currentdropdown.length;i+= 1){
            currentdropdown[i].checked = true
        }
    }
    else{
        for (i = 1; i<currentdropdown.length;i+= 1){
            currentdropdown[i].checked = false
        }
    }
}