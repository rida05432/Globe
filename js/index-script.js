// Globe Travel - Index Page Script
document.addEventListener("DOMContentLoaded", function () {
  console.log("Index page script loaded");

  // Get the search form
  const searchForm = document.querySelector(".search-bar form");

  // Set minimum date for check-in and check-out to today
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format dates as YYYY-MM-DD for input fields
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Set default dates
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");

  if (checkinInput && checkoutInput) {
    // Set min dates to prevent selecting dates in the past
    checkinInput.min = formatDateForInput(today);
    checkoutInput.min = formatDateForInput(tomorrow);

    // Set default values if none are already set
    if (!checkinInput.value) {
      checkinInput.value = formatDateForInput(today);
    }

    if (!checkoutInput.value) {
      // Default checkout to day after checkin
      const defaultCheckout = new Date(checkinInput.value);
      defaultCheckout.setDate(defaultCheckout.getDate() + 1);
      checkoutInput.value = formatDateForInput(defaultCheckout);
    }

    // Update checkout min date when checkin changes
    checkinInput.addEventListener("change", function () {
      const newCheckinDate = new Date(this.value);
      const newMinCheckout = new Date(newCheckinDate);
      newMinCheckout.setDate(newMinCheckout.getDate() + 1);

      checkoutInput.min = formatDateForInput(newMinCheckout);

      // If checkout date is now before checkin, update it
      if (new Date(checkoutInput.value) <= newCheckinDate) {
        checkoutInput.value = formatDateForInput(newMinCheckout);
      }
    });
  }

  // Handle form submission
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const checkin = checkinInput ? checkinInput.value : "";
      const checkout = checkoutInput ? checkoutInput.value : "";
      const guests = document.getElementById("guests")
        ? document.getElementById("guests").value
        : "";

      // Store search parameters in localStorage
      const searchParams = {
        location: "London",
        checkin: checkin,
        checkout: checkout,
        guests: guests || "1", // Default to 1 guest if not specified
      };

      localStorage.setItem("searchParams", JSON.stringify(searchParams));

      // Redirect to listing page
      window.location.href = "listing.html";
    });
  }

  // Handle hotel filtering on the home page
  const filterButtons = document.querySelectorAll(".filter-btn");
  const hotelCards = document.querySelectorAll(".hotel-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      // Show all cards if filter is "all"
      if (filter === "all") {
        hotelCards.forEach((card) => (card.style.display = "block"));
        return;
      }

      // Otherwise, filter cards by category
      hotelCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Book Now button functionality
  const bookButtons = document.querySelectorAll(".book-btn");

  bookButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Get hotel info from parent card
      const hotelCard = this.closest(".hotel-card");
      const hotelName = hotelCard.querySelector("h3").textContent;
      const hotelPrice = hotelCard.querySelector(".price-amount").textContent;

      // Store selected hotel in localStorage
      const selectedHotel = {
        name: hotelName,
        price: hotelPrice,
      };

      localStorage.setItem("selectedHotel", JSON.stringify(selectedHotel));

      // Redirect to listing page
      window.location.href = "listing.html";
    });
  });
});

// Guest input controls
document.addEventListener("DOMContentLoaded", function () {
  const guestsInput = document.getElementById("guests");
  const decreaseBtn = document.getElementById("decrease-guests");
  const increaseBtn = document.getElementById("increase-guests");

  if (guestsInput && decreaseBtn && increaseBtn) {
    // Set default value if not already set
    if (!guestsInput.value) {
      guestsInput.value = "1";
    }

    // Decrease button functionality
    decreaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(guestsInput.value);
      if (currentValue > 1) {
        guestsInput.value = currentValue - 1;
      }
    });

    // Increase button functionality
    increaseBtn.addEventListener("click", function () {
      let currentValue = parseInt(guestsInput.value);
      if (currentValue < 5) {
        guestsInput.value = currentValue + 1;
      }
    });

    // Ensure direct input stays within limits
    guestsInput.addEventListener("change", function () {
      let value = parseInt(this.value);

      if (isNaN(value) || value < 1) {
        this.value = "1";
      } else if (value > 5) {
        this.value = "5";
      }
    });
  }
});
// Replace the inline script in index.html with this dedicated script
document.addEventListener("DOMContentLoaded", function () {
  console.log("Chatbot initialization script loaded");

  // Get DOM elements
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatbotToggleSize = document.getElementById("chatbot-toggle-size");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");
  const liveTransportBtn = document.getElementById("live-transport-btn");
  const estimatedTravelBtn = document.getElementById("estimated-travel-btn");
  const activitiesBtn = document.getElementById("activities-btn");

  console.log("Chatbot elements:", {
    chatbotIcon: !!chatbotIcon,
    chatbotContainer: !!chatbotContainer,
    chatbotClose: !!chatbotClose,
    toggleSize: !!chatbotToggleSize,
  });

  // Force scroll to bottom function
  function forceScrollToBottom() {
    if (chatMessages) {
      requestAnimationFrame(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  }

  // Initialize chatbot as hidden
  if (chatbotContainer) {
    chatbotContainer.classList.add("hidden");
    chatbotContainer.style.display = "none";
  }

  // Open chatbot when clicking the icon
  if (chatbotIcon) {
    chatbotIcon.addEventListener("click", function () {
      console.log("Chatbot icon clicked");
      if (chatbotContainer) {
        chatbotContainer.style.display = "flex";
        chatbotContainer.classList.remove("hidden");
        console.log("Chatbot container shown");
        setTimeout(() => {
          forceScrollToBottom();
          if (userInput) userInput.focus();
        }, 100);
      }
    });
  }

  // Close chatbot when clicking the close button
  if (chatbotClose) {
    chatbotClose.addEventListener("click", function (e) {
      console.log("Close button clicked");
      if (chatbotContainer) {
        chatbotContainer.style.display = "none";
        chatbotContainer.classList.add("hidden");
        console.log("Chatbot container hidden");
      }
    });
  }

  // Toggle size functionality
  if (chatbotToggleSize) {
    chatbotToggleSize.addEventListener("click", function () {
      console.log("Toggle size clicked");
      if (chatbotContainer) {
        chatbotContainer.classList.toggle("minimized");
        this.innerHTML = chatbotContainer.classList.contains("minimized")
          ? '<i class="fas fa-expand-alt"></i>'
          : '<i class="fas fa-compress-alt"></i>';
      }
    });
  }

  // Add user message
  function addUserMessage(message) {
    if (!chatMessages) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "message user-message";
    messageDiv.innerHTML = `
      <div class="user-icon">
        <i class="fas fa-user"></i>
      </div>
      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    forceScrollToBottom();
    if (userInput) userInput.focus();
  }

  // Add bot message
  function addBotMessage(message) {
    if (!chatMessages) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "message bot-message";
    messageDiv.innerHTML = `
      <div class="bot-icon">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    forceScrollToBottom();
  }

  // Process user input
  function processUserInput() {
    if (!userInput || !userInput.value) return;

    const message = userInput.value.trim();
    if (message !== "") {
      addUserMessage(message);
      userInput.value = "";

      let botResponse =
        "I'm sorry, I don't understand that question about London. Could you try asking something else?";

      if (
        message.toLowerCase().includes("transport") ||
        message.toLowerCase().includes("tube") ||
        message.toLowerCase().includes("bus")
      ) {
        botResponse =
          "London has an extensive public transport network including the Underground (Tube), buses, and trains. The Oyster card or contactless payment is the best way to pay for travel.";
      } else if (
        message.toLowerCase().includes("attraction") ||
        message.toLowerCase().includes("visit") ||
        message.toLowerCase().includes("see")
      ) {
        botResponse =
          "London's top attractions include the Tower of London, British Museum, Buckingham Palace, London Eye, and Westminster Abbey.";
      } else if (
        message.toLowerCase().includes("food") ||
        message.toLowerCase().includes("eat") ||
        message.toLowerCase().includes("restaurant")
      ) {
        botResponse =
          "London has amazing food options! Try traditional fish & chips, visit Borough Market for diverse food stalls, or enjoy afternoon tea at a fancy hotel.";
      } else if (message.toLowerCase().includes("weather")) {
        botResponse =
          "London weather is changeable. It's best to be prepared with layers and a raincoat, even in summer!";
      } else if (
        message.toLowerCase().includes("hello") ||
        message.toLowerCase().includes("hi") ||
        message.toLowerCase().includes("hey")
      ) {
        botResponse =
          "Hello there! How can I help with your London travel plans today?";
      }

      setTimeout(() => {
        addBotMessage(botResponse);
      }, 800);
    }
  }

  // Quick button handlers
  function handleLiveTransport() {
    addUserMessage("LIVE Transport Updates");
    setTimeout(() => {
      addBotMessage(
        "The London Underground is currently running with good service on most lines. There are minor delays on the Central Line due to signal failure at Liverpool Street. London buses are operating normally."
      );
    }, 800);
  }

  function handleEstimatedTravel() {
    addUserMessage("Estimated Travel Time");
    setTimeout(() => {
      addBotMessage(
        "From central London, typical travel times are: 30 mins to Heathrow by Heathrow Express, 20 mins to Greenwich by DLR, 15 mins to Camden Town by Northern Line, and 25 mins to London Bridge by bus from Oxford Street."
      );
    }, 800);
  }

  function handleActivities() {
    addUserMessage("Activities");
    setTimeout(() => {
      addBotMessage(
        "Popular activities in London include: visiting museums like the British Museum (free entry!), taking a Thames river cruise, exploring Camden Market, watching a West End show, or taking a walking tour of historic neighborhoods."
      );
    }, 800);
  }

  // Event listeners for buttons and input
  if (sendBtn) {
    sendBtn.addEventListener("click", processUserInput);
  }

  if (userInput) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        processUserInput();
      }
    });
  }

  if (liveTransportBtn) {
    liveTransportBtn.addEventListener("click", handleLiveTransport);
  }

  if (estimatedTravelBtn) {
    estimatedTravelBtn.addEventListener("click", handleEstimatedTravel);
  }

  if (activitiesBtn) {
    activitiesBtn.addEventListener("click", handleActivities);
  }
});
