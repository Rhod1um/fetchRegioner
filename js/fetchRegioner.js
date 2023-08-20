console.log("vi er i fetchregioner")
const urlRegioner = "https://api.dataforsyningen.dk/regioner"
const urlPostRegion = "http://localhost:8080/region" //postmappingens endpoint, så fetch kan kalde det

//man bør have skrevet ting neutralt her så det kunne bruges til både kommuner og regioner
//da koden er den samme og den er bare copy pastet ind i fetchKommuner.js

function fetchAny(url) {
    console.log(url)
    return fetch(url).then((response) => response.json())
}

const ddRegioner = document.getElementById("ddRegioner")

function fillRegionDropDown(region) {
    const el = document.createElement("option")
    el.textContent = region.navn
    el.value = region.kode //man kan ikke putte objekt ind i value, så bliver det til en streng "objekt"
    el.region = region //her lægges en ny property så ind i objektet, kan man godt, intet private i js
    ddRegioner.appendChild(el)
}
regionList = [] //så den er global og kan bruges senere
async function showAllRegioner() {
    regionList = await fetchAny(urlRegioner); //regionliste er en liste hvis man får liste tilbage,
    //og objekt hvis man kun får et enkelt objekt tilbage
    console.log(regionList)
    regionList.forEach(fillRegionDropDown)
}



let body = {}  //objekt hvor vores region vi lige har lavet skal ind i. Det objekt vi får ind i postmappingen
//som er lavet til java.

const postRegionRequest = {   //det her skal bruges til at lægge det ind i databasen
    method: "POST",
    headers: {
        "content-type": "application/json" //her fortæller vi httprequesten at vi sender json, lav ikke stavefejl
    },
    body: body
}

const pbFetchRegioner = document.getElementById("pbFetchRegioner")
pbFetchRegioner.addEventListener('click', showAllRegioner) //når async funktionen skal kaldes via eventlistener
// så skal der være en metode imellem, eventlistener skal
// kalde noget som så kalder async, det vil erik have, men det betyder ikke noget

function postRegioner(region){
    console.log("postregion funktion")
    body = JSON.stringify(region)  //funktion laver json om til streng
    console.log(body)
    postRegionRequest.body = body  //klar til at sende det
    fetch(urlPostRegion, postRegionRequest).catch((error) => console.log(error)) //lav post, kalder postmappingen
    //vi laver postRegionRequest objektet oven over fordi fetch skal have bestemte properties i det objekt
    //det får ind
    //pgRegionRequest opbjektet er en varebil hvor ting skal pakkes ind før det sendes til fetch?
}

function actionPostAllRegioner(){  //erik bruger action på trykknap-funktioner

    if (regionList){ //erik gætter, tomt array er false og fyldt array er true
        console.log("post alle regioner")
        regionList.forEach(postRegioner)
        console.log("foreach er færdig")
    } else {
        console.log("tryk på fetchregion-knappen for at se regioner")
    }
}

const gemRegioner = document.querySelector("#gemRegioner")
gemRegioner.addEventListener('click', actionPostAllRegioner)

//fejl fordi backend og frontend er forskellige projekter så backend stoler ikke på frontend
//vi vil gøre at alle kan kalde vores endpoints, gøres med CrossOrigin i contorllerne

//i java lægges kun det ind i databasen som har en setter så hvis href ikke har en setter i model
//så lægges den attribut ikke med ind
