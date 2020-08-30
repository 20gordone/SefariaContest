
function fA10(){
    document.getElementById("artProduct").innerHTML = ""
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
    }
    if (document.getElementById('versesdropdown').value.split(".")[1] == "Pirkei Avot"){
        fA11();
    }
    else {
        fA1();
    }
}

function fA20(removeCount){
    document.getElementById("artProduct").innerHTML = ""
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults" && removeCount){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
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
    document.getElementById("artProduct").innerHTML = "<br>"
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
    }
    var sources = document.getElementById('versesdropdown').value
    var source = sources.split(".");
    var l2 = source[0];
    var lookup = l2.replace(/\s/g, '')
    var book = "Pirkei Avot"
    var chapter = source[2];
    var verse = source[3];
    var artPerek = jQuery.getJSON("https://www.sefaria.org/api/texts/" + book + "." + chapter, function(data) {
        artPasuk = artPerek.responseJSON.he[parseInt(verse)-1]  
        simplePasuk = ""
        for (var i = 0; i<artPasuk.length;i++){
            if (!(/[,:\.]+$/.test(artPasuk.charAt(i)))){
                simplePasuk += artPasuk.charAt(i)
            }
        }
        artPasuk=simplePasuk.replace(/\s/g, '\xa0')
        artPasuk = artPasuk.substring(0,simplePasuk.length-2)
        var letInds = contained2(lookup, artPasuk) 
        imageSpace = document.getElementById("artProduct")
        letInds[letInds.length-1] = artPasuk.length
        addLine(-1,letInds[0],letInds[1],artPasuk)
        var j =0;
        for (var i = 2; i< letInds.length;i += 2){
            j +=2;
            if (l2.charAt(j/2) == " "){
                imageSpace.innerHTML += "<br>"
                j += 2
            }
            addLine(letInds[i-1],letInds[i],letInds[i+1],artPasuk)
        }
    });
    document.getElementById("aPButtons").innerHTML = "<button onclick=\"clearImage()\" class=\"brownfill\">Clear Acrostic</button>"
    document.getElementById("aPButtons").innerHTML += "  <button id=\"dl\" onclick=\"saveImage()\" class=\"brownfill\">Download Acrostic (spacing may vary)</button><br><br>"
}

//Pirkei Avot w/o trope
function fA21(){
    document.getElementById("artProduct").innerHTML = "<br>"
    var remover = document.getElementById("vary")
    if (remover.children.length>0 && remover.children[remover.children.length-1].id == "countresults"){
        document.getElementById("vary").removeChild(document.getElementById("countresults"))
    }
    var sources = document.getElementById('versesdropdown').value
    var source = sources.split(".");
    var l2 = source[0];
    var lookup = l2.replace(/\s/g, '')
    var book = "Pirkei Avot"
    var chapter = source[2];
    var verse = source[3];
    var artPerek = jQuery.getJSON("https://www.sefaria.org/api/texts/" + book + "." + chapter, function(data) {
        artPasuk = artPerek.responseJSON.he[parseInt(verse)-1]
        simplePasuk = ""
        for (var i = 0; i<artPasuk.length;i++){
            if (/[א-ת ־\. \xa0 ;()]+$/.test(artPasuk.charAt(i)))
                simplePasuk += artPasuk.charAt(i)
        }
        artPasuk = simplePasuk.substring(0,simplePasuk.length-1)
        artPasuk = artPasuk.replace(/\s/g, '\xa0')
        var letInds = contained2(lookup, artPasuk) 
        //imageSpace = document.getElementById("artProduct")
        letInds[letInds.length-1] = artPasuk.length
        addLine(-1,letInds[0],letInds[1],artPasuk)
        var j = 0 //also for spaces
        for (var i = 2; i< letInds.length;i += 2){
            j +=2;
            if (l2.charAt(j/2) == " "){
                imageSpace.innerHTML += "<br>"
                j += 2
            }
            addLine(letInds[i-1],letInds[i],letInds[i+1],artPasuk)
            //imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letInds[i]+1,letInds[i+1]) + "</span><strong style=\"font-size:25px; line-height: 20px;\">" + artPasuk.charAt(letInds[i]) + "</strong><span>" + artPasuk.substring(letInds[i-1]+1,letInds[i]) + "\xA0" + "</span></div>\n"
        }
/*
        imageSpace.innerHTML += artPasuk.substring(0,letInds[0]) + "<strong style=\"font-size: 25px;\">" + artPasuk.charAt(letInds[0])+ "</strong><br>"
        for (var i =2; i<letInds.length;i = i+2){
            imageSpace.innerHTML += artPasuk.substring(letInds[i-2]+1,letInds[i]) + "<strong style=\"font-size: 25px;\">" + artPasuk.charAt(letInds[i])+ "</strong><br>"
        }
        imageSpace.innerHTML += artPasuk.substring(letInds[letInds.length-2],letInds[letInds.length-1])
    */    });
    
    document.getElementById("aPButtons").innerHTML = "<button onclick=\"clearImage()\" class=\"brownfill\">Clear Acrostic</button>"
    document.getElementById("aPButtons").innerHTML += "  <button id=\"dl\" onclick=\"saveImage()\" class=\"brownfill\">Download Acrostic (spacing may vary)</button><br><br>"

}

//Includes trope/nikud
function fA1(){
    document.getElementById("artProduct").innerHTML = "<br>"
    var sources = document.getElementById('versesdropdown').value
    var source = sources.split(".");
    var l2 = source[0];
    var lookup = l2.replace(/\s/g, '')
    var book = source[1];
    var chapter = source[2];
    var verse = source[3];
    var artPerek = jQuery.getJSON("https://www.sefaria.org/api/texts/" + book + "." + chapter, function(data) {
        artPasuk = artPerek.responseJSON.he[parseInt(verse)-1]
        artPasuk = artPasuk.substring(0,1+artPasuk.indexOf("׃"))
        if (source[4] == "2"){
            var p2 = artPerek.responseJSON.he[parseInt(verse)]
            p2 = p2.substring(0,1+p2.indexOf("׃"))
            artPasuk = artPasuk + "\xA0 " + p2
        }
        else {
            artPasuk = artPasuk.substring(0,artPasuk.indexOf("׃"))
        }
        var temp = ""
        for (var i = 0; i<artPasuk.length;i++){
            if (!(/[\[\]]+$/.test(artPasuk.charAt(i))))
                temp += artPasuk.charAt(i)
        }
        artPasuk=temp.replace(/\s/g, '\xa0')
        var letInds = contained2(lookup, artPasuk) 
        //imageSpace = document.getElementById("artProduct")
        letInds[letInds.length-1] = artPasuk.length
        addLine(-1,letInds[0],letInds[1],artPasuk)
        var j = 0 //also for spaces
        for (var i = 2; i< letInds.length;i += 2){
            j +=2;
            if (l2.charAt(j/2) == " "){
                imageSpace.innerHTML += "<br>"
                j += 2
            }
            addLine(letInds[i-1],letInds[i],letInds[i+1],artPasuk)
        }
        document.getElementById("aPButtons").innerHTML = "<button onclick=\"clearImage()\" class=\"brownfill\">Clear Acrostic</button>"
        document.getElementById("aPButtons").innerHTML += "  <button id=\"dl\" onclick=\"saveImage()\" class=\"brownfill\">Download Acrostic (spacing may vary)</button><br><br>"


    });
}

//No nikud/trope
function fA2(){
    document.getElementById("artProduct").innerHTML = "<br>"
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
        artPasuk = artPasuk.substring(0,1+artPasuk.indexOf("׃"))
        if (source[4] == "2"){
            var p2 = artPerek.responseJSON.he[parseInt(verse)]
            p2 = p2.substring(0,1+p2.indexOf("׃"))
            artPasuk = artPasuk + " \xA0" + p2
        }
        else {
            artPasuk = artPasuk.substring(0,artPasuk.indexOf("׃"))
        }
        simplePasuk = ""
        for (var i = 0; i<artPasuk.length;i++){
            if (/[א-ת : ־]+$/.test(artPasuk.charAt(i)))
                simplePasuk += artPasuk.charAt(i)
        }
        artPasuk=simplePasuk.replace(/\s/g, '\xa0')
        //depends on shemot status
        var letInds = contained2(lookup, artPasuk)
        if (document.getElementById('shems').checked){
            artPasuk = artPasuk.split("אלהי").join("אלקי")
            artPasuk = artPasuk.split("יהוה").join(" יי ")
        }
        //end shemot stuff
        letInds[letInds.length-1] = artPasuk.length
        addLine(-1,letInds[0],letInds[1],artPasuk)
        var j = 0 //also for spaces
        for (var i = 2; i< letInds.length;i += 2){
            j +=2;
            if (l2.charAt(j/2) == " "){
                imageSpace.innerHTML += "<br>"
                j += 2
            }
            addLine(letInds[i-1],letInds[i],letInds[i+1],artPasuk)
            //imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letInds[i]+1,letInds[i+1]) + "</span><strong style=\"font-size:25px; line-height: 20px;\">" + artPasuk.charAt(letInds[i]) + "</strong><span>" + artPasuk.substring(letInds[i-1]+1,letInds[i]) + "\xA0" + "</span></div>\n"
        }
        document.getElementById("aPButtons").innerHTML = "<button id = \"1artProduct\" onclick = \"clearImage()\" class=\"brownfill\">Clear Image</button>"
        document.getElementById("aPButtons").innerHTML += "  <button id=\"dl\" onclick=\"saveImage()\" class=\"brownfill\">Download Acrostic (spacing may vary)</button><br><br>"
    });
}
//letInds[i-1], letInds[i], letInds[i+1]
function addLine(letprev,letind,letnext,artPasuk){
    imageSpace = document.getElementById("artProduct")
    if (artPasuk.charAt(letind-1)=="\xA0"){
        imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letind+1,letnext) + "</span><strong style=\"font-size:33px; line-height: 23px;\">" + artPasuk.charAt(letind) + "</strong><span style=\"padding-left: 5px;\">" + artPasuk.substring(letprev+1,letind) + "</span></div>\n"
    }
    else{
        var lastinword = false
        for (var i = letind+1;i<letnext;i++){
            if (/[א-ת־]+$/.test(artPasuk.charAt(i))){
                break;
            }
            if (/[\s \xA0]+$/.test(artPasuk.charAt(i))){
                lastinword = true;
                break;
            }
        }
        if (lastinword){
            imageSpace.innerHTML += "<div><span style=\"padding-right: 5px;\">" + artPasuk.substring(letind+1,letnext) + "</span><strong style=\"font-size:33px; line-height: 23px;\">" + artPasuk.charAt(letind) + "</strong><span style=\"padding-right: 20px;\">" + artPasuk.substring(letprev+1,letind) + "\xA0" + "</span></div>\n"
        }
        else {
            imageSpace.innerHTML += "<div><span>" + artPasuk.substring(letind+1,letnext) + "</span><strong style=\"font-size:33px; line-height: 23px;\">" + artPasuk.charAt(letind) + "</strong><span style=\"padding-right: 10px;\">" + artPasuk.substring(letprev+1,letind) + "</span></div>\n"

        }
    }
}

function clearImage(){
    document.getElementById("artProduct").innerHTML = ""
    document.getElementById("aPButtons").innerHTML = ""
}

function saveImage(){
    document.getElementById("artProduct").style = "color: black;"
    document.getElementById("dl").disabled = true;
    var ydim = 500 + 40*(document.getElementById('versesdropdown').value.split(".")[0].length)
    html2canvas(document.querySelector("#artProduct"), {height: ydim, width: 1200}).then(canvas => {
        var link = document.createElement('a');
        var filename = document.getElementById('versesdropdown').value + ".acrosticart.jpg"
        if (typeof link.download === 'string') {
            link.href=canvas.toDataURL('image/jpg');
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        else {
            window.open(uri);
        }
        document.getElementById("dl").disabled = false;
        document.getElementById("artProduct").style = "color: gold;"
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
            str += "\xA0";
        }
    }
    if (document.getElementById('shems').checked){
        var wordsarray = verse.split("\xA0")
        var wa2 = []
        for (var j = 0; j<wordsarray.length; j++){
            var v2 = ""
            for (var i = 0; i<wordsarray[j].length;i++){
                if (/[א-ת ׃ ־]+$/.test(wordsarray[j].charAt(i))){
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
        verse = wa2.join("\xA0")
    }
    var indices = new Array(str.length)
    var index = 0;
    console.log(str.charAt(16))
    for (i = 0; i<verse.length; i++){
        if (index==17){
            console.log(str.charAt(17) + " ... " + verse.charAt(i))
        }
        if (verse.charAt(i) == str.charAt(index)){
            indices[index] = i
            if (index>0 && index%2 == 0){
                indices[index-1] = indices[index-2]+findMidSpace(verse.substring(indices[index-2],i))
            }
            index++;

        }
        if (verse.charAt(i) == "\xA0" && index>0 && index%2 == 0){
            indices[index-1] = i
        }

    }
/*    for (var i =3; i<indices.length; i+=2){
        indices[index-1] = indices[index-2]+findMidChar(verse.substring(indices[index-2],i),verse.charAt(i-1))

    }
*/
    for (var i =3; i<indices.length; i+=2){
        indices[i-1] = indices[i-2]+findMidChar(verse.substring(indices[i-2],indices[i]),verse.charAt(indices[i-1]))

    }
    return indices;
}

//run this function on verse.substring(letinds[i-1],letinds[i+1])
function findMidSpace(str){
    var j = Math.floor(str.length/2)
    for (var i =0; i<Math.ceil(str.length/2);i++){
        if (str.charAt(j+i) == "\xA0"){
            return (j+i)
        }
        if (str.charAt(j-i) == "\xA0"){
            return (j-i)
        }
    }
    return (str.length-1)
}

function findMidChar(str, char){
    var j = Math.floor(str.length/2)
    for (var i =0; i<Math.ceil(str.length/2);i++){
        if (str.charAt(j+i) == char){
            return (j+i)
        }
        if (str.charAt(j-i) == char){
            return (j-i)
        }
    }
    return (str.length-1)
}
//© 2020 Ezra Gordon.