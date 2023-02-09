let introMessage = document.getElementById("intro");
let mainBody = document.getElementById("dataSWAPI");
let subBody = document.getElementById("subdataSWAPI");
let navBar = document.querySelector("nav");
let mainControl = document.getElementById("dataSWAPInav");
let dataPacket;
let dataFiltered;

let keyValue = [
    'title',
    'opening_crawl',
    'director',
    'producer',
    'release_date',
    'name',
    'height',
    'mass',
    'hair_color',
    'skin-color',
    'eye_color',
    'gender',
    'climate',
    'diameter',
    'gravity',
    'orbital_period',
    'population',
    'rotation_period',
    'surface_water',
    'terrain',
    'average_height',
    'average_lifespan',
    'classification',
    'designation',
    'language',
    'cargo_capacity',
    'consumables',
    'cost_in_credits',
    'crew',
    'hyperdrive_rating',
    'length',
    'manufacturer',
    'model',
    'passengers',
    'starship_class',
    'films',
];


//-------------------------
// EVENT LISTENER
//-------------------------


navBar.addEventListener("click", navListener);
mainControl.addEventListener("click", maincontrolListener);
mainBody.addEventListener("click", bodyListener);


//-------------------------
// FETCH REQUEST
//-------------------------


function listenerFunction(url) {
    return fetch(url)
            .then((response) => response.json())
            .then((resultValue) => (mainBodyItems(resultValue)))
            .catch((error) => {
                alert('Looks like there was a problem! Please, let us know!');
                console.log('Looks like there was a problem!', error);
            })
}


function filmsFetch(url) {
    return fetch(url)
            .then((response) => response.json())
            .then((resultValue) => {
                subBody.innerHTML += ('<p class="subdataParagraph">' + resultValue.title + '</p>');
            })
            .catch((error) => {
                alert('Looks like there was a problem! Please, let us know!');
                console.log('Looks like there was a problem!', error);
            })
}


//-------------------------
// EVENT HANDLE / CALL BACK FUNCTIONS
//-------------------------


function navListener(acction) {
    introMessage.innerHTML = ''; //Clear intro message from UI
    let idValue = acction.target.getAttribute("id");
    let url = 'https://swapi.dev/api/' + idValue;
    listenerFunction(url);
}


function maincontrolListener(acction) {
    let url; 
    if(acction.target.id === "previous") {
        url = dataPacket.previous;
    } else {
        url = dataPacket.next;
    }
    listenerFunction(url);
}


function bodyListener(acction) {
    let bodyList = acction.target.innerText;
    let referenceValue = dataPacket.results;
    let insideReference;
    dataFiltered = ''; //Refresh variable
    subBody.innerHTML = ''; //Refresh variable
    for(let i = 0; i < referenceValue.length; i++) {
        if((referenceValue[i].title === bodyList) || (referenceValue[i].name === bodyList)) {
            insideReference = referenceValue[i];
            for(let j = 0; j < keyValue.length; j++) {
                dataFiltered = insideReference[keyValue[j]];
                if((dataFiltered !== undefined) && (keyValue[j] !== 'films')) {
                    subBody.innerHTML += ('<h1 class="subdataHeadings">' + (keyValue[j]) + '</h1>') + ('<p class="subdataParagraph">' + dataFiltered + '</p>');
                } else if ((dataFiltered !== undefined) && (keyValue[j] === 'films')) {
                    subBody.innerHTML += ('<h1 class="subdataHeadings">' + (keyValue[j]) + '</h1>');
                    dataFiltered.map((items) => filmsFetch(items));
                }
            }
        }
    }
}


function mainBodyItems(responseJson) {
    dataPacket = responseJson;
    dataFiltered = ''; //Refresh variable
    subBody.innerHTML = ''; //Refresh variable
    let mainBodyHTML = responseJson.results.map((items) => {
        let innerValue = items.name || items.title;
        return '<a class="dataSWAPIitems">' + innerValue + '</a><br>'}).join('');
    mainBody.innerHTML = '<p class="dataSWAPIitemsInstruction">Click below for more details</p><br>' + mainBodyHTML;
    controlToggle(responseJson);
}


function controlToggle(data) {
    if((data.previous !== null) && (data.next !== null)) {
        mainControl.innerHTML =   '<a class="toggle-link" id="previous" href="#">Previous page</a><a class="toggle-link" id="next" href="#">Next page</a>';
    } else if(data.previous !== null) {
        mainControl.innerHTML =   '<a class="toggle-link" id="previous" href="#">Previous page</a>';
    } else if(data.next !== null) {
        mainControl.innerHTML =  '<a class="toggle-link" id="next" href="#">Next page</a>';
    } else {
        mainControl.innerHTML =  '';
    }
}
