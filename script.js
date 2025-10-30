const searchInput = document.getElementById('input')
const inputPokemonName = document.getElementById('searchBtn');
const randomPokemonBtn = document.getElementById('randomBtn');
const backgroundImg = document.getElementById('backgroundImg');
const changeBackground = document.getElementById('changeBackground');
const pokemonCard = document.querySelector('.pokemonCard');

// stores the data of the pokemon fetched from the api
let pokemonData;

// preloading the pokeball image for use in the pokemon card
const preloadPokeball = new Image();
preloadPokeball.src = './assets/card/pokeball.webp';

// preloading this image for use in the error card
const preloadErrorImage = new Image();
preloadErrorImage.src = './assets/card/eevee.webp';

// displays the shiny version of the pokemon if one exists
pokemonCard.addEventListener('click', (e) => { 
    if (e.target.classList.contains('shiny-icon')) {
        pokemonData.isShiny = !pokemonData.isShiny;
    
        // gets the pokemon image to update between the shiny and normal sprites
        const pokemonImage = document.querySelector('.pokemon');
        pokemonImage.src = pokemonData.isShiny ? pokemonData.shinyPokemon : pokemonData.normalPokemon;
    };
});

// pokemon type colors
const pokemonTypeCardBackground = {
    'bug': '#9f9d29',
    'dark': '#4e4747',
    'dragon': '#596fbc',
    'electric': '#caa203',
    'fairy': '#d677d8',
    'flying': '#74acd2',
    'fire': '#e5603d',
    'fighting': '#c2332b',
    'ground': '#a4753c',
    'grass': '#439938',
    'ghost': '#6e4570',
    'ice': '#36baba',
    'normal': '#828282',
    'psychic': '#eb6c90',
    'poison': '#9453cd',
    'rock': '#a8a580',
    'steel': '#729ca2',
    'water': '#329ae4',
};

// progress bar colors
const pokemonTypeProgressBars = {
    'bug': '#716f11',
    'dark': '#2f2b2b',
    'dragon': '#3c52a1',
    'electric': '#d9b536',
    'fairy': '#c358c5',
    'flying': '#3f8abc',
    'fire': '#b9310f',
    'fighting': '#a1231d',
    'ground': '#7d5626',
    'grass': '#1f7613',
    'ghost': '#5d2a5e',
    'ice': '#119b9b',
    'normal': '#575050',
    'psychic': '#d33c67',
    'poison': '#6e25ad',
    'rock': '#7b7960',
    'steel': '#4f7d83',
    'water': '#087bcd',
};

const backgrounds = [
    {
        src: './assets/bg/pokeball.webp',
        alt: ''
    },
    {
        src: './assets/bg/forest_meadow.webp',
        alt: ''
    },
    {
        src: './assets/bg/rocky_terrain.webp',
        alt: ''
    },
    {
        src: './assets/bg/thunder_plains.webp',
        alt: ''
    },
    {
        src: './assets/bg/seaside_beach.webp',
        alt: ''
    },
    {
        src: './assets/bg/snow_clearing.webp',
        alt: ''
    },
    {
        src: './assets/bg/lava_peaks.webp',
        alt: ''
    },
];

/*
    gets the current background from local storage, 
    otherwise it starts from the first one if none are saved in local storage
*/
let currentBackground = localStorage.getItem('bgIndex') || 0;

// loads the background by fetching the background image
function loadBackground() {
    const bg = backgrounds[currentBackground];

    backgroundImg.src = bg.src;
};

loadBackground();

changeBackground.addEventListener('click', () => {
    currentBackground++;
    
    // if the number of background images exceeds it's length it resets back to the first background
    if (currentBackground === backgrounds.length) {
        currentBackground = 0;
    };
    
    // saves the background image in local storage
    localStorage.setItem('bgIndex', currentBackground);
   
    loadBackground();
});

// fetches both the pokemon and species from the pokeapi endpoints
async function fetchPokemon(pokemon) {
    try {
        // fetches both endpoints simultaneously
        const [pokeApi, pokeSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
        ]);
        
        // checks if both responses are ok
        if (!pokeApi.ok) {
            throw new Error(`Pokémon Data Not Found ${pokeApi.status}`);
        };

        if (!pokeSpecies.ok) {
            throw new Error(`Pokédex Entry Not Found ${pokeSpecies.status}`);
        };
        
        // parses both data and species simultaneously
        const [data, species] = await Promise.all([
            pokeApi.json(),
            pokeSpecies.json()
        ]);

        // mapping out the data to an object in order to use key value pairs with the data
        pokemonData = {
                normalPokemon: data.sprites.other['official-artwork'].front_default,
                shinyPokemon: data.sprites.other['official-artwork'].front_shiny,
                shinyAvailable: data.sprites.other['official-artwork'].front_shiny !== null,
                isShiny: false,

                // /-/g, ' ' flag that replaces all hyphens with spaces
                name: data.name.replace(/-/g, ' '),
                id: data.id,
                height: data.height,
                weight: data.weight,
                type: data.types.map((type) => type.type.name).join(' & '),
                moveset: data.moves.map((moves) => moves.move.name).slice(0, 2).join(' & ').replace(/-/g, '\u00A0'),
                exp: data.base_experience,
                ability: data.abilities.map((ability) => ability.ability.name.replace(/-/g, ' ')).slice(0, 1),

                // using the .find() method to find the stats and using ?. to prevent errors if the data is not found by returning undefined
                hp: data.stats.find(({ stat }) => stat.name === 'hp')?.base_stat,
                attack: data.stats.find(({ stat }) => stat.name === 'attack')?.base_stat,
                defense: data.stats.find(({ stat }) => stat.name === 'defense')?.base_stat,
                specialAttack: data.stats.find(({ stat }) => stat.name === 'special-attack')?.base_stat,
                specialDefense: data.stats.find(({ stat }) => stat.name === 'special-defense')?.base_stat,
                speed: data.stats.find(({ stat }) => stat.name === 'speed')?.base_stat,

                // fetches the flavour text from the pokemon species endpoint and removes line breaks
                flavorText: species.flavor_text_entries
                .find(entry => entry.language.name === 'en')?.flavor_text
                .replace(/[\n\f]/g, ' ')
                .toLowerCase()
                .replace(/(^\w|\.\s+\w)/g, (char) => char.toUpperCase()) || 'No Pokédex Entry Was Found',
            };
        
        // displays the pokemon card after the data's been fetched
        pokemonCard.style.display = 'block';
        displayPokemonCard();
    }
    catch (error) {
        pokemonCard.style.display = 'block';
        displayErrorCard();
        console.log(error);
    };
};

// displays random pokemon card
randomPokemonBtn.addEventListener('click', async() => {
    const randomPokemon = Math.ceil(Math.random() * 1025);
    fetchPokemon(randomPokemon);
});

// searches for pokemon when using the input field and clears it after every search
function searchPokemonByName() {
    const pokemonSearch = searchInput.value;

    // checks if there's a value in the input field, and clears it after the search button is pressed
    searchInput.value = '';

    fetchPokemon(pokemonSearch);
};

// displays the pokemon card when pressing the enter key
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchPokemonByName();
    };
});

// maps out the pokemon card to display when there's an error
function displayErrorCard() {
    pokemonCard.innerHTML = `
        <div class="error">
            <img src="./assets/card/eevee.webp">
            <h1>404</h1>
            <p>The Pokémon your searching for could not be found, please try again!</p>
        </div>
    `;

    pokemonCard.style.backgroundColor = '#a30404';
};

// displays pokemon card based on user input when clicking search button
inputPokemonName.addEventListener('click', searchPokemonByName);

// maps out the pokemon data when it's fetched from pokeapi
function displayPokemonCard() {
    const currentPokemonImg = pokemonData.isShiny ? pokemonData.shinyPokemon : pokemonData.normalPokemon;
    const types = pokemonData.type.split(' & ');
    const primaryType = types[0];
    const secondaryType = types[1];

    /*
        {Math.max(pokemonData.hp, 35) -> this is to keep the text readable,
        in case the pokemon has low stats then it won't go below a certain threshold

        ${pokemonData.name.length >= 15 ? 'length' : ''} -> this is to add a className to adjust line height
    */
    pokemonCard.innerHTML = `
        <div>
            <div class="pokedex-number">
                <p>#${pokemonData.id}</p>
            </div>

            <div class="curved-background" style="background-color: ${secondaryType ? pokemonTypeCardBackground[secondaryType] : ''}"></div>

            <img class="spinner" draggable="false" src="./assets/card/spinner.svg" alt="">

            <img class="pokemon" draggable="false" src="${currentPokemonImg}" alt="">
            
            <img class="pokeball" draggable="false" src="./assets/card/pokeball.webp" alt="">
        </div>

        <div class="content">
            <div class="name ${pokemonData.name.length >= 15 ? 'length' : ''}">
                <div class="name-wrapper">
                    <h1>${pokemonData.name}</h1>
                    ${pokemonData.shinyAvailable ? '<img class="shiny-icon" src="./assets/card/shiny.webp" alt="" aria-label="toggles the shiny version of the Pokémon">' : ''}
                </div>
            </div>

            <div class="measurements">
                <p>Height : ${pokemonData.height}m</p>
                <p>Weight : ${pokemonData.weight}kg</p>
            </div>

            <div class="type">
                <p>Type : ${pokemonData.type}</p>
            </div>

            <div class="moveset">
                <p>moveset : ${pokemonData.moveset}</p>
            </div>

            <div class="stats">
                <h2>Pokémon Stats</h2>
                <div class="stats-wrapper">
                    <p>base : ${pokemonData.exp} <span>exp</span></p>
                    <p>ability : ${pokemonData.ability}</p>
                </div>
            </div>

            <div class="pokedex-entry">
                <h2>Pokédex Entry</h2>
                <p>${pokemonData.flavorText}</p>
            </div>

            <div class="pokemon-ivs">
                <h2>pokémon IV's</h2>
                <div class="progress-bars">
                    <span>HP | ${pokemonData.hp}</span>
                    <progress value="${Math.max(pokemonData.hp, 35)}" max="100"></progress>
                </div>

                <div class="progress-bars">
                    <span>ATK | ${pokemonData.attack}</span>
                    <progress value="${Math.max(pokemonData.attack, 35)}" max="100"></progress>
                </div>

                <div class="progress-bars">
                    <span>DEF | ${pokemonData.defense}</span>
                    <progress value="${Math.max(pokemonData.defense, 35)}" max="100"></progress>
                </div>

                <div class="progress-bars">
                    <span>SP ATK | ${pokemonData.specialAttack}</span>
                    <progress value="${Math.max(pokemonData.specialAttack, 35)}" max="100"></progress>
                </div>

                <div class="progress-bars">
                    <span>SP DEF | ${pokemonData.specialDefense}</span>
                    <progress value="${Math.max(pokemonData.specialDefense, 35)}" max="100"></progress>
                </div>

                <div class="progress-bars">
                    <span>SPD | ${pokemonData.speed}</span>
                    <progress value="${Math.max(pokemonData.speed, 35)}" max="100"></progress>
                </div>
            </div>
        </div>
    `;

    // set primary pokemon type color
    pokemonCard.style.backgroundColor = pokemonTypeCardBackground[primaryType];

    // get elements after innerHTML is set
    const pokemonImage = document.querySelector('.pokemon');
    const spinner = document.querySelector('.spinner');

   // sets the colour of the progress bars
    pokemonCard.style.setProperty('--clr-progressBar', pokemonTypeProgressBars[primaryType]);

    // checks which stats will hit the max value in order to add the border radius in chrome
    document.querySelectorAll('progress').forEach(progress => {
        progress.classList.toggle('maxStats', progress.value >= progress.max);
    });

    // hide spinner when pokemon image has loaded
    pokemonImage.onload = () => {
        spinner.style.display = 'none';

        // preload shiny version if one is available
        if (pokemonData.shinyAvailable) {
            const shinyPreload = new Image();
            shinyPreload.src = pokemonData.shinyPokemon;
        };
    };
};