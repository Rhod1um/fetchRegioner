console.log("vi er i formkommune")

document.addEventListener('DOMContentLoaded', createFormEventListener)
let formkommune

function createFormEventListener(){
    formkommune = document.getElementById("formKommune")
    formkommune.addEventListener("submit", handleFormSubmit)
}


async function handleFormSubmit(event){
    //vi handler submit, vi gør det manuelt her, i stedet for i vores html fil når formen submittes
    //så html default behavior for formen skal ikke ske, nu gør vi det manuelt i js:
    event.preventDefault() //forhindre at html laver en POST request
    const form = event.currentTarget //er eh slags unit test her:
    const url = form.action
    console.log(form)
    console.log(url) //ser om vi har fat i de rigtige ting
    console.log(form === formkommune)

    try { //objekt skal laves af det der kommer ind af formen
        const formData = new FormData(form)

        console.log(formData)
        const responseData = await postFormData(url, formData)

    } catch (error){
        alert(error.message)  //godt at bruge alert til debugging som alternativ til console.log
        console.log(error)
    }
}

async function postFormData(url, formData) {
    const plainFormData = Object.fromEntries(formData.entries())
    console.log(plainFormData)

    const  ix = ddRegioner.selectedIndex
    console.log(ix)
    const linje = ddRegioner[ix] //ix er property, giv mig det region objekt som er trykket på
    plainFormData.region = linje.region
    console.log(linje.region)

    //const region = {}   //vi hardoder region, sværeste at lægge FK på child
    //region.kode = "3432"
    plainFormData.region = el.region //hardcoded region lægges på form data så regionen kommer med i db

    const formDataJsonString = JSON.stringify(plainFormData)

    const fetchOptions = {
        method: "POST",
        headers: {
            "content-type": "application/json" //her fortæller vi httprequesten at vi sender json, lav ikke stavefejl
        },
        body: formDataJsonString
        //tidligeree har vi defineret body ={} før,  derfor body: body. skal bare være tomt objekt
        //når der hentes ting og sættes ind i det, men her laver vi selv et så derfor formDataJsonString
    }

    const response = await fetch(url, fetchOptions) //kalder backend

    if (!response.ok){ //hvis det ikke går godt kan man smide fejl ud sådan
        const errorMessage = await response.text()
        throw new Error(errorMessage)
    }
    return response.json() //returnere til der hvor funktionen blev kaldt. Erik ved ikke hvorfor vi skal returnere noget
}
//husk både at reloade workbench og querie tabellerne igen for at opdatere

//nu skal vi gøre at en kommune ikke kan oprettes uden en tilhørende region. vigtigt
//det kan annoteres at en region ikke må være null i en kommune i jpa/java
//kan også gøres i workbench

//prøver man så at gemme en kommune uden en FK som findes (region) får man 500 server fejl
//senere gør vi at vi får en bedre fejlmeddelsese

window.addEventListener('load', showAllRegioner)

const urlRegioner = "http://localhost:8080/kommuner" //skal hente fra egen database, kalder getmapping endpoint her

function fetchAny(url) {
    console.log(url)
    return fetch(url).then((response) => response.json())
}

const ddRegioner = document.getElementById("ddRegioner")

let el
function fillRegionDropDown(region) {
    el = document.createElement("option")
    el.textContent = region.navn
    el.value = region.kode //man kan ikke putte objekt ind i value, så bliver det til en streng "objekt"
    el.region = region //her lægges en ny property så ind i objektet, kan man godt, intet private i js
    //hel region objekt ligger i drop down
    ddRegioner.appendChild(el)
}
regionList = [] //så den er global og kan bruges senere
async function showAllRegioner() {
    regionList = await fetchAny(urlRegioner); //regionliste er en liste hvis man får liste tilbage,
    //og objekt hvis man kun får et enkelt objekt tilbage
    console.log(regionList)
    regionList.forEach(fillRegionDropDown)
}
//erik har lavet at regioner puttes i array i seperat fil der hedder fetchregioner2
//hvor kaldes den fra?
// getRegioner() sådan et metodekald alene gør at funktionen kaldes når js filen læses
//han kalder en async getRegioner bare sådan ^^og inde i dens await kalder han funktion i den anden fil
