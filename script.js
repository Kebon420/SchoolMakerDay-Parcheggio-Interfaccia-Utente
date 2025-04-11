//Per evitare il cors da opera: opera --disable-web-security --disable-site-isolation-trials --user-data-dir="c:\insecurebrowserdata"

//Cambia la variabile se vuoi usare il server rabbits pubblico
let locale = true

//Inserisci l'ip della macchina
let ipLocale = "192.168.1.39"


let baseUrl
let prefissoVariabili = ""
if (locale){
    baseUrl = `http://${ipLocale}/UI/rabbits-main/`
}else{
    baseUrl = "https://www.schoolmakerday.it/rabbits/"
    prefissoVariabili = "parcheggioArduino"
}


//Gli enable fanno in modo di accettare variazioni dei comandi dall'arduino
let nomiVariabili = [
                    "ELmp",     //Enable  Lampioni
                    "CLmp",     //Comando Lampioni
                    "SLmp",     //Stato   Lampioni

                    "ESrvEnt",  //Enable  Servo Entrata
                    "CSrvEnt",  //Comando Servo Entrata
                    "SSrvEnt",  //Stato   Servo Entrata

                    "ESrvUsc",  //Enable  Servo Uscita
                    "CSrvUsc",  //Comando Servo Uscita
                    "SSrvUsc",  //Stato   Servo Uscita

                    "posti", //Numero posti disponibili
                    ]



async function rabbits(key, valore = null){
    key = prefissoVariabili + key

    let url = baseUrl
    if(valore === null){
        url += `get.php?key=${key}`
    }else{
        url += `set.php?key=${key}&value=${valore}`
    }
    console.log(url)
    
    let RispostaRabbits = await fetch(url); // ASPETTA la risposta
    let data = await RispostaRabbits.json(); // ASPETTA la conversione in JSON
    return data
}

async function rabbitsToggle(key){
    let valoreChiave = await rabbits(key)
    valoreChiave = valoreChiave["data"]["value"]
    
    if (valoreChiave == "true"){
        valoreChiave = true
    }else{
        valoreChiave = false
    }
    console.log(!valoreChiave)
    await rabbits(key, !valoreChiave)
}

async function rabbitsOttieniTutteLeKey(){
    let url = baseUrl + `getkeys.php?keys=[`
    
    nomiVariabili.forEach(element => {
        url += '"' + prefissoVariabili + element + '",'
    });
    url = url.slice(0, -1)
    url += "]"

    console.log(url)

    let RispostaRabbits = await fetch(url); // ASPETTA la risposta
    let data = await RispostaRabbits.json(); // ASPETTA la conversione in JSON
    console.log(data)
    return data
    }

async function rabbitsDichiaraTutteLeKey(){
    nomiVariabili.forEach(element => {
        rabbits(element, false).then(data => console.log(data))
    });
}

async function test(){
    rabbitsOttieniTutteLeKey().then(data => console.log(data))
}

async function sistemaUI(data){
    document.querySelector(".display").setAttribute("src",`display7Segmenti/${data["data"]["posti"]["value"]}.png`);
    
    if(data["data"]["SSrvEnt"]["value"] == "true"){
        document.querySelector("#entrata").setAttribute(
        "style",
            "background-color: rgba(141, 252, 97, 0.5)"
        )
    }else{
        document.querySelector("#entrata").setAttribute(
            "style",
                "background-color: rgba(255, 146, 146, 0.5)"
            )
    }

    if(data["data"]["SSrvUsc"]["value"] == "true"){
        document.querySelector("#uscita").setAttribute(
        "style",
            "background-color: rgba(141, 252, 97, 0.5)"
        )
    }else{
        document.querySelector("#uscita").setAttribute(
            "style",
                "background-color: rgba(255, 146, 146, 0.5)"
            )
    }

    if(data["data"]["SLmp"]["value"] == "true"){
        document.querySelector("#lampioni").setAttribute(
        "style",
            "background-color: rgba(141, 252, 97, 0.5)"
        )
    }else{
        document.querySelector("#lampioni").setAttribute(
            "style",
                "background-color: rgba(255, 146, 146, 0.5)"
            )
    }

}

async function loop(){
    rabbitsOttieniTutteLeKey().then(data => sistemaUI(data))
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log("loop")
    loop()
}

loop()