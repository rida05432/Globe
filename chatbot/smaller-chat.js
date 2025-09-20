document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotClose = chatbotContainer
    ? chatbotContainer.querySelector("#chatbot-close")
    : null;
  const chatbotToggleSize = document.getElementById("chatbot-toggle-size");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const chatMessages = document.getElementById("chat-messages");
  const liveTransportBtn = document.getElementById("live-transport-btn");
  const estimatedTravelBtn = document.getElementById("estimated-travel-btn");
  const activitiesBtn = document.getElementById("activities-btn");

  // Scroll to bottom function
  function forceScrollToBottom() {
    if (chatMessages) {
      requestAnimationFrame(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(() => {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
      });
    }
  }

  // Initialize chatbot as hidden
  if (chatbotContainer) {
    chatbotContainer.style.display = "none";
    chatbotContainer.classList.add("hidden");
    setTimeout(() => {
      forceScrollToBottom();
    }, 500);
  }

  // Open chatbot
  if (chatbotIcon) {
    chatbotIcon.addEventListener("click", function () {
      if (chatbotContainer) {
        chatbotContainer.style.display = "flex";
        chatbotContainer.classList.remove("hidden");
        chatbotContainer.classList.remove("minimized");
        chatbotContainer.style.width = "350px";
        chatbotContainer.style.height = "500px";
        setTimeout(() => {
          forceScrollToBottom();
          if (userInput) userInput.focus();
        }, 100);
      }
    });
  }

  // Close chatbot
  if (chatbotClose) {
    chatbotClose.addEventListener("click", function (e) {
      e.preventDefault();
      if (chatbotContainer) {
        chatbotContainer.style.display = "none";
        chatbotContainer.classList.add("hidden");
      }
    });
  }

  // Toggle size
  if (chatbotToggleSize) {
    chatbotToggleSize.addEventListener("click", function () {
      if (chatbotContainer) {
        chatbotContainer.classList.toggle("minimized");
        this.innerHTML = chatbotContainer.classList.contains("minimized")
          ? '<i class="fas fa-expand-alt"></i>'
          : '<i class="fas fa-compress-alt"></i>';
        setTimeout(() => {
          forceScrollToBottom();
        }, 100);
      }
    });
  }

  // Add user message
  function addUserMessage(message) {
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
    userInput.focus();
  }

  // Add bot message
  function addBotMessage(message) {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message typing-indicator";
    typingDiv.innerHTML = `
      <div class="bot-icon">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        <p><span class="typing-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span></p>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    forceScrollToBottom();

    setTimeout(() => {
      chatMessages.removeChild(typingDiv);
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
    }, 800);
  }

  // Process user input
  function processUserInput() {
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
      addBotMessage(botResponse);
    }
  }

  // Suggestion button handlers
  function handleLiveTransport() {
    addUserMessage("LIVE Transport Updates");
    addBotMessage(
      "The London Underground is currently running with good service on most lines. There are minor delays on the Central Line due to signal failure at Liverpool Street. London buses are operating normally."
    );
  }

  function handleEstimatedTravel() {
    addUserMessage("Estimated Travel Time");
    addBotMessage(
      "From central London, typical travel times are: 30 mins to Heathrow by Heathrow Express, 20 mins to Greenwich by DLR, 15 mins to Camden Town by Northern Line, and 25 mins to London Bridge by bus from Oxford Street."
    );
  }

  function handleActivities() {
    addUserMessage("Activities");
    addBotMessage(
      "Popular activities in London include: visiting museums like the British Museum (free entry!), taking a Thames river cruise, exploring Camden Market, watching a West End show, or taking a walking tour of historic neighborhoods."
    );
  }

  // Event listeners
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
