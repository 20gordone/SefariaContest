var acc = document.getElementsByClassName("accordion");
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
}

function hebTest(lookup, perek, book, fillVal){
    var jqxhr = jQuery.getJSON( "https://www.sefaria.org/api/texts/" + book + "." + String(perek), function(data) {
        hverses = jqxhr.responseJSON.he
        for (var i =0; i<hverses.length;i++){
            if(contained(lookup,hverses[i])){
                addElement(lookup, book,String(perek),String(i+1),jqxhr.responseJSON.text[i])
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
    document.getElementById("save").disabled = true;
    document.getElementById("artProduct").innerHTML = ""
    document.getElementById("vary").innerHTML = ""
    var lookup = document.getElementById("names").value;
    if(lookup == "" || !(/^[א-ת]+$/.test(lookup))){
        return;
    }
    var numbooks = 0.0
    currentdropdown = document.getElementById('tormenu').children;
    for (var i = 1; i<currentdropdown.length;i+= 1){
        if (currentdropdown[i].checked){
            numbooks += Number(currentdropdown[i].value)
        }
    }
    currentdropdown = document.getElementById('promenu').children;
    for (i = 1; i<currentdropdown.length;i+= 1){
        if (currentdropdown[i].checked){
            numbooks += Number(currentdropdown[i].value)
        }    }
    currentdropdown = document.getElementById('writmenu').children;
    for (i = 1; i<currentdropdown.length;i+= 1){
        if (currentdropdown[i].checked){
            numbooks += Number(currentdropdown[i].value)
        }    
    }
    if (numbooks == 0.0){
        alert("Please select some books to search");
        return;
    }
    document.getElementById("vary").innerHTML ="<label for=\"versesdropdown\"><i>Pasuk results:</i></label><select id=\"versesdropdown\" class=\"brownfill\"></select>"
    document.getElementById("searching").textContent = "Searching..."
    document.getElementById("loadbar").innerHTML = "<div id=\"myProgress\"><div id=\"myBar\"></div></div>"
    currentdropdown = document.getElementById('tormenu').children;
    for (i = 1; i<currentdropdown.length;i+= 1){
        if (currentdropdown[i].checked){
            for (var j = 0; j<Number(currentdropdown[i].value);j++){
                var fillVal = 100/numbooks
                hebTest(lookup,j+1,currentdropdown[i].name,fillVal);
            }
        }
    }
    currentdropdown = document.getElementById('promenu').children;
    for (i = 1; i<currentdropdown.length;i+= 1){
        if (currentdropdown[i].checked){
            for (var j = 0; j<Number(currentdropdown[i].value);j++){
                var fillVal = 100/numbooks
                hebTest(lookup,j+1,currentdropdown[i].name,fillVal);
            }
        }
    }
    currentdropdown = document.getElementById('writmenu').children;
    for (i = 1; i<currentdropdown.length;i+= 1){
        if (currentdropdown[i].checked){
            for (var j = 0; j<Number(currentdropdown[i].value);j++){
                var fillVal = 100/numbooks
                hebTest(lookup,j+1,currentdropdown[i].name,fillVal);
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
        item.innerHTML += "<br> <button id = \"noVowel\" onclick = \"fA2(this.parentElement.children[1].value)\" class=\"brownfill\">Render Without Vowels</button>"
        item.innerHTML += "<button id = \"Vowel\" onclick = \"formatArt(this.parentElement.children[1].value)\" class=\"brownfill\">Render With Vowels</button>"
        item.innerHTML += "<button id = \"goSefaria\" button title=\"goverse\" class=\"action primary tocart brownfill\" onclick = \" openLink(); return false;\">Go to this verse on Sefaria</button>"
        var resultCount = item.children[1].children.length
        if (resultCount == 1) {
            item.innerHTML += "<br> <p id=\"countresults\"> Sorry, there was only one result. I hope it's a good one!</p>"
        }
        if (resultCount > 1){
            item.innerHTML += "<br> <p id=\"countresults\"> There were a whopping " + String(resultCount) + " results! Yay!</p>"
        }

    }
    document.getElementById("save").disabled = false;

}

function openLink(){
    URLval = document.getElementById("versesdropdown").value.split(".");
    window.open('https://www.sefaria.org/' + URLval[1] + "." + URLval[2] + '.' + URLval[3], '_blank');
    return false;
}

function contained(str1, verse){
    var str = "";
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

//Includes trope/nikud
function formatArt(sources){
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
    }
    var source = sources.split(".");
    var lookup = source[0];
    var book = source[1];
    var chapter = source[2];
    var verse = source[3];
    var artPerek = jQuery.getJSON( "https://www.sefaria.org/api/texts/" + book + "." + chapter, function(data) {
        artPasuk = artPerek.responseJSON.he[parseInt(verse)-1]
        artPasuk = artPasuk.substring(0,artPasuk.indexOf("׃"))
        var letInds = contained2(lookup, artPasuk) 
        imageSpace = document.getElementById("artProduct")
        imageSpace.innerHTML = "<div><span>" + artPasuk.substring(letInds[0]+1,letInds[1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[0]) + "</strong><span>" + artPasuk.substring(0,letInds[0]) + "</span></div>\n"
        letInds[letInds.length-1] = artPasuk.length
        for (var i = 2; i< letInds.length;i += 2){
            imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letInds[i]+1,letInds[i+1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[i]) + "</strong><span>" + artPasuk.substring(letInds[i-1]+1,letInds[i]) + " " + "</span></div>\n"
        }
        imageSpace.innerHTML += "<br> <button id = \"1artProduct\" onclick = \"document.getElementById(this.id.substring(1,this.id.length)).innerHTML = this.id.substring(0,0)\" class=\"brownfill\">Clear Image</button>"
    });
}


//No nikud/trope
function fA2(sources){
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
    }
    var source = sources.split(".");
    var lookup = source[0];
    var book = source[1];
    var chapter = source[2];
    var verse = source[3];
    var artPerek = jQuery.getJSON( "https://www.sefaria.org/api/texts/" + book + "." + chapter, function(data) {
        artPasuk = artPerek.responseJSON.he[parseInt(verse)-1]
        artPasuk = artPasuk.substring(0,artPasuk.indexOf("׃"))
        simplePasuk = ""
        for (var i = 0; i<artPasuk.length;i++){
            if (/[א-ת ־]+$/.test(artPasuk.charAt(i)))
                simplePasuk += artPasuk.charAt(i)
        }
        artPasuk = simplePasuk
        var letInds = contained2(lookup, simplePasuk)
        imageSpace = document.getElementById("artProduct")
        imageSpace.innerHTML = "<div><span>" + artPasuk.substring(letInds[0]+1,letInds[1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[0]) + "</strong><span>" + artPasuk.substring(0,letInds[0]) + "</span></div>\n"
        letInds[letInds.length-1] = artPasuk.length
        for (var i = 2; i< letInds.length;i += 2){
            imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letInds[i]+1,letInds[i+1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[i]) + "</strong><span>" + artPasuk.substring(letInds[i-1]+1,letInds[i]) + " " + "</span></div>\n"
        }
        imageSpace.innerHTML += "<br> <button id = \"1artProduct\" onclick = \"document.getElementById(this.id.substring(1,this.id.length)).innerHTML = this.id.substring(0,0)\" class=\"brownfill\">Clear Image</button>"
    });
}

//does the same thing, but returns the array for how to draw the diagram
function contained2(str1, verse){
    var str = "";
    for (var i = 0; i<2*str1.length;i++){
        if (i %2 == 0){
            str += str1.charAt(i/2);
        }
        else {
            str += " ";
        }
    }
    var indices = new Array(str.length)
    var index = 0;
    for (i = 0; i<verse.length; i++){
        if (verse.charAt(i) == str.charAt(index)){

            indices[index] = i
            index++;
        }
        if (verse.charAt(i) == " " && index>0 & index%2 == 0){
            indices[index-1] = i
        }

    }
    return indices;
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