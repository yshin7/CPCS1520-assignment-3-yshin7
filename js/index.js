import { getRequest } from "./api/albums.js";

// References to buttons and tabs
const searchButton = document.querySelector("#search-button");
const favoritesButton = document.querySelector("#favorites-button");
const searchTab = document.querySelector("#search-tab");
const favoritesTab = document.querySelector("#favorites-tab");

// References to form and result elements
const searchForm = document.querySelector("#search-form");
const searchResult = document.querySelector("#search-results");
const myAlbums = document.querySelector("#my-albums");

// Function to handle search tab click
function clickSearchTab() {
  searchButton.classList.add("active");
  favoritesButton.classList.remove("active");
  searchTab.classList.remove("d-none");
  favoritesTab.classList.add("d-none");
}

// Function to handle favorites tab click
function clickFavoritesTab() {
  searchButton.classList.remove("active");
  favoritesButton.classList.add("active");
  searchTab.classList.add("d-none");
  favoritesTab.classList.remove("d-none");
}

// Tab buttons functionality
searchButton.addEventListener("click", clickSearchTab);
favoritesButton.addEventListener("click", clickFavoritesTab);

// Function to render album objects
async function renderAlbums(albums, target) {
  // Clear previous results
  target.innerHTML = "";
  albums.forEach((album) => {
    const albumItem = `
       <li class="list-group-item d-flex justify-content-between align-items-start">
         <div class="ms-2 me-auto">
           <div class="fw-bold">${album.albumName} <span class="badge bg-primary rounded-pill">${album.averageRating}</span></div>
           <span>${album.artistName}</span>
         </div>
         <button data-id="${album.id}" class="btn btn-success add-to-favorites">Add to Favorites</button>
       </li>
     `;
    target.insertAdjacentHTML("beforeend", albumItem);
  });
}

async function appInit() {
  const albumsData = await getRequest(
    "https://660f5000356b87a55c5127d9.mockapi.io/api/v1/albums"
  );
  console.log(albumsData);
  renderAlbums(albumsData, searchResult);
  await renderFavorites(); // Render favorites on page load
}

appInit();

async function searchAlbums(query) {
  const results = await getRequest(
    `https://660f5000356b87a55c5127d9.mockapi.io/api/v1/albums?search=${query}`
  );
  renderAlbums(results, searchResult);
}

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = e.target.query.value.trim();
  if (query !== "") {
    searchAlbums(query);
  }
});

document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("add-to-favorites")) {
    const albumId = e.target.getAttribute("data-id");

    const isAlreadyInFavorites = favoriteAlbumIds.includes(albumId);
    if (!isAlreadyInFavorites) {
      const album = await getRequest(
        `https://660f5000356b87a55c5127d9.mockapi.io/api/v1/albums/${albumId}`
      );
      await fetch(
        "https://660f5000356b87a55c5127d9.mockapi.io/api/v1/favorites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(album),
        }
      );

      // Add the album ID to the local list of favorites
      favoriteAlbumIds.push(albumId);

      await renderFavorites();
    } else {
      alert("This album is already in your favorites!");
    }
  }
});

async function renderFavorites() {
  const favoritesData = await getRequest(
    "https://660f5000356b87a55c5127d9.mockapi.io/api/v1/favorites"
  );
  renderAlbums(favoritesData, myAlbums);
}

// Local array to store IDs of favorite albums
let favoriteAlbumIds = [];
