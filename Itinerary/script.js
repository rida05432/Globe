// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  initTooltips();

  // Initialize navigation dropdowns
  initNavDropdowns();

  // Initialize search functionality
  initSearch();

  // Initialize filter dropdowns
  initFilterDropdowns();

  // Initialize attraction checkboxes
  initAttractionCheckboxes();

  // Initialize like buttons
  initLikeButtons();

  // Initialize newsletter form
  initNewsletterForm();
});

// Initialize tooltips functionality
function initTooltips() {
  // Hide all tooltips initially
  const tooltips = document.querySelectorAll(".tooltip");
  tooltips.forEach((tooltip) => {
    tooltip.style.display = "none";
  });

  // Plan Your Trip button tooltip
  const tripBtn = document.querySelector(".trip-btn");
  const tripTooltip = document.querySelector(".tooltip");

  if (tripBtn && tripTooltip) {
    tripBtn.addEventListener("mouseenter", function () {
      tripTooltip.style.display = "block";
    });

    tripBtn.addEventListener("mouseleave", function () {
      tripTooltip.style.display = "none";
    });
  }

  // You can add more tooltip triggers as needed
}

// Initialize navigation dropdowns
function initNavDropdowns() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    // Create dropdown menu element
    const dropdown = document.createElement("div");
    dropdown.className = "nav-dropdown";
    dropdown.style.display = "none";
    dropdown.style.position = "absolute";
    dropdown.style.backgroundColor = "#fff";
    dropdown.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    dropdown.style.borderRadius = "4px";
    dropdown.style.padding = "10px";
    dropdown.style.zIndex = "100";
    dropdown.style.minWidth = "150px";
    dropdown.style.top = "100%";
    dropdown.style.left = "0";

    // Add sample dropdown content
    dropdown.innerHTML = `
          <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0;"><a href="#" style="text-decoration: none; color: #333;">Option 1</a></li>
              <li style="padding: 8px 0;"><a href="#" style="text-decoration: none; color: #333;">Option 2</a></li>
              <li style="padding: 8px 0;"><a href="#" style="text-decoration: none; color: #333;">Option 3</a></li>
          </ul>
      `;

    // Add dropdown to nav item
    item.style.position = "relative";
    item.appendChild(dropdown);

    // Toggle dropdown on click
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const isVisible = dropdown.style.display === "block";

      // Hide all other dropdowns
      document.querySelectorAll(".nav-dropdown").forEach((d) => {
        d.style.display = "none";
      });

      // Toggle current dropdown
      dropdown.style.display = isVisible ? "none" : "block";
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) {
      document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
        dropdown.style.display = "none";
      });
    }
  });
}

// Initialize search functionality
function initSearch() {
  const searchInput = document.querySelector(".search-input");
  const searchNote = document.querySelector(".search-note");

  if (searchInput && searchNote) {
    // Show search hints when typing
    searchInput.addEventListener("input", function () {
      if (this.value.length > 0) {
        // Create suggestions container if it doesn't exist
        let suggestionsContainer = document.querySelector(
          ".search-suggestions"
        );

        if (!suggestionsContainer) {
          suggestionsContainer = document.createElement("div");
          suggestionsContainer.className = "search-suggestions";
          suggestionsContainer.style.position = "absolute";
          suggestionsContainer.style.width = "100%";
          suggestionsContainer.style.backgroundColor = "#fff";
          suggestionsContainer.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
          suggestionsContainer.style.borderRadius = "4px";
          suggestionsContainer.style.marginTop = "5px";
          suggestionsContainer.style.zIndex = "100";

          searchInput.parentNode.appendChild(suggestionsContainer);
        }

        // Add sample suggestions based on input
        const query = this.value.toLowerCase();
        const attractions = [
          "London Eye",
          "Tower Bridge",
          "Buckingham Palace",
          "Big Ben",
          "Westminster Abbey",
          "British Museum",
          "Tate Modern",
          "Trafalgar Square",
          "Covent Garden",
          "Camden Market",
          "Hyde Park",
          "St. Paul's Cathedral",
        ];

        const filteredAttractions = attractions.filter((attraction) =>
          attraction.toLowerCase().includes(query)
        );

        if (filteredAttractions.length > 0) {
          suggestionsContainer.innerHTML = "";

          filteredAttractions.forEach((attraction) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.className = "suggestion-item";
            suggestionItem.textContent = attraction;
            suggestionItem.style.padding = "10px 15px";
            suggestionItem.style.borderBottom = "1px solid #eee";
            suggestionItem.style.cursor = "pointer";

            suggestionItem.addEventListener("click", function () {
              searchInput.value = this.textContent;
              suggestionsContainer.style.display = "none";
            });

            suggestionItem.addEventListener("mouseenter", function () {
              this.style.backgroundColor = "#f5f5f5";
            });

            suggestionItem.addEventListener("mouseleave", function () {
              this.style.backgroundColor = "#fff";
            });

            suggestionsContainer.appendChild(suggestionItem);
          });

          suggestionsContainer.style.display = "block";
        } else {
          suggestionsContainer.style.display = "none";
        }
      } else {
        const suggestionsContainer = document.querySelector(
          ".search-suggestions"
        );
        if (suggestionsContainer) {
          suggestionsContainer.style.display = "none";
        }
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-box")) {
        const suggestionsContainer = document.querySelector(
          ".search-suggestions"
        );
        if (suggestionsContainer) {
          suggestionsContainer.style.display = "none";
        }
      }
    });
  }

  // Handle search tabs
  const searchTabs = document.querySelectorAll(".search-tab");

  searchTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      searchTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Update placeholder text based on selected tab
      if (searchInput) {
        switch (this.textContent.trim()) {
          case "Tours":
            searchInput.placeholder = "Search attractions to visit...";
            break;
          case "Hotels":
            searchInput.placeholder = "Where are you staying?";
            break;
          case "Tickets":
            searchInput.placeholder = "Search for event tickets...";
            break;
          case "Rental":
            searchInput.placeholder = "Search for rentals...";
            break;
          case "Activities":
            searchInput.placeholder = "Search for activities...";
            break;
          default:
            searchInput.placeholder = "Search...";
        }
      }
    });
  });
}

// Initialize filter dropdowns
function initFilterDropdowns() {
  const filterDropdowns = document.querySelectorAll(".filter-dropdown");

  filterDropdowns.forEach((dropdown) => {
    // Create dropdown menu
    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "filter-dropdown-menu";
    dropdownMenu.style.display = "none";
    dropdownMenu.style.position = "absolute";
    dropdownMenu.style.backgroundColor = "#fff";
    dropdownMenu.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    dropdownMenu.style.borderRadius = "4px";
    dropdownMenu.style.padding = "10px";
    dropdownMenu.style.zIndex = "100";
    dropdownMenu.style.minWidth = "200px";
    dropdownMenu.style.marginTop = "5px";

    // Add sample options based on filter type
    const filterType = dropdown.textContent.trim().replace(/▼/g, "");

    switch (filterType) {
      case "Categories":
        dropdownMenu.innerHTML = `
                  <div style="margin-bottom: 10px; font-weight: bold;">Select Categories</div>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Sightseeing
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Museums
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Parks & Nature
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Shopping
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Food & Drink
                  </label>
              `;
        break;

      case "Duration":
        dropdownMenu.innerHTML = `
                  <div style="margin-bottom: 10px; font-weight: bold;">Select Duration</div>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Less than 1 hour
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> 1-2 hours
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> 2-4 hours
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> 4+ hours
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Full day
                  </label>
              `;
        break;

      case "Review Rating":
        dropdownMenu.innerHTML = `
                  <div style="margin-bottom: 10px; font-weight: bold;">Select Rating</div>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> 5 stars
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> 4+ stars
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> 3+ stars
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Any rating
                  </label>
              `;
        break;

      case "Price range":
        dropdownMenu.innerHTML = `
                  <div style="margin-bottom: 10px; font-weight: bold;">Select Price Range</div>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Free
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> £
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> ££
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> £££
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> ££££
                  </label>
              `;
        break;

      case "More filters":
        dropdownMenu.innerHTML = `
                  <div style="margin-bottom: 10px; font-weight: bold;">Additional Filters</div>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Family friendly
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Wheelchair accessible
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Skip the line
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Indoor activities
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Outdoor activities
                  </label>
              `;
        break;

      default:
        dropdownMenu.innerHTML = `
                  <div style="margin-bottom: 10px; font-weight: bold;">Select Options</div>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Option 1
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Option 2
                  </label>
                  <label style="display: block; margin-bottom: 8px;">
                      <input type="checkbox" style="margin-right: 8px;"> Option 3
                  </label>
              `;
    }

    // Add button to apply filters
    const applyButton = document.createElement("button");
    applyButton.textContent = "Apply Filters";
    applyButton.style.backgroundColor = "#0071c2";
    applyButton.style.color = "white";
    applyButton.style.border = "none";
    applyButton.style.padding = "8px 15px";
    applyButton.style.borderRadius = "4px";
    applyButton.style.marginTop = "10px";
    applyButton.style.cursor = "pointer";
    applyButton.style.width = "100%";

    dropdownMenu.appendChild(applyButton);

    // Position dropdown menu
    dropdown.style.position = "relative";
    dropdown.appendChild(dropdownMenu);

    // Toggle dropdown menu on click
    dropdown.addEventListener("click", function (e) {
      e.stopPropagation();

      const isVisible = dropdownMenu.style.display === "block";

      // Hide all other dropdowns
      document.querySelectorAll(".filter-dropdown-menu").forEach((menu) => {
        menu.style.display = "none";
      });

      // Toggle current dropdown
      dropdownMenu.style.display = isVisible ? "none" : "block";
    });

    // Prevent dropdown menu from closing when clicking inside it
    dropdownMenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    // Apply button functionality
    applyButton.addEventListener("click", function () {
      // Get selected filters
      const selectedFilters = Array.from(
        dropdownMenu.querySelectorAll("input:checked")
      ).map((input) => input.parentNode.textContent.trim());

      // Update filter display (for demo purposes)
      if (selectedFilters.length > 0) {
        dropdown.style.backgroundColor = "#e1f5fe";
        dropdown.style.borderColor = "#0071c2";
      } else {
        dropdown.style.backgroundColor = "#f5f5f5";
        dropdown.style.borderColor = "#ddd";
      }

      // Close dropdown
      dropdownMenu.style.display = "none";
    });
  });

  // Close filter dropdowns when clicking outside
  document.addEventListener("click", function () {
    document.querySelectorAll(".filter-dropdown-menu").forEach((menu) => {
      menu.style.display = "none";
    });
  });
}

// Initialize attraction checkboxes
function initAttractionCheckboxes() {
  const attractionCheckboxes = document.querySelectorAll(
    ".attraction-checkbox"
  );

  attractionCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const card = this.closest(".attraction-card");

      if (this.checked) {
        card.style.border = "2px solid #0071c2";
        showNotification("Attraction added to your trip!");
      } else {
        card.style.border = "1px solid #eee";
        showNotification("Attraction removed from your trip.");
      }
    });
  });
}

// Initialize like buttons
function initLikeButtons() {
  const likeButtons = document.querySelectorAll(".like-btn");

  likeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Toggle like state
      if (
        this.style.color === "rgb(233, 30, 99)" ||
        this.style.color === "#e91e63"
      ) {
        this.style.color = "#ccc";
        showNotification("Removed from favorites.");
      } else {
        this.style.color = "#e91e63";
        showNotification("Added to favorites!");
      }
    });
  });
}

// Initialize newsletter form
function initNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form");
  const newsletterInput = document.querySelector(".newsletter-input");

  if (newsletterForm && newsletterInput) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = newsletterInput.value.trim();

      if (!email) {
        showValidationError(
          newsletterInput,
          "Please enter your email address."
        );
        return;
      }

      if (!isValidEmail(email)) {
        showValidationError(
          newsletterInput,
          "Please enter a valid email address."
        );
        return;
      }

      // Success - simulate submission
      newsletterInput.value = "";
      showNotification("Thank you for subscribing to our newsletter!");
    });

    // Clear validation error on input
    newsletterInput.addEventListener("input", function () {
      this.style.border = "";

      const errorElement = this.parentNode.querySelector(".validation-error");
      if (errorElement) {
        errorElement.remove();
      }
    });
  }
}

// Helper function to show notifications
function showNotification(message) {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "#333";
  notification.style.color = "white";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "4px";
  notification.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  notification.style.zIndex = "1000";
  notification.style.opacity = "0";
  notification.style.transition = "opacity 0.3s ease";

  // Add notification to body
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.style.opacity = "1";
  }, 10);

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";

    // Remove notification after fade out
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Helper function to show validation error
function showValidationError(inputElement, message) {
  // Highlight input
  inputElement.style.border = "1px solid #e91e63";

  // Remove existing error message
  const existingError =
    inputElement.parentNode.querySelector(".validation-error");
  if (existingError) {
    existingError.remove();
  }

  // Create error message
  const errorElement = document.createElement("div");
  errorElement.className = "validation-error";
  errorElement.textContent = message;
  errorElement.style.color = "#e91e63";
  errorElement.style.fontSize = "12px";
  errorElement.style.marginTop = "5px";
  errorElement.style.position = "absolute";
  errorElement.style.bottom = "-20px";
  errorElement.style.left = "0";

  // Add error message to form
  inputElement.parentNode.appendChild(errorElement);
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
