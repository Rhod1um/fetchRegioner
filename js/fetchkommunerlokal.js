console.log("vi er i fetchKommunerlokal")
const urlRegioner = "http://localhost:8080/kommuner" //skal hente fra egen database, kalder getmapping endpoint her

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

//kommunetabel i anden fil kan ses her da det er global variabel!


const pbFetchRegioner = document.getElementById("pbFetchRegioner")
pbFetchRegioner.addEventListener('click', showAllRegioner)

