function hebTest(lookup, perek, book, fillVal){
    //console.log(book+perek);
    var jqxhr = jQuery.getJSON( "https://www.sefaria.org/api/texts/" + book + "." + String(perek), function(data) {
        hverses = jqxhr.responseJSON.he
        for (var i =0; i<hverses.length;i++){
            if(contained(lookup,hverses[i])){
                addElement(lookup, book,String(perek),String(i+1),jqxhr.responseJSON.text[i])
            }
        }
        console.log(fillVal)
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
    document.getElementById("artProduct").innerHTML = ""
    document.getElementById("vary").innerHTML = ""
    var lookup = document.getElementById("names").value;
    if(lookup == "" || !(/^[א-ת]+$/.test(lookup))){
        alert("Please (only) use Hebrew letters in the search box");
        return;
    }
    tbuttons = document.getElementById('buttons 1').children;
    var numbooks = 0.0
    for (var i = 0; i<80; i+=2){
        if (tbuttons[i].checked){
            numbooks += Number(tbuttons[i].value)
        }
        if (i == 8 || i == 51){ i+=1}
    }
    if (numbooks == 0.0){
        alert("Please select some books to search");
        return;
    }
    document.getElementById("searching").textContent = "Searching..."
    document.getElementById("loadbar").innerHTML = "<div id=\"myProgress\"><div id=\"myBar\"></div></div>"
    for (var i = 0; i<80; i+=2){
        if (tbuttons[i].checked){
            for (var j = 0; j<Number(tbuttons[i].value);j++){
                var fillVal = 100/numbooks
                hebTest(lookup,j+1,tbuttons[i+1].innerText,fillVal);
            }
        }

        if (i == 8 || i == 51){ i+=1}
    }
}


function noresults(){
    if (document.getElementById("vary").innerHTML == ""){
        document.getElementById("vary").textContent = "Sorry, there don't seem to be any results for that search"
    }

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
    var text = book + " " + chapter + ":" + verse + "  ";
    var url = "https://www.sefaria.org/" + book + "." + chapter + "." + verse;
    var element = document.createElement('a')
    element.href = url
    element.target ="_blank"
    element.textContent = text
    var buttonId = lookup  + "." + book + "." + chapter + "." + verse
    document.getElementById("vary").innerHTML += "<a href= \"" + url + "\" target=\"_blank\">" + text + "</a>  " + eText + " <button id = \"" + buttonId + "\" onclick = \"formatArt(this.id)\">Render With Vowels</button>"
    document.getElementById("vary").innerHTML += "<button id = \"1" + buttonId + "\" onclick = \"fA2(this.id)\">Render Without Vowels</button> <div id = \"2" + buttonId + "\" class = \"alignment\"></div> <br>"
}

//Includes trope/nikud
function formatArt(sources){
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
        //artPasuk = simplePasuk
        var letInds = contained2(lookup, artPasuk) 
        imageSpace = document.getElementById("2" + sources)
        //imageSpace = document.getElementById("artProduct")
        imageSpace.innerHTML = "<div><span>" + artPasuk.substring(letInds[0]+1,letInds[1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[0]) + "</strong><span>" + artPasuk.substring(0,letInds[0]) + "</span></div>\n"
        letInds[letInds.length-1] = artPasuk.length
        for (var i = 2; i< letInds.length;i += 2){
            imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letInds[i]+1,letInds[i+1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[i]) + "</strong><span>" + artPasuk.substring(letInds[i-1]+1,letInds[i]) + " " + "</span></div>\n"
        }
        imageSpace.innerHTML += "<br> <button id = \"12" + sources + "\" onclick = \"document.getElementById(this.id.substring(1,this.id.length)).innerHTML = this.id.substring(0,0)\">Clear Image</button>"
    });
}


//No nikud/trope
function fA2(sources){
    sources = sources.substring(1,sources.length)
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
        imageSpace = document.getElementById("2" + sources)
        //imageSpace = document.getElementById("artProduct")
        imageSpace.innerHTML = "<div><span>" + artPasuk.substring(letInds[0]+1,letInds[1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[0]) + "</strong><span>" + artPasuk.substring(0,letInds[0]) + "</span></div>\n"
        letInds[letInds.length-1] = artPasuk.length
        for (var i = 2; i< letInds.length;i += 2){
            imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letInds[i]+1,letInds[i+1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[i]) + "</strong><span>" + artPasuk.substring(letInds[i-1]+1,letInds[i]) + " " + "</span></div>\n"
        }
        imageSpace.innerHTML += "<br> <button id = \"22" + sources + "\" onclick = \"document.getElementById(this.id.substring(1,this.id.length)).innerHTML = this.id.substring(0,0)\">Clear Image</button>"
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