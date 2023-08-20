console.log("vi er i createtable")

const pbCreaeTable = document.getElementById("pbCreateTable")
const tblKommune = document.getElementById("tblKommune")

function createTable(kommune){
    console.log(kommune.navn)
    if (!kommune.kode) return //stoper hvis kommune ikke har kode/id/PK

    let cellCount = 0
    let rowCount = tblKommune.rows.length  //vi kalder den en masse gange og hver gang tilføjes en række så counts
    //tæller opad
    let row = tblKommune.insertRow(rowCount)   //insertRow er en html funktion? som indsætter en række
    row.id = kommune.navn;

    let cell = row.insertCell(cellCount++) //siger at html rækken skal have indsat celler
    //for hver kommune skal der laves en række hvor inde i skal der være celle for navn og kode
    //som det ses i html tabellen i html siden
    cell.innerHTML = kommune.kode

    cell = row.insertCell(cellCount++)
    let atag = document.createElement("a")
    atag.setAttribute("href", kommune.href)
    atag.innerText = kommune.navn
    cell.appendChild(atag)

    cell = row.insertCell(cellCount++)
    cell.innerHTML = kommune.navn

    cell = row.insertCell(cellCount++)
    cell.innerHTML = kommune.region.navn   //vi får region objekt gennem kommune objektet

    cell = row.insertCell(cellCount++)
    let inpHrefPhoto = document.createElement("input")
    inpHrefPhoto.type="text"
    inpHrefPhoto.setAttribute("value", kommune.hrefPhoto)
    cell.appendChild(inpHrefPhoto)

    cell = row.insertCell(cellCount++)
    let img = document.createElement("img")
    img.setAttribute("src", kommune.hrefPhoto) //setter attributten src på det nye img html element
    img.setAttribute("alt", "alt text")
    img.setAttribute("width", 150)
    img.setAttribute("height", 150)
    cell.appendChild(img)

    //update sender til kommune PUT
    cell = row.insertCell(cellCount++)
    let pbUpdate = document.createElement("button")
    pbUpdate.textContent = "Opdater" //knappen hedder opdater
    pbUpdate.className = "buttonupdate" //adder css property buttonupdate til knappen
    pbUpdate.addEventListener('click', function(kommune){ //skal kommune være argument?
        kommune.hrefPhoto = inpHrefPhoto.value
        updateKommune(kommune)
    })
    cell.appendChild(pbUpdate)

    //delete sender til kommune delete
    //Delete knap, sender kommune til DELETE
    cell = row.insertCell(cellCount++)
    let pbDelete = document.createElement("button")
    pbDelete.textContent = "Delete"
    pbDelete.className = "buttondelete"
    pbDelete.addEventListener('click', function () {
        const rowdel = document.getElementById(kommune.navn) //får id på kommune og sletter rækken
        rowdel.remove();
        deleteKommune(kommune)
    })
    cell.appendChild(pbDelete)
}

async function deleteKommune(kommune){
    console.log("slet kommune " + kommune.navn)
}

async function updateKommune(kommune){
    console.log(kommune.hrefPhoto)
    console.log(kommune)
    const response = await restUpdateKommune(kommune)
    console.log(response)
}

async function restUpdateKommune(kommune){
    const url = "http://localhost:8080/kommune/" + kommune.kode; //det her skal bruges til at lægge det ind i databasen
    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json" //her fortæller vi httprequesten at vi sender json, lav ikke stavefejl
        },
        body: ""
    }

    const jsonString = JSON.stringify(kommune);
    fetchOptions.body = jsonString;
    //calls backend and wait for return
    const response = await fetch(url, fetchOptions);
    console.log(response);
    if (!response.ok) {
        console.log("Det gik ikke godt med update");
    };
    return response;
}

function actionCreateTable(){
    regionList.forEach(createTable)  //hvorfor virker det med regionList men ikke kommuneList??
}

pbCreaeTable.addEventListener('click', actionCreateTable)

//til 24h eksamen efter aflevering lav branch og byg videre på det
//man skal bygge videre på det, det vil erik også sige
//påpeg hvad man har ændret/gjort bedre/fejl løst til eksamen

//på photohref skal være links til billeder

//nogle censorer vil gerne have at man kan delete noget kun i front end og at det ikke sendes til databasen og
//ændre noget der