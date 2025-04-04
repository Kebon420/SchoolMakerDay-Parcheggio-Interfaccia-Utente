//Per evitare il cors da opera: opera --disable-web-security --disable-site-isolation-trials --user-data-dir="c:\insecurebrowserdata"

let nomiVariabili = [
                    "EnableLampioni",
                    "Lampioni",

                    "EnableServoEntrata",
                    "ServoEntrata",

                    "EnableServoUscita",
                    "ServoUscita"
                    ]


async function rabbits(key, valore = null){
    key = "parcheggioArduino" + key

    let url
    if(valore === null){
        url = `https://www.schoolmakerday.it/rabbits/get.php?key=${key}`
    }else{
        url = `https://www.schoolmakerday.it/rabbits/set.php?key=${key}&value=${valore}`
    }
    
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
    let url = `https://www.schoolmakerday.it/rabbits/getkeys.php?keys=[`
    
    nomiVariabili.forEach(element => {
        url += '"parcheggioArduino' + element + '",'
    });
    url = url.slice(0, -1)
    url += "]"

    console.log(url)

    let RispostaRabbits = await fetch(url); // ASPETTA la risposta
    let data = await RispostaRabbits.json(); // ASPETTA la conversione in JSON
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