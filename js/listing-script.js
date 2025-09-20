// Globe Travel - Listing Page Script with 3-Page System
document.addEventListener("DOMContentLoaded", function () {
  console.log("Listing page script loaded");

  // Define the 3-page hotel system
  const hotelPages = {
    1: [],
    2: [],
    3: [],
  };

  // Collect all existing listings based on their data-page attribute
  const allListingCards = document.querySelectorAll(".listing-card");
  allListingCards.forEach((card) => {
    const pageNum = card.getAttribute("data-page");
    if (pageNum && hotelPages[pageNum]) {
      hotelPages[pageNum].push(card);
    }
  });

  // Current active page
  let currentPage = 1;

  // Get search parameters from localStorage
  const searchParams = JSON.parse(localStorage.getItem("searchParams")) || {
    location: "London",
    checkin: "",
    checkout: "",
    guests: "1",
  };

  // Update search summary with the search parameters
  const searchSummary = document.querySelector(".search-summary p");
  if (searchSummary) {
    // Format dates for display
    const formatDate = (dateString) => {
      if (!dateString) return "";

      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-UK", options);
    };

    const checkinFormatted = formatDate(searchParams.checkin) || "4 May 2025";
    const checkoutFormatted = formatDate(searchParams.checkout) || "5 May 2025";
    const guestCount = searchParams.guests || "3";

    searchSummary.textContent = `Your search: ${checkinFormatted} - ${checkoutFormatted} • ${guestCount} Guests`;
  }

  // Handle "Modify Search" button
  const modifySearchBtn = document.getElementById("modify-search");
  if (modifySearchBtn) {
    modifySearchBtn.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }

  // Price range slider functionality
  const priceRange = document.getElementById("price-range");
  const priceDisplay = document.getElementById("price-display");

  if (priceRange && priceDisplay) {
    priceRange.addEventListener("input", function () {
      priceDisplay.textContent = `£${this.value}`;
      filterListings();
    });
  }

  // Handle checkbox filters
  const filterCheckboxes = document.querySelectorAll(
    ".filter-item input[type='checkbox']"
  );

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterListings);
  });

  // Main filtering function
  function filterListings() {
    const listingCards = document.querySelectorAll(
      `.listing-card[data-page="${currentPage}"]`
    );
    const selectedPrice = priceRange ? parseInt(priceRange.value) : 500;

    // Get selected property types
    const selectedPropertyTypes = Array.from(
      document.querySelectorAll(".filter-item input[type='checkbox']:checked")
    ).map((checkbox) => checkbox.id);

    // Get selected amenities
    const selectedAmenities = Array.from(
      document.querySelectorAll(
        ".filter-item input[id^='air-conditioning'], .filter-item input[id^='wifi'], .filter-item input[id^='gym'], .filter-item input[id^='pool'], .filter-item input[id^='kitchen']:checked"
      )
    ).map((checkbox) => checkbox.id);

    let visibleCount = 0;

    listingCards.forEach((card) => {
      let isVisible = true;

      if (
        selectedPrice ||
        selectedPropertyTypes.length > 0 ||
        selectedAmenities.length > 0
      ) {
        const priceText = card
          .querySelector(".price-amount")
          .textContent.trim();
        const price = parseInt(priceText.replace(/[^0-9]/g, ""));

        const locationText = card
          .querySelector(".listing-location")
          .textContent.toLowerCase();
        let propertyType = "apartment";

        if (locationText.includes("house")) propertyType = "house";
        if (locationText.includes("villa")) propertyType = "villa";
        if (locationText.includes("hostel")) propertyType = "hostel";
        if (locationText.includes("suite")) propertyType = "guest-suite";

        const amenitiesText = card
          .querySelector(".listing-amenities")
          .textContent.toLowerCase();
        const amenities = [];

        if (amenitiesText.includes("wifi")) amenities.push("wifi");
        if (amenitiesText.includes("kitchen")) amenities.push("kitchen");
        if (amenitiesText.includes("gym")) amenities.push("gym");
        if (amenitiesText.includes("pool")) amenities.push("pool");
        if (amenitiesText.includes("air") || amenitiesText.includes("cooling"))
          amenities.push("air-conditioning");

        if (selectedPrice && price > selectedPrice) {
          isVisible = false;
        }

        if (
          selectedPropertyTypes.length > 0 &&
          !selectedPropertyTypes.includes(propertyType)
        ) {
          isVisible = false;
        }

        if (selectedAmenities.length > 0) {
          const hasAllSelectedAmenities = selectedAmenities.every((amenity) =>
            amenities.includes(amenity)
          );
          if (!hasAllSelectedAmenities) {
            isVisible = false;
          }
        }
      }

      card.style.display = isVisible ? "flex" : "none";
      if (isVisible) {
        visibleCount++;
      }
    });

    const optionsCount = document.querySelector(".options-count");
    if (optionsCount) {
      optionsCount.textContent = `${visibleCount} Options`;
    }
  }

  // Helper function to generate rating stars
  function generateRatingStars(rating) {
    let stars = "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.3 && rating - fullStars < 0.8;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }

    return stars;
  }

  // Helper function to get an icon for an amenity
  function getAmenityIcon(amenity) {
    const amenityIcons = {
      Wifi: "wifi",
      Kitchen: "utensils",
      "Smart TV": "tv",
      Gym: "dumbbell",
      Pool: "swimming-pool",
      Breakfast: "coffee",
      Fireplace: "fire",
      Garden: "tree",
      Parking: "car",
      Balcony: "umbrella-beach",
      Rooftop: "building",
      "Vinyl Collection": "record-vinyl",
      Library: "book",
    };

    return amenityIcons[amenity] || "check";
  }

  // Pagination functionality
  function updatePagination(newPage) {
    currentPage = newPage;

    document.querySelectorAll(".pagination span").forEach((span) => {
      span.classList.remove("current");
      if (parseInt(span.textContent) === currentPage) {
        span.classList.add("current");
      }
    });

    // Hide all listings
    allListingCards.forEach((card) => {
      card.style.display = "none";
    });

    // Show only the listings for the current page
    if (hotelPages[currentPage]) {
      hotelPages[currentPage].forEach((card) => {
        card.style.display = "flex";
      });
    }

    // Apply filters to the current page
    filterListings();

    // Scroll to top of listings
    window.scrollTo({
      top: document.querySelector(".col-lg-8").offsetTop - 100,
      behavior: "smooth",
    });
  }

  // Set up pagination clicks
  document.querySelectorAll(".pagination span").forEach((span) => {
    const pageNum = parseInt(span.textContent);
    if (!isNaN(pageNum) && pageNum <= 3) {
      span.addEventListener("click", function () {
        updatePagination(pageNum);
      });
    }
  });

  // Handle previous/next buttons
  const prevButton = document.querySelector('.pagination img[alt="Previous"]');
  if (prevButton) {
    prevButton.addEventListener("click", function () {
      if (currentPage > 1) {
        updatePagination(currentPage - 1);
      }
    });
  }

  const nextButton = document.querySelector('.pagination img[alt="Next"]');
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      if (currentPage < 3) {
        updatePagination(currentPage + 1);
      }
    });
  }

  // "View More" link functionality
  const viewMoreLink = document.querySelector(".view-more");
  if (viewMoreLink) {
    viewMoreLink.addEventListener("click", function (e) {
      e.preventDefault();
      const hiddenFilters = document.querySelectorAll(".filter-item.hidden");
      hiddenFilters.forEach((filter) => {
        filter.classList.remove("hidden");
      });
      this.style.display = "none";
    });
  }

  // Initialize with first page visible - fix for initial display
  // This ensures the first page is shown even if there are script errors
  document.querySelectorAll(".listing-card[data-page='1']").forEach((card) => {
    card.style.display = "flex";
  });

  // Update the options count on initial load
  const firstPageCards = document.querySelectorAll(
    ".listing-card[data-page='1']"
  );
  const optionsCount = document.querySelector(".options-count");
  if (optionsCount) {
    optionsCount.textContent = `${firstPageCards.length} Options`;
  }

  // Initialize page 1
  updatePagination(1);
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("Inline script loaded");

  // Force display all page 1 listings
  document.querySelectorAll('.listing-card[data-page="1"]').forEach((card) => {
    card.style.display = "flex";
  });

  // Update options count
  const page1Cards = document.querySelectorAll('.listing-card[data-page="1"]');
  const optionsCount = document.querySelector(".options-count");
  if (optionsCount) {
    optionsCount.textContent = `${page1Cards.length} Options`;
  }

  // Set up pagination clicks
  document.querySelectorAll(".pagination span").forEach((span) => {
    const pageNum = parseInt(span.textContent);
    if (!isNaN(pageNum)) {
      span.addEventListener("click", function () {
        // Hide all listings
        document.querySelectorAll(".listing-card").forEach((card) => {
          card.style.display = "none";
        });

        // Show only listings for this page
        document
          .querySelectorAll(`.listing-card[data-page="${pageNum}"]`)
          .forEach((card) => {
            card.style.display = "flex";
          });

        // Update active page indicator
        document.querySelectorAll(".pagination span").forEach((s) => {
          s.classList.remove("current");
        });
        span.classList.add("current");
      });
    }
  });
});
function filterListings() {
  const listingCards = document.querySelectorAll(
    `.listing-card[data-page="${currentPage}"]`
  );
  const selectedPrice = priceRange ? parseInt(priceRange.value) : 500;

  // Get selected property types
  const selectedPropertyTypes = Array.from(
    document.querySelectorAll(".filter-item input[type='checkbox']:checked")
  ).map((checkbox) => checkbox.id);

  // Get selected amenities
  const selectedAmenities = Array.from(
    document.querySelectorAll(
      ".filter-item input[id^='air-conditioning'], .filter-item input[id^='wifi'], .filter-item input[id^='gym'], .filter-item input[id^='pool'], .filter-item input[id^='kitchen']:checked"
    )
  ).map((checkbox) => checkbox.id);

  // Get guest count from search parameters
  const searchParams = JSON.parse(localStorage.getItem("searchParams")) || {
    location: "London",
    checkin: "",
    checkout: "",
    guests: "1",
  };

  const guestCount = parseInt(searchParams.guests) || 1;

  let visibleCount = 0;

  listingCards.forEach((card) => {
    let isVisible = true;

    if (
      selectedPrice ||
      selectedPropertyTypes.length > 0 ||
      selectedAmenities.length > 0 ||
      guestCount > 1
    ) {
      const priceText = card.querySelector(".price-amount").textContent.trim();
      const price = parseInt(priceText.replace(/[^0-9]/g, ""));

      const locationText = card
        .querySelector(".listing-location")
        .textContent.toLowerCase();
      let propertyType = "apartment";

      if (locationText.includes("house")) propertyType = "house";
      if (locationText.includes("villa")) propertyType = "villa";
      if (locationText.includes("hostel")) propertyType = "hostel";
      if (locationText.includes("suite")) propertyType = "guest-suite";

      const amenitiesText = card
        .querySelector(".listing-amenities")
        .textContent.toLowerCase();
      const amenities = [];

      if (amenitiesText.includes("wifi")) amenities.push("wifi");
      if (amenitiesText.includes("kitchen")) amenities.push("kitchen");
      if (amenitiesText.includes("gym")) amenities.push("gym");
      if (amenitiesText.includes("pool")) amenities.push("pool");
      if (amenitiesText.includes("air") || amenitiesText.includes("cooling"))
        amenities.push("air-conditioning");

      // Guest capacity filtering
      const cardGuestText = card.querySelector(".guest-count").textContent;
      const cardGuestCount = parseInt(cardGuestText.match(/\d+/)[0]) || 2; // Default to 2 if parsing fails

      if (guestCount > cardGuestCount) {
        isVisible = false;
      }

      if (selectedPrice && price > selectedPrice) {
        isVisible = false;
      }

      if (
        selectedPropertyTypes.length > 0 &&
        !selectedPropertyTypes.includes(propertyType)
      ) {
        isVisible = false;
      }

      if (selectedAmenities.length > 0) {
        const hasAllSelectedAmenities = selectedAmenities.every((amenity) =>
          amenities.includes(amenity)
        );
        if (!hasAllSelectedAmenities) {
          isVisible = false;
        }
      }
    }

    card.style.display = isVisible ? "flex" : "none";
    if (isVisible) {
      visibleCount++;
    }
  });

  const optionsCount = document.querySelector(".options-count");
  if (optionsCount) {
    optionsCount.textContent = `${visibleCount} Options`;
  }
}
// Update guest count display in filter section
document.addEventListener("DOMContentLoaded", function () {
  const currentGuestCount = document.getElementById("current-guest-count");
  if (currentGuestCount) {
    const searchParams = JSON.parse(localStorage.getItem("searchParams")) || {
      guests: "1",
    };
    currentGuestCount.textContent = searchParams.guests || "1";
  }
});
if (chatbotClose) {
  chatbotClose.addEventListener("click", function () {
    if (chatbotContainer) {
      chatbotContainer.style.display = "none";
      chatbotContainer.classList.add("hidden");
      console.log("Close button clicked, chatbot hidden");
    }
  });
}
