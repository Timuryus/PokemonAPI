const URL = "https://pokeapi.co/api/v2/";
const limit = 20;
const $wrapper = document.querySelector(".wrapper");
const $container = document.querySelector(".container");
const $next = document.querySelector(".next");
const $prev = document.querySelector(".prev");
const $currentPage = document.querySelector(".currentPage");
const $allPages = document.querySelector(".allPages");
const $pageInput = document.querySelector(".pageInput");
const $inputButton = document.querySelector(".inputButton");

let offsetCounter = 0;
let currentPage = 1;
let selectPage = 0;

const all_Pokemon = 1126;
const all_Pages = Math.floor(all_Pokemon / limit);

window.addEventListener("load", () => {
  getData(`${URL}pokemon`, `limit=${limit}&offset=${offsetCounter}`, (cb) => {
    cardTemplate(cb.results);
  });
});

function getData(url, query, callBack) {
  fetch(`${url}?${query}`)
    .then((res) => res.json())
    .then((response) => {
      callBack(response);
    });
}

function cardTemplate(base) {
  const markup = base
    .map(
      ({ name, url }) =>
        `
      <div class="card" onclick = "getSingleData('${url}')">
        ${name}
      </div>
    `
    )
    .join("");

  $wrapper.innerHTML = markup;
}

function getSingleData(url) {
  getData(url, "", (cb) => {
    $container.innerHTML = `
        <div class = "single">
           <div class ="singleWrapper">
                <img src = "${cb.sprites.other.dream_world.front_default}" alt = "pokemon">
                <ul>
                    <li>
                        Name:<span>${cb.name}</span>
                    </li>
                    <li>
                        Weight:<span>${cb.weight}</span>
                    </li>
                    <li>
                        Height:<span>${cb.height}</span>
                    </li>
                    <li>
                        Abilities: <span>${cb.abilities[0].ability.name}</span>
                    </li>
                </ul>
          </div>
        <div class="poke_stats">
            <div class="stats">
              <h3>${cb.stats[0].stat.name}</h3>
            <div class="stat_inner" >
                <div class="hp stat" style="width:${cb.stats[0].base_stat}%">${cb.stats[0].base_stat}</div>  
              </div>
            </div>
            <div class="stats">
              <h3>${cb.stats[1].stat.name}</h3>
              <div class="stat_inner" >
                <div class="attack stat" style="width:${cb.stats[1].base_stat}%">${cb.stats[1].base_stat}</div>  
              </div>
            </div>
            <div class="stats">
              <h3>${cb.stats[2].stat.name}</h3>
              <div class="stat_inner" >
                <div class="def stat" style="width:${cb.stats[2].base_stat}%">${cb.stats[2].base_stat}</div>  
              </div>
            </div>
            <div class="stats">
               <h3>${cb.stats[5].stat.name}</h3>
                <div class="stat_inner" >
                  <div class="speed stat" style="width:${cb.stats[5].base_stat}%">${cb.stats[5].base_stat}</div>  
                </div>
            </div>
            <div class="stats">
              <h3>${cb.stats[3].stat.name}</h3>
              <div class="stat_inner" >
                <div class="specAttack stat" style="width:${cb.stats[3].base_stat}%">${cb.stats[3].base_stat}</div>  
              </div>
            </div>
            <div class="stats">
              <h3>${cb.stats[4].stat.name}</h3>
              <div class="stat_inner" >
                <div class="specDef stat" style="width:${cb.stats[4].base_stat}%">${cb.stats[4].base_stat}</div>  
              </div>
            </div>
          </div>
          <button class='back' onclick="goBack()">Go Back </button>
     </div>
      `;
  });

  $buttons.classList.toggle("active");
}

function goBack() {
  window.location.reload();
}

window.addEventListener("load", () => {
  $allPages.innerHTML = all_Pages;
  $currentPage.innerHTML = currentPage;

  $prev.setAttribute("disabled", true);
});

$next.addEventListener("click", (e) => {
  e.preventDefault();
  offsetCounter += limit;
  currentPage++;

  if (currentPage === all_Pages) {
    $next.setAttribute("disabled", true);
  }

  changePage();
  $prev.removeAttribute("disabled");
  getData(`${URL}pokemon`, `limit=${limit}&offset=${offsetCounter}`, (cb) => {
    cardTemplate(cb.results);
  });
});

$prev.addEventListener("click", (e) => {
  e.preventDefault();
  offsetCounter -= limit;
  currentPage--;

  if (currentPage === 1) {
    $prev.setAttribute("disabled", true);
  }

  changePage();

  $next.removeAttribute("disabled");
  getData(`${URL}pokemon`, `limit=${limit}&offset=${offsetCounter}`, (cb) => {
    cardTemplate(cb.results);
  });
});

function changePage() {
  $currentPage.innerHTML = currentPage;
}

$pageInput.addEventListener("change", (e) => {
  e.preventDefault();

  selectPage = e.target.value;
});

$inputButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (selectPage > all_Pages || selectPage < 1 || selectPage === currentPage) {
    alert("Введите корректную страницу!");
  } else {
    const selectOffset = selectPage * limit - limit;

    offsetCounter = selectOffset;
    currentPage = selectPage;

    $currentPage.innerHTML = selectPage;
    if (selectPage !== 1) {
      $prev.removeAttribute("disabled");
    } else {
      $prev.setAttribute("disabled", true);
    }

    if (selectPage !== all_Pages) {
      $next.removeAttribute("disabled");
    } else {
      $next.setAttribute("disabled", true);
    }

    $inputButton.value = "";
    getData(`${URL}pokemon`, `limit=${limit}&offset=${selectOffset}`, (cb) => {
      cardTemplate(cb.results);
    });
  }
  document.getElementById("clear").value = "";
});
