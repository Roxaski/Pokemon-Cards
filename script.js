const pokemonListLeft = document.getElementById('pokemon-list-left');
const pokemonListRight = document.getElementById('pokemon-list-right');
const btn = document.querySelector('.btn');
const input = document.querySelector('input');

//RANDOMISE POKEMON
btn.addEventListener('click', (e) => {
    //prevent default button action
    e.preventDefault();

    const randomPokemon = Math.ceil(Math.random() * 1025)
    const promises = [];
    const url = `https://pokeapi.co/api/v2/pokemon/${randomPokemon}`;
    /*
    We're pushing the promise that is returned from fetching the data from the API,
    which is then getting the responsove and converting to json format, 
    which then returns a promise that is added to the promises array
    */
    promises.push(fetch(url)
    .then((res) => res.json()));
    /*
    All asynchronous calls run parallel to eachother and return a single promise, 
    which we then get the results in our results object
    */
    Promise.all(promises)
    .then((results) => {
        // We get our results, then take each result, which we then return an object for each result (returning an object with an arrow function, requires you to wrap it in parentheses)
        const pokemon = results.map((result) => 
        ({
            image: result.sprites['front_default'],
            name: result.name.replace(/-/g,' '),
            id: result.id,
            height: result.height,
            weight: result.weight,
            type: result.types.map((type) => type.type.name).join(' & '),
            ability: result.abilities.map((ability) => ability.ability.name).slice(0, 1).join(' ').replace(/-/g,' '),
            moves: result.moves.map((moves) => moves.move.name).slice(0, 4).join(', ').replace(/-/g,' '),
            hp: result.stats.find(({stat}) => stat.name === 'hp')?.base_stat,
            attack: result.stats.find(({stat}) => stat.name === 'attack')?.base_stat,
            defense: result.stats.find(({stat}) => stat.name === 'defense')?.base_stat,
            specialAttack: result.stats.find(({stat}) => stat.name === 'special-attack')?.base_stat,
            specialDefense: result.stats.find(({stat}) => stat.name === 'special-defense')?.base_stat,
            speed: result.stats.find(({stat}) => stat.name === 'speed')?.base_stat
        }));

        displayRandomPokemon(pokemon);
    });
});

//Calling the function and passing in the pokemon variable, and mapping out the data in said variable
const displayRandomPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon.map((details) =>
        `<ul>
            <li class="card pokemon-type type-${details.type}">
                <img draggable="false" class="pokemon" src="${details.image}">
                <img draggable="false" class="pokeball" src="./assets/pokeball.webp" alt="">
                <h2>${details.name}</h2>
                <h3><span>Pokédex Entry #${details.id}</span></h3>

                <div class="info-container">
                    <div class="info">
                        <p>
                            <i class="fa-solid fa-ruler"></i>
                            <span class="stats-title"> Height | </span> 
                            ${details.height + `.0`}
                            <span id="inches">"</span>
                        </p>

                        <p>
                            <i class="fa-solid fa-weight-hanging"></i>
                            <span class="stats-title"> Weight | </span> 
                            ${details.weight + `<span id="lbs"> .lbs </span>`}
                        </p>

                        <p>
                            <i class="fa-solid fa-tag"></i>
                            <span class="stats-title"> Type | </span> 
                            ${details.type}
                        </p>

                        <p>
                            <i class="fa-solid fa-certificate"></i>
                            <span class="stats-title"> Ability | </span> 
                            ${details.ability}
                        </p>

                        <p id="moveset">
                            <i class="fa-solid fa-compass"></i>
                            <span class="stats-title"> Moves | </span> 
                            ${details.moves}
                        </p>
                    </div>
                    <div class="stats-container">
                        <h4>Base Pokémon Stats | </h4>

                        <p>
                            <i class="fa-solid fa-heart"></i> HP | 
                            <span>${details.hp}</span> 
                            <progress class="progress-bar type-${details.type}" value="${details.hp}" max="100"></progress>
                        </p>

                        <p>
                            <i class="fa-solid fa-hand-fist"></i> Atk | 
                            <span>${details.attack}</span>
                            <progress class="progress-bar type-${details.type}" value="${details.attack}" max="100"></progress>
                        </p>
                        
                        <p>
                            <i class="fa-solid fa-shield"></i> Def | 
                            <span>${details.defense}</span> <progress class="progress-bar type-${details.type}" value="${details.defense}" max="100">
                            </progress>
                        </p>

                        <p>
                            <i class="fa-solid fa-wand-magic-sparkles"></i> 
                            S. Atk | <span>${details.specialAttack}</span> 
                            <progress class="progress-bar type-${details.type}" value="${details.specialAttack}" max="100"></progress>
                        </p>

                        <p>
                            <i class="fa-solid fa-shield-halved"></i>
                            S. Def | <span>${details.specialDefense}</span> 
                            <progress class="progress-bar type-${details.type}" value="${details.specialDefense}" max="100">
                            </progress>
                        </p>

                        <p>
                            <i class="fa-solid fa-bolt"></i> 
                            Speed | <span>${details.speed}</span> 
                            <progress class="progress-bar type-${details.type}" value="${details.speed}" max="100"></progress>
                        </p>
                    </div>
                </div>
            </li>
        </ul>`
    //Since map returns an array, using .join('') then converts it into a string
    ).join('');

    //Taking the variable and setting it as the innerHTML
    pokemonListLeft.innerHTML = pokemonHTMLString;
};

//SEARCH POKEMON
input.addEventListener('keydown', (e) => {

    //listening for the Enter key to be pressed
    if (e.key === 'Enter') {
        //prevent the default action of the key in case it's needed
        e.preventDefault();
    } else {   
        return;
    };

    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
    const promises = [];
    /*
    We're pushing the promise that is returned from fetching the data from the API,
    which is then getting the responsove and converting to json format, 
    which then returns a promise that is added to the promises array
    */
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    promises.push(fetch(url)
    .then((res) => res.json()));
    /*
    All asynchronous calls run parallel to eachother and return a single promise, 
    from which we then get our results in our results object,
    which we then map out the results and pick the data that we want to display
    */
    Promise.all(promises)
    .then((results) => {
        // We get our results, then take each result, which we then return an object for each result (returning an object with an arrow function, requires you to wrap it in parentheses)
        const pokemon = results.map((result) => 
        ({
            image: result.sprites['front_default'],
            name: result.name.replace(/-/g,' '),
            id: result.id,
            height: result.height,
            weight: result.weight,
            type: result.types.map((type) => type.type.name).join(' & '),
            ability: result.abilities.map((ability) => ability.ability.name).slice(0, 1).join(' ').replace(/-/g,' '),
            moves: result.moves.map((moves) => moves.move.name).slice(0, 4).join(', ').replace(/-/g,' '),
            hp: result.stats.find(({stat}) => stat.name === 'hp')?.base_stat,
            attack: result.stats.find(({stat}) => stat.name === 'attack')?.base_stat,
            defense: result.stats.find(({stat}) => stat.name === 'defense')?.base_stat,
            specialAttack: result.stats.find(({stat}) => stat.name === 'special-attack')?.base_stat,
            specialDefense: result.stats.find(({stat}) => stat.name === 'special-defense')?.base_stat,
            speed: result.stats.find(({stat}) => stat.name === 'speed')?.base_stat
        }));
        displayPokemon(pokemon);
    });

    //clears the input's value after pressing Enter key
    e.currentTarget.value = "";
});

//Calling the function and passing in the pokemon variable, and mapping out the data in said variable
const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon.map((details) =>
        `<ul>
            <li class="card pokemon-type type-${details.type}">
                <img draggable="false" class="pokemon" src="${details.image}">
                <img draggable="false" class="pokeball" src="./assets/pokeball.webp" alt="">
                <h2>${details.name}</h2>
                <h3><span>Pokédex Entry #${details.id}</span></h3>

                <div class="info-container">
                    <div class="info">
                        <p>
                            <i class="fa-solid fa-ruler"></i>
                            <span class="stats-title"> Height | </span> 
                            ${details.height + `.0`}
                            <span id="inches">"</span>
                        </p>

                        <p>
                            <i class="fa-solid fa-weight-hanging"></i>
                            <span class="stats-title"> Weight | </span> 
                            ${details.weight + `<span id="lbs"> .lbs </span>`}
                        </p>

                        <p>
                            <i class="fa-solid fa-tag"></i>
                            <span class="stats-title"> Type | </span> 
                            ${details.type}
                        </p>

                        <p>
                            <i class="fa-solid fa-certificate"></i>
                            <span class="stats-title"> Ability | </span> 
                            ${details.ability}
                        </p>

                        <p id="moveset">
                            <i class="fa-solid fa-compass"></i>
                            <span class="stats-title"> Moves | </span> 
                            ${details.moves}
                        </p>
                    </div>
                    <div class="stats-container">
                        <h4>Base Pokémon Stats | </h4>

                        <p>
                            <i class="fa-solid fa-heart"></i> HP | 
                            <span>${details.hp}</span> 
                            <progress class="progress-bar type-${details.type}" value="${details.hp}" max="100"></progress>
                        </p>

                        <p>
                            <i class="fa-solid fa-hand-fist"></i> Atk | 
                            <span>${details.attack}</span>
                            <progress class="progress-bar type-${details.type}" value="${details.attack}" max="100"></progress>
                        </p>
                        
                        <p>
                            <i class="fa-solid fa-shield"></i> Def | 
                            <span>${details.defense}</span> <progress class="progress-bar type-${details.type}" value="${details.defense}" max="100">
                            </progress>
                        </p>

                        <p>
                            <i class="fa-solid fa-wand-magic-sparkles"></i> 
                            S. Atk | <span>${details.specialAttack}</span> 
                            <progress class="progress-bar type-${details.type}" value="${details.specialAttack}" max="100"></progress>
                        </p>

                        <p>
                            <i class="fa-solid fa-shield-halved"></i>
                            S. Def | <span>${details.specialDefense}</span> 
                            <progress class="progress-bar type-${details.type}" value="${details.specialDefense}" max="100">
                            </progress>
                        </p>

                        <p>
                            <i class="fa-solid fa-bolt"></i> 
                            Speed | <span>${details.speed}</span> 
                            <progress class="progress-bar type-${details.type}" value="${details.speed}" max="100"></progress>
                        </p>
                    </div>
                </div>
            </li>
        </ul>`
    //Since map returns an array, using .join('') then converts it into a string
    ).join('');

    //Taking the variable and setting it as the innerHTML
    pokemonListRight.innerHTML = pokemonHTMLString;
};