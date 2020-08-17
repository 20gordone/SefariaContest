
function fA10(){
    document.getElementById("artProduct").innerHTML = ""
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
        document.getElementById("includePA").hidden = false;
    }
    if (document.getElementById('versesdropdown').value.split(".")[1] == "Pirkei Avot"){
        fA11();
    }
    else {
        fA1();
    }
}

function fA20(){
    document.getElementById("artProduct").innerHTML = ""
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
        document.getElementById("includePA").hidden = false;
    }
    if (document.getElementById('versesdropdown').value.split(".")[1] == "Pirkei Avot"){
        fA21();
    }
    else {
        fA2();
    }
}

//Pirkei Avot w/trope
function fA11(){
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
    }
    var sources = document.getElementById('versesdropdown').value
    var source = sources.split(".");
    var lookup = source[0];
    var book = "Pirkei Avot"
    var chapter = source[2];
    var verse = source[3];
    var artPerek = jQuery.getJSON("https://www.sefaria.org/api/texts/" + book + "." + chapter, function(data) {
        artPasuk = artPerek.responseJSON.he[parseInt(verse)-1]
        var letInds = contained2(lookup, artPasuk) 
        imageSpace = document.getElementById("artProduct")
        letInds[letInds.length-1] = artPasuk.length
        imageSpace.innerHTML += artPasuk.substring(0,letInds[0]) + "<strong style=\"font-size: 25px;\">" + artPasuk.charAt(letInds[0])+ "</strong>"
        for (var i =2; i<letInds.length;i = i+2){
            imageSpace.innerHTML += artPasuk.substring(letInds[i-2]+1,letInds[i]) + "<strong style=\"font-size: 25px;\">" + artPasuk.charAt(letInds[i])+ "</strong>"
        }
        imageSpace.innerHTML += artPasuk.substring(letInds[letInds.length-2],letInds[letInds.length-1])
    });
    document.getElementById("aPButtons").innerHTML = "<button onclick=\"clearImage()\" class=\"brownfill\">Clear Acrostic</button>"

}

//Pirkei Avot w/o trope
function fA21(){
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
    }
    var sources = document.getElementById('versesdropdown').value
    var source = sources.split(".");
    var lookup = source[0];
    var book = "Pirkei Avot"
    var chapter = source[2];
    var verse = source[3];
    var artPerek = jQuery.getJSON("https://www.sefaria.org/api/texts/" + book + "." + chapter, function(data) {
        artPasuk = artPerek.responseJSON.he[parseInt(verse)-1]
        simplePasuk = ""
        for (var i = 0; i<artPasuk.length;i++){
            if (/[א-ת ־.:;,()]+$/.test(artPasuk.charAt(i)))
                simplePasuk += artPasuk.charAt(i)
        }
        artPasuk = simplePasuk
        var letInds = contained2(lookup, artPasuk) 
        imageSpace = document.getElementById("artProduct")
        letInds[letInds.length-1] = artPasuk.length
        imageSpace.innerHTML += artPasuk.substring(0,letInds[0]) + "<strong style=\"font-size: 25px;\">" + artPasuk.charAt(letInds[0])+ "</strong>"
        for (var i =2; i<letInds.length;i = i+2){
            imageSpace.innerHTML += artPasuk.substring(letInds[i-2]+1,letInds[i]) + "<strong style=\"font-size: 25px;\">" + artPasuk.charAt(letInds[i])+ "</strong>"
        }
        imageSpace.innerHTML += artPasuk.substring(letInds[letInds.length-2],letInds[letInds.length-1])
    });
    document.getElementById("aPButtons").innerHTML = "<button onclick=\"clearImage()\" class=\"brownfill\">Clear Acrostic</button>"

}

//Includes trope/nikud
function fA1(){
    var sources = document.getElementById('versesdropdown').value
    var source = sources.split(".");
    var l2 = source[0];
    var lookup = l2.replace(/\s/g, '')
    var book = source[1];
    var chapter = source[2];
    var verse = source[3];
    var artPerek = jQuery.getJSON("https://www.sefaria.org/api/texts/" + book + "." + chapter, function(data) {
        artPasuk = artPerek.responseJSON.he[parseInt(verse)-1]
        artPasuk = artPasuk.substring(0,artPasuk.indexOf("׃"))
        var temp = ""
        for (var i = 0; i<artPasuk.length;i++){
            if (!(/[\[\]]+$/.test(artPasuk.charAt(i))))
                temp += artPasuk.charAt(i)
        }
        artPasuk=temp
        var letInds = contained2(lookup, artPasuk) 
        imageSpace = document.getElementById("artProduct")
        letInds[letInds.length-1] = artPasuk.length
        if (letInds[0]>0 && artPasuk.charAt(letInds[0]-1) == " "){
            imageSpace.innerHTML = "<div><span>" + artPasuk.substring(letInds[0]+1,letInds[1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[0]) + "</strong>" + " " + "<span>" + artPasuk.substring(0,letInds[0]) + "</span></div>\n"
        }
        else {
            imageSpace.innerHTML = "<div><span>" + artPasuk.substring(letInds[0]+1,letInds[1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[0]) + "</strong><span>" + artPasuk.substring(0,letInds[0]) + "</span></div>\n"
        }
        var j = 0 //also for spaces
        for (var i = 2; i< letInds.length;i += 2){
            j +=2;
            if (l2.charAt(j/2) == " "){
                imageSpace.innerHTML += "<br>"
                j += 2
            }
            imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letInds[i]+1,letInds[i+1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[i]) + "</strong><span>" + artPasuk.substring(letInds[i-1]+1,letInds[i]) + " " + "</span></div>\n"
        }
        document.getElementById("aPButtons").innerHTML = "<button onclick=\"clearImage()\" class=\"brownfill\">Clear Acrostic</button>"
        document.getElementById("aPButtons").innerHTML += "  <button id=\"dl\" onclick=\"saveImage()\" class=\"brownfill\">Download Acrostic (spacing may vary)</button>"


    });
}

//No nikud/trope
function fA2(){
    var sources = document.getElementById('versesdropdown').value
    var source = sources.split(".");
    //next two lines are with spaces
    var l2 = source[0];
    var lookup = l2.replace(/\s/g, '')
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
        //depends on shemot status
        var letInds = contained2(lookup, artPasuk)
        if (document.getElementById('shems').checked){
            artPasuk = artPasuk.split("אלהי").join("אלקי")
            artPasuk = artPasuk.split("יהוה").join(" יי ")
        }
        //end shemot stuff
        imageSpace = document.getElementById("artProduct")
        letInds[letInds.length-1] = artPasuk.length
        if (letInds[0]>0 && artPasuk.charAt(letInds[0]-1) == " "){
            imageSpace.innerHTML = "<div><span>" + artPasuk.substring(letInds[0]+1,letInds[1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[0]) + "</strong>" + " " + "<span>" + artPasuk.substring(0,letInds[0]) + "</span></div>\n"
        }
        else {
            imageSpace.innerHTML = "<div><span>" + artPasuk.substring(letInds[0]+1,letInds[1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[0]) + "</strong><span>" + artPasuk.substring(0,letInds[0]) + "</span></div>\n"
        }
        var j = 0 //also for spaces
        for (var i = 2; i< letInds.length;i += 2){
            j +=2;
            if (l2.charAt(j/2) == " "){
                imageSpace.innerHTML += "<br>"
                j += 2
            }
            imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letInds[i]+1,letInds[i+1]) + "</span><strong style=\"font-size:25px\">" + artPasuk.charAt(letInds[i]) + "</strong><span>" + artPasuk.substring(letInds[i-1]+1,letInds[i]) + " " + "</span></div>\n"
        }
        document.getElementById("aPButtons").innerHTML = "<button id = \"1artProduct\" onclick = \"clearImage()\" class=\"brownfill\">Clear Image</button>"
        document.getElementById("aPButtons").innerHTML += "  <button id=\"dl\" onclick=\"saveImage()\" class=\"brownfill\">Download Acrostic (spacing may vary)</button>"
    });
}

function clearImage(){
    document.getElementById("artProduct").innerHTML = ""
    document.getElementById("aPButtons").innerHTML = ""
}

function saveImage(){
    document.getElementById("dl").disabled = true;
    var ydim = 320 + 40*(document.getElementById('versesdropdown').value.split(".")[0].length)
    html2canvas(document.querySelector("#artProduct"), {height: ydim, width: 1000}).then(canvas => {
        var link = document.createElement('a');
        var filename = document.getElementById('versesdropdown').value + ".acrosticart"
        if (typeof link.download === 'string') {
            link.href=canvas.toDataURL('image/jpg');
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.getElementById("dl").disabled = false;
        } else {
            window.open(uri);
            document.getElementById("dl").disabled = false;
        }
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
    if (document.getElementById('shems').checked){
        var wordsarray = verse.split(" ")
        var wa2 = []
        for (var j = 0; j<wordsarray.length; j++){
            var v2 = ""
            for (var i = 0; i<wordsarray[j].length;i++){
                if (/[א-ת ־]+$/.test(wordsarray[j].charAt(i))){
                    v2 += wordsarray[j].charAt(i)
                }
            }
            if (v2 != "יהוה" && v2.substring(0,4) != "אלהי" && v2.substring(1,5) != "אלהי"){
                wa2.push(wordsarray[j])
            }
            else {
                wa2.push("=".repeat(wordsarray[j].length))
            }
        }
        verse = wa2.join(" ")
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

function contained21(str1, verse){
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