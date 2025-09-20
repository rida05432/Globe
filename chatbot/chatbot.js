document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const attractionsBtn = document.getElementById("attractions-btn");
  const hiddenGemsBtn = document.getElementById("hidden-gems-btn");
  const rainyDayBtn = document.getElementById("rainy-day-btn");
  const spaceBtn = document.getElementById("space-btn");
  const addGroupBtn = document.getElementById("add-group-btn");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const historyItems = document.getElementById("history-items");
  const searchInput = document.getElementById("search-input");
  const emojiBtn = document.getElementById("emoji-btn");
  const emojiPicker = document.getElementById("emoji-picker");
  const fileUploadBtn = document.getElementById("file-upload-btn");
  const fileUpload = document.getElementById("file-upload");
  const globeBtn = document.querySelector(".globe-btn");
  const languagePicker = document.getElementById("language-picker");
  const languageSelect = document.getElementById("language-select");
  const languageSaveBtn = document.getElementById("language-save-btn");
  const languageCancelBtn = document.getElementById("language-cancel-btn");
  const backBtn = document.getElementById("back-btn");

  // Image upload elements
  const imageUploadBtn = document.getElementById("image-upload-btn");
  const imageUpload = document.getElementById("image-upload");

  // Get the saved questions panel and its close button
  const savedQuestionsBtn = document.querySelector(".saved-questions-btn");
  const savedQuestionsPanel = document.getElementById("saved-questions-panel");
  const closePanelBtn = savedQuestionsPanel?.querySelector(".close-panel-btn");
  const panelContent = savedQuestionsPanel?.querySelector(".panel-content");

  // Helper function to check if elements exist
  const elementsExist = (elements) => {
    return elements.every((element) => element !== null);
  };

  // Global variables
  let savedQuestions = [];
  try {
    savedQuestions = JSON.parse(localStorage.getItem("savedQuestions")) || [];
  } catch (e) {
    console.error("Error parsing saved questions:", e);
  }
  let attachedFile = null;

  // Predefined responses
  const botResponses = {
    attractions: `Here are the must-see attractions in London:

1. The Tower of London - Historic fortress with the Crown Jewels
2. British Museum - World-class collection with free entry
3. Buckingham Palace - Royal residence with the Changing of the Guard
4. Westminster Abbey - Gothic church where royal coronations take place
5. The London Eye - Iconic observation wheel with stunning views
6. St. Paul's Cathedral - Sir Christopher Wren's masterpiece
7. Tate Modern - World-class contemporary art in a former power station
8. Natural History Museum - Dinosaurs, volcanoes and more

Which of these would you like to know more about?`,

    hiddenGems: `Here are some hidden gems in London that most tourists miss:

1. Little Venice - Peaceful canal area with waterside cafes
2. Leadenhall Market - Victorian covered market that featured in Harry Potter
3. Maltby Street Market - Foodie paradise with fewer crowds than Borough Market
4. The Painted Hall in Greenwich - Often called "Britain's Sistine Chapel"
5. Dennis Severs' House - A time capsule of 18th century life
6. Kyoto Garden in Holland Park - Tranquil Japanese garden
7. God's Own Junkyard - Neon light wonderland in Walthamstow

These spots offer a glimpse of London away from the usual tourist trails.`,

    rainyDay: `London is well-prepared for rainy days! Here are some indoor activities:

1. Museums - The British Museum, V&A, Natural History Museum, and Science Museum are all free
2. Shopping at Harrods or Covent Garden
3. Take in a West End show
4. Visit the Sky Garden for city views from indoors
5. Explore Camden Market's indoor stalls
6. Afternoon tea at a luxury hotel like The Ritz or Claridge's
7. The London Dungeon for a spooky history experience
8. Visit the Harry Potter Warner Bros Studio Tour (requires booking)

The Underground makes it easy to get around without getting wet!`,

    space: `I really wish I could help with that! But I specialize in London travel. Would you like to explore London's space-related attractions, like the Royal Observatory?`,

    fileResponse: `Thanks for sharing the file! I'll review it and get back to you with information relevant to your London travel plans.`,

    default: `I'm here to help with your London travel plans! Try asking about attractions, transport, or hidden gems in the city. Some popular topics include:

1. Must-see attractions in London
2. Hidden gems off the tourist trail
3. Best neighborhoods to stay in
4. Public transport tips
5. Day trips from London
6. Family-friendly activities
7. London's best museums

What would you like to know about?`,
  };

  // Initialize EmailJS
  try {
    emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your actual EmailJS User ID
  } catch (e) {
    console.error("Error initializing EmailJS:", e);
  }

  // Event Listeners
  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (userInput) {
    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  if (attractionsBtn) {
    attractionsBtn.addEventListener("click", function () {
      sendUserMessage(this.textContent);
      receiveBotMessage(botResponses.attractions);
      addToHistory(
        "London Attractions",
        "Discussing top attractions in London...",
        "Just now"
      );
    });
  }
  if (hiddenGemsBtn) {
    hiddenGemsBtn.addEventListener("click", function () {
      sendUserMessage(this.textContent);
      receiveBotMessage(botResponses.hiddenGems);
      addToHistory(
        "Hidden Gems",
        "Exploring London's secret spots...",
        "Just now"
      );
    });
  }
  if (rainyDayBtn) {
    rainyDayBtn.addEventListener("click", function () {
      sendUserMessage(this.textContent);
      receiveBotMessage(botResponses.rainyDay);
      addToHistory(
        "Rainy Day Activities",
        "What to do when it rains in London...",
        "Just now"
      );
    });
  }

  if (spaceBtn) {
    spaceBtn.addEventListener("click", function () {
      sendUserMessage(this.textContent);
      receiveBotMessage(botResponses.space);
      addToHistory(
        "Space Travel Question",
        "Asked about space travel...",
        "Just now"
      );
    });
  }

  // Back button functionality
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.history.back(); // Navigate to the previous page
    });
  }

  // Saved Questions Panel
  if (savedQuestionsBtn && savedQuestionsPanel) {
    savedQuestionsBtn.addEventListener("click", toggleSavedQuestionsPanel);
  }

  if (closePanelBtn && savedQuestionsPanel) {
    closePanelBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      savedQuestionsPanel.classList.add("hidden");
    });
  }

  // Emoji Picker
  if (emojiBtn && emojiPicker && userInput) {
    createEmojiPicker();
    emojiBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      emojiPicker.classList.toggle("hidden");
      const inputRect = userInput.getBoundingClientRect();
      emojiPicker.style.position = "absolute";
      emojiPicker.style.bottom = `${window.innerHeight - inputRect.top + 10}px`;
      emojiPicker.style.left = `${inputRect.left}px`;
    });

    document.addEventListener("click", function (e) {
      if (
        emojiPicker &&
        !emojiPicker.contains(e.target) &&
        e.target !== emojiBtn
      ) {
        emojiPicker.classList.add("hidden");
      }
    });
  }

  // Create emoji picker
  function createEmojiPicker() {
    const emojis = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "👋",
      "👍",
      "👎",
      "❤️",
      "🔥",
      "🎉",
      "✨",
      "🌟",
      "👏",
      "🙏",
      "🤔",
      "🤨",
      "😐",
      "😑",
      "😶",
      "🙄",
      "😏",
      "😣",
      "😥",
      "😮",
      "🌍",
      "🏙️",
      "🏛️",
      "🏰",
      "🚇",
      "🚌",
      "🚖",
      "🚶",
      "🧳",
      "🍵",
    ];
    const emojiList = document.createElement("div");
    emojiList.className = "emoji-list";
    emojis.forEach((emoji) => {
      const emojiSpan = document.createElement("span");
      emojiSpan.className = "emoji-item";
      emojiSpan.textContent = emoji;
      emojiSpan.addEventListener("click", () => {
        userInput.value += emoji;
        userInput.focus();
        emojiPicker.classList.add("hidden");
      });
      emojiList.appendChild(emojiSpan);
    });
    emojiPicker.innerHTML = "";
    emojiPicker.appendChild(emojiList);
  }

  // File upload handling
  if (elementsExist([fileUploadBtn, fileUpload])) {
    fileUploadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      fileUpload.click();
    });

    fileUpload.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!allowedTypes.includes(file.type)) {
          showToast("Only PDF and DOC/DOCX files are allowed.");
          return;
        }
        if (file.size > maxSize) {
          showToast("File size exceeds 5MB limit.");
          return;
        }
        attachedFile = file;
        showFileAttachment(attachedFile);
      }
    });
  }

  // Image upload handling
  if (elementsExist([imageUploadBtn, imageUpload])) {
    imageUploadBtn.addEventListener("click", handleImageUploadClick);
    imageUpload.addEventListener("change", handleImageUploadChange);
  }

  function handleImageUploadClick() {
    imageUpload.click();
  }

  function handleImageUploadChange() {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!allowedTypes.includes(file.type)) {
        showToast("Only JPG, PNG, GIF, and WebP images are allowed.");
        return;
      }
      if (file.size > maxSize) {
        showToast("Image size exceeds 5MB limit.");
        return;
      }
      displayImagePreview(file);
    }
  }

  // Add Group
  if (addGroupBtn && historyItems) {
    addGroupBtn.addEventListener("click", function () {
      const groupName = prompt("Enter a name for the new group:");
      if (groupName && groupName.trim() !== "") {
        addNewGroup(groupName);
      }
    });
  }

  // Clear History
  if (clearHistoryBtn && historyItems) {
    clearHistoryBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear all chat history?")) {
        historyItems.innerHTML = "";
        updateHistoryCount(0);
      }
    });
  }

  // Search History
  if (searchInput && historyItems) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const items = historyItems.querySelectorAll(".history-item");
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? "block" : "none";
      });
    });
  }

  // Language Selection
  if (globeBtn && languagePicker) {
    globeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      languagePicker.classList.toggle("hidden");
      const inputRect = globeBtn.getBoundingClientRect();
      languagePicker.style.position = "fixed";
      languagePicker.style.bottom = `${
        window.innerHeight - inputRect.top + 10
      }px`;
      languagePicker.style.left = `${inputRect.left}px`;
    });

    document.addEventListener("click", function (e) {
      if (
        languagePicker &&
        !languagePicker.contains(e.target) &&
        e.target !== globeBtn
      ) {
        languagePicker.classList.add("hidden");
      }
    });

    if (languageSaveBtn) {
      languageSaveBtn.addEventListener("click", function () {
        const selectedLanguage = languageSelect.value;
        showToast(
          `Language set to ${
            languageSelect.options[languageSelect.selectedIndex].text
          }`
        );
        languagePicker.classList.add("hidden");
      });
    }

    if (languageCancelBtn) {
      languageCancelBtn.addEventListener("click", function () {
        languagePicker.classList.add("hidden");
      });
    }
  }

  // Responsive panel handling
  window.addEventListener("resize", function () {
    if (window.innerWidth <= 768) {
      if (
        savedQuestionsPanel &&
        !savedQuestionsPanel.classList.contains("hidden")
      ) {
        savedQuestionsPanel.classList.add("hidden");
      }
      if (emojiPicker && !emojiPicker.classList.contains("hidden")) {
        emojiPicker.classList.add("hidden");
      }
      if (languagePicker && !languagePicker.classList.contains("hidden")) {
        languagePicker.classList.add("hidden");
      }
    }
  });

  // Click outside to close
  document.addEventListener("click", function (e) {
    if (
      savedQuestionsPanel &&
      !savedQuestionsPanel.classList.contains("hidden") &&
      !savedQuestionsPanel.contains(e.target) &&
      e.target !== savedQuestionsBtn
    ) {
      savedQuestionsPanel.classList.add("hidden");
    }
  });

  // Functions
  function sendMessage() {
    const message = userInput.value.trim();
    if (message || attachedFile) {
      if (message) sendUserMessage(message);
      if (attachedFile) {
        sendFileAttachment(attachedFile);
        receiveBotMessage(botResponses.fileResponse);
        addToHistory("File Shared", `Shared ${attachedFile.name}`, "Just now");
        attachedFile = null;
        clearFileAttachment();
      } else {
        let response;
        const lowerMessage = message.toLowerCase();
        if (
          lowerMessage.includes("attraction") ||
          lowerMessage.includes("see") ||
          lowerMessage.includes("visit")
        ) {
          response = botResponses.attractions;
          addToHistory(
            "Attractions Inquiry",
            "Asking about London attractions...",
            "Just now"
          );
        } else if (
          lowerMessage.includes("hidden") ||
          lowerMessage.includes("gem") ||
          lowerMessage.includes("secret")
        ) {
          response = botResponses.hiddenGems;
          addToHistory(
            "Hidden Gems",
            "Exploring secret spots in London...",
            "Just now"
          );
        } else if (
          lowerMessage.includes("rain") ||
          lowerMessage.includes("weather") ||
          lowerMessage.includes("indoor")
        ) {
          response = botResponses.rainyDay;
          addToHistory(
            "Weather Activities",
            "What to do in rainy London...",
            "Just now"
          );
        } else if (
          lowerMessage.includes("space") ||
          lowerMessage.includes("travel to space")
        ) {
          response = botResponses.space;
          addToHistory(
            "Space Travel Question",
            "Asked about space travel...",
            "Just now"
          );
        } else {
          response = botResponses.default;
          addToHistory(
            "General Question",
            `Asked: ${message.substring(0, 30)}${
              message.length > 30 ? "..." : ""
            }`,
            "Just now"
          );
        }
        receiveBotMessage(response);
      }
      userInput.value = "";
    }
  }

  function sendUserMessage(message) {
    const messageId = `msg-${Date.now()}`;
    const userMessageHTML = `
      <div class="message user-message" id="${messageId}">
        <div class="user-icon">
          <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
          <div class="message-header">
            <i class="far fa-bookmark bookmark-icon" data-message-id="${messageId}" data-message="${encodeURIComponent(
      message
    )}"></i>
          </div>
          <p>${message}</p>
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML("beforeend", userMessageHTML);
    const bookmarkIcon = document.querySelector(
      `.bookmark-icon[data-message-id="${messageId}"]`
    );
    if (bookmarkIcon) {
      bookmarkIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleSaveQuestion(
          decodeURIComponent(this.getAttribute("data-message")),
          this
        );
      });
    }
    scrollToBottom();
  }

  function receiveBotMessage(message) {
    const botMessageHTML = `
      <div class="message bot-message">
        <div class="bot-icon">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <p>${message}</p>
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML("beforeend", botMessageHTML);
    scrollToBottom();
  }

  function addToHistory(title, details, time) {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    historyItem.innerHTML = `
      <h4>${title}</h4>
      <p>${details}</p>
      <div class="meta-info">${time}</div>
    `;
    historyItems.appendChild(historyItem);
    updateHistoryCount(historyItems.children.length);
    historyItem.addEventListener("click", () => {
      userInput.value = details.replace(/^Asked: /, "");
      sendMessage();
    });
  }

  function updateHistoryCount(count) {
    const historyCountSpan = document.querySelector(".history-count");
    if (historyCountSpan) {
      historyCountSpan.textContent = count;
    }
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.classList.add("toast-notification");
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function sendFileAttachment(file) {
    const messageId = `msg-${Date.now()}`;
    const fileMessageHTML = `
      <div class="message user-message" id="${messageId}">
        <div class="user-icon">
          <i class="fas fa-paperclip"></i>
        </div>
        <div class="message-content">
          <div class="message-header">
            <i class="far fa-bookmark bookmark-icon" data-message-id="${messageId}" data-message="${encodeURIComponent(
      `File: ${file.name}`
    )}"></i>
          </div>
          <div class="attached-file">
            <i class="fas fa-file"></i>
            <div class="file-info">
              <div class="file-name">${file.name}</div>
              <div class="file-size">${(file.size / 1024).toFixed(2)} KB</div>
            </div>
            <button class="remove-file" onclick="clearFileAttachment()"><i class="fas fa-times-circle"></i></button>
          </div>
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML("beforeend", fileMessageHTML);
    const bookmarkIcon = document.querySelector(
      `.bookmark-icon[data-message-id="${messageId}"]`
    );
    if (bookmarkIcon) {
      bookmarkIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleSaveQuestion(
          decodeURIComponent(this.getAttribute("data-message")),
          this
        );
      });
    }
    scrollToBottom();
  }

  window.clearFileAttachment = function () {
    attachedFile = null;
    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      fileInput.value = "";
    }
    const filePreview = document.querySelector(".attached-file");
    if (filePreview) {
      filePreview.parentElement.removeChild(filePreview.parentElement);
    }
  };

  function addNewGroup(groupName) {
    const newGroupItem = document.createElement("div");
    newGroupItem.classList.add("history-item");
    newGroupItem.innerHTML = `<h4>${groupName}</h4>`;
    historyItems.appendChild(newGroupItem);
    updateHistoryCount(historyItems.children.length);
    newGroupItem.addEventListener("click", () => {
      userInput.value = `Entered group: ${groupName}`;
      sendMessage();
    });
  }

  function toggleSaveQuestion(message, iconElement) {
    const isSaved = savedQuestions.some((q) => q.message === message);
    if (isSaved) {
      savedQuestions = savedQuestions.filter((q) => q.message !== message);
      iconElement.classList.remove("fas");
      iconElement.classList.add("far");
      showToast("Question removed from Saved Questions!");
    } else {
      savedQuestions.push({
        message: message,
        timestamp: new Date().toLocaleString(),
      });
      iconElement.classList.remove("far");
      iconElement.classList.add("fas");
      showToast("Question saved to Saved Questions!");
    }
    localStorage.setItem("savedQuestions", JSON.stringify(savedQuestions));
    loadSavedQuestions();
  }

  function loadSavedQuestions() {
    if (!panelContent) return;
    panelContent.innerHTML = "";
    if (savedQuestions.length === 0) {
      panelContent.innerHTML = `<p class="no-saved-questions">No saved questions yet.</p>`;
    } else {
      savedQuestions.forEach((question) => {
        const questionItem = document.createElement("div");
        questionItem.classList.add("saved-question-item");
        questionItem.innerHTML = `
        <div class="saved-question-content">
          <i class="fas fa-bookmark"></i>
          <p>${question.message}</p>
          <div class="saved-question-actions">
            <button onclick="useSavedQuestion('${encodeURIComponent(
              question.message
            )}')">
              <i class="fas fa-arrow-right"></i>
            </button>
            <button class="delete-question" onclick="deleteSavedQuestion('${encodeURIComponent(
              question.message
            )}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
        panelContent.appendChild(questionItem);
      });
    }
  }

  window.useSavedQuestion = function (encodedMessage) {
    const message = decodeURIComponent(encodedMessage);
    userInput.value = message;
    sendMessage();
    savedQuestionsPanel.classList.add("hidden");
  };

  window.deleteSavedQuestion = function (encodedMessage) {
    const message = decodeURIComponent(encodedMessage);
    savedQuestions = savedQuestions.filter((q) => q.message !== message);
    localStorage.setItem("savedQuestions", JSON.stringify(savedQuestions));
    loadSavedQuestions();
    showToast("Saved question deleted!");
  };

  function toggleSavedQuestionsPanel() {
    if (!savedQuestionsPanel) return;
    savedQuestionsPanel.classList.toggle("hidden");
    if (!savedQuestionsPanel.classList.contains("hidden")) {
      savedQuestionsPanel.style.position = "fixed";
      savedQuestionsPanel.style.top = "50%";
      savedQuestionsPanel.style.left = "50%";
      savedQuestionsPanel.style.transform = "translate(-50%, -50%)";
      savedQuestionsPanel.style.zIndex = "1000";
      savedQuestionsPanel.style.backgroundColor = "white";
      savedQuestionsPanel.style.borderRadius = "16px";
      savedQuestionsPanel.style.padding = "20px";
      savedQuestionsPanel.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      savedQuestionsPanel.style.maxWidth = "400px";
      savedQuestionsPanel.style.width = "90%";
      loadSavedQuestions();
    }
  }

  function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const messageId = `msg-${Date.now()}`;
      const imageMessageHTML = `
        <div class="message user-message" id="${messageId}">
          <div class="user-icon">
            <i class="fas fa-image"></i>
          </div>
          <div class="message-content image-message">
            <div class="message-header">
              <i class="far fa-bookmark bookmark-icon" data-message-id="${messageId}" data-message="${encodeURIComponent(
        `Image: ${file.name}`
      )}"></i>
            </div>
            <img src="${
              e.target.result
            }" alt="Uploaded Image" class="uploaded-image">
            <div class="file-info">
              <div class="file-name">${file.name}</div>
              <div class="file-size">${(file.size / 1024).toFixed(2)} KB</div>
            </div>
          </div>
        </div>
      `;
      chatMessages.insertAdjacentHTML("beforeend", imageMessageHTML);
      const bookmarkIcon = document.querySelector(
        `.bookmark-icon[data-message-id="${messageId}"]`
      );
      if (bookmarkIcon) {
        bookmarkIcon.addEventListener("click", function (e) {
          e.stopPropagation();
          toggleSaveQuestion(
            decodeURIComponent(this.getAttribute("data-message")),
            this
          );
        });
      }
      scrollToBottom();
    };
    reader.readAsDataURL(file);
  }

  function showFileAttachment(file) {
    const filePreviewElement = document.createElement("div");
    filePreviewElement.classList.add("file-preview");
    filePreviewElement.innerHTML = `
      <div class="attached-file">
        <i class="fas fa-file-${getFileIcon(file.name)}"></i>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${(file.size / 1024).toFixed(2)} KB</div>
        </div>
        <button class="remove-file" onclick="clearFileAttachment()">
          <i class="fas fa-times-circle"></i>
        </button>
      </div>
    `;
    const chatInputContainer = document.querySelector(".chat-input-container");
    if (chatInputContainer) {
      chatInputContainer.insertBefore(filePreviewElement, userInput);
    }
  }

  function getFileIcon(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "word";
      case "xls":
      case "xlsx":
        return "excel";
      case "ppt":
      case "pptx":
        return "powerpoint";
      case "zip":
      case "rar":
        return "archive";
      default:
        return "alt";
    }
  }

  // Initialize components on load
  createEmojiPicker();
  if (savedQuestionsPanel) {
    if (!savedQuestionsPanel.querySelector(".panel-header")) {
      const panelHeader = document.createElement("div");
      panelHeader.className = "panel-header";
      panelHeader.innerHTML = `
        <h3>Saved Questions</h3>
        <button class="close-panel-btn">×</button>
      `;
      savedQuestionsPanel.insertBefore(
        panelHeader,
        savedQuestionsPanel.firstChild
      );
      const newCloseBtn = panelHeader.querySelector(".close-panel-btn");
      if (newCloseBtn) {
        newCloseBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          savedQuestionsPanel.classList.add("hidden");
        });
      }
    }
    if (!panelContent) {
      const contentDiv = document.createElement("div");
      contentDiv.className = "panel-content";
      savedQuestionsPanel.appendChild(contentDiv);
    }
  }
});
