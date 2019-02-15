// Setup
// Not necessary but some dummyData for the page load
let users = {
  cell: "cellphone",
  dob: {
    date: "Birthday",
    age: 45
  },
  email: "Email",
  location: {
    street: "Street",
    city: "City",
    state: "State",
    postcode: 12345
  },
  name: {
    title: "Mr/Mrs",
    first: "John",
    last: "Doe"
  },
  picture: {
    large: "https://placeimg.com/300/300/people"
  }
};

// Variables
let modal = ""; // Modal html
let cardNr = 0;
let cardsVis = []; // Array of index of Visible cards after search
let pos = 0; // Index of card clicked on

/**
 * Retrive data and call functions on success
 * @param url
 * @return array + function calls
 */

$.ajax({
  url:
    "https://randomuser.me/api/?results=12&nat=gb&inc=name,location,email,dob,cell,picture&noinfo",
  dataType: "json",
  success: function(data) {
    createList(data.results); // Create list of employee cards
    setModalData(users)
      .insertAfter("#gallery")
      .hide(); // hide modal initially
    modalButton(); // Add close modal button
    toggle(); // Add toggle button
    saveUserArray(data.results); // Save array to variable
    addSearch(); // Add search box
  }
});

/**
 * Create and add modal
 * @param array
 * @return string
 */

function setModalData(item) {
  modal = `<div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${
                item.picture.large
              }" alt="profile picture">
              <h3 id="name" class="modal-name cap">${item.name.title} ${
    item.name.first
  } ${item.name.last}</h3>
              <p class="modal-text">${item.email}</p>
              <p class="modal-text cap">${item.location.city}</p>
              <hr>
              <p class="modal-text">${item.cell}</p>
              <p class="modal-text">${item.location.street}, ${
    item.location.city
  }, ${item.location.state} ${item.location.postcode}</p>
              <p class="modal-text">Birthday: ${item.dob.date}</p>
          </div>
      </div>
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
      </div>`;

  return $(modal);
}

/**
 * Save data to separate array
 * @param array
 * @return array
 */

function saveUserArray(data) {
  users = data;
}

/**
 * Write user data to website
 * @param array
 * @return html
 */

function createList(users) {
  let listItem = "";

  $.each(users, function(index, item) {
    listItem += `<div class="card">
          <div class="card-img-container">
              <img class="card-img" src="${
                item.picture.large
              }" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${item.name.first} ${
      item.name.last
    }</h3>
              <p class="card-text">${item.email}</p>
              <p class="card-text cap">${item.location.city}, ${
      item.location.state
    }</p>
          </div>
      </div>`;

    cardsVis.push(index); // array of visible card indices before search
  });

  $("#gallery").html(listItem); // Insert on #gallery
}

/**
 * Create search bar incl functionality
 */

function addSearch() {
  $(".search-container").html(`
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`);

  /**
   * Search functionality
   * @param search string
   * @return visible cards and array cardsVis
   */

  $(document).on("submit", "form", e => {
    e.preventDefault();

    let searchValue = $("#search-input")
      .val()
      .toLowerCase();
    cardsVis = [];

    $(".card").hide(); // hide all cards again before showing them

    // Search in firstname and lastname for search string
    if (searchValue === "") {
      $(".card").show();
    } else {
      $(".card").hide();
      $.each(users, function(index, value) {
        if (
          value.name.first.toLowerCase().indexOf(searchValue) != -1 ||
          value.name.last.toLowerCase().indexOf(searchValue) != -1
        ) {
          $(".card")
            .eq(index)
            .show();
        }
      });
    }

    // Set array of visible cards indices to toggle through
    $.each(users, function(index, value) {
      if (
        $(".card")
          .eq(index)
          .is(":visible")
      ) {
        cardsVis.push(index);
      }
    });
  });
}

/**
 * Update UserData in Modal
 * @param list/cardNr
 * @return html
 */

function updateData(nr) {
  let item = users[nr];

  $(".modal-img").attr("src", `${item.picture.large}`);
  $(".modal-name").html(
    `${item.name.title} ${item.name.first} ${item.name.last}`
  );
  $(".modal-text")
    .eq(0)
    .html(`${item.email}`);
  $(".modal-text")
    .eq(1)
    .html(`${item.location.city}`);
  $(".modal-text")
    .eq(2)
    .html(`${item.cell}`);
  $(".modal-text")
    .eq(3)
    .html(
      `${item.location.street}, ${item.location.city}, ${item.location.state} ${
        item.location.postcode
      }`
    );
  $(".modal-text")
    .eq(4)
    .html(`Birthday: ${item.dob.date.split("T")[0]}`); // Split TS to only get Date
}

/**
 * Open modal with right information
 */

$("#gallery").on("click", ".card", function() {
  // Get current card index
  cardNr = $(this).index();
  // Get index within visible Cards
  pos = cardsVis.indexOf(cardNr);
  // Get data
  updateData(cardNr);

  // Hide prev/next if only one search result
  if (cardsVis.length === 1) {
    $(".modal-btn-container").hide();
  } else {
    $(".modal-btn-container").show();
  }

  // Show modal
  $(".modal-container").show();
});

/**
 * Close modal
 */

function modalButton() {
  $("#modal-close-btn").on("click", function() {
    $(".modal-container").hide();
  });
}

/**
 * Toggle through modals
 */

function toggle() {
  $(".modal-btn-container").on("click", ".btn", function() {
    // If button next then
    if ($(this).attr("id") === "modal-next") {
      if (pos < cardsVis.length - 1) {
        // increase index within visible Cards and get index within users array
        pos += 1;
        cardNr = cardsVis[pos];
      } else {
        // jump to first visible if at endposition
        pos = 0;
        cardNr = cardsVis[pos];
      }
    } else if ($(this).attr("id") === "modal-prev") {
      // If button prev then
      if (pos > 0) {
        pos -= 1;
        cardNr = cardsVis[pos];
      } else {
        // jump to last visible if at startposition
        pos = cardsVis.length - 1;
        cardNr = cardsVis[pos];
      }
    }
    updateData(cardNr);
  });
}
