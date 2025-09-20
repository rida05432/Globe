// Universal Authentication System for Globe Travel
document.addEventListener("DOMContentLoaded", function () {
  console.log("Auth system loaded");

  // Get authentication section
  const authSection = document.getElementById("authSection");
  if (!authSection) return; // Exit if authSection doesn't exist

  // Check if user is logged in
  function checkAuthentication() {
    // Get user data from localStorage (checking both formats)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const legacyUser = localStorage.getItem("loggedInUser");
    const loggedOut = localStorage.getItem("loggedOut");

    // Determine username from available data
    let username = "";
    if (currentUser && currentUser.name) {
      username = currentUser.name;
    } else if (legacyUser) {
      username = legacyUser;
    }

    // If user is logged in and not logged out
    if (username && !loggedOut) {
      // Create user greeting with logout dropdown
      const userGreeting = document.createElement("div");
      userGreeting.className = "user-greeting";
      userGreeting.innerHTML = `
        <span>Hello, ${username}</span>
        <a href="#" class="logout-btn">Logout</a>
      `;

      // Replace register button with user greeting
      authSection.innerHTML = "";
      authSection.appendChild(userGreeting);

      // Add event listener to logout button
      const logoutBtn = userGreeting.querySelector(".logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
          e.preventDefault();

          // Set logged out flag and clear sensitive data
          localStorage.setItem("loggedOut", "true");

          // Reload the page to update UI
          window.location.reload();
        });
      }
    } else {
      // User is not logged in, show register button

      // Determine correct path based on current page
      let registerPath = "registration/register.html";

      // If on listing.html, adjust the path
      if (window.location.pathname.includes("listing.html")) {
        registerPath = "registration/register.html";
      }

      // Create register button with correct path
      authSection.innerHTML = `<a href="${registerPath}" class="register-btn">Register Now</a>`;
    }
  }

  // Add styles for user greeting dropdown
  function addAuthStyles() {
    // Only add styles if not already present
    if (!document.getElementById("auth-styles")) {
      const style = document.createElement("style");
      style.id = "auth-styles";
      style.textContent = `
        .user-greeting {
          position: relative;
          display: inline-block;
          background: white;
          padding: 8px 16px;
          border-radius: 30px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .user-greeting span {
          font-weight: 500;
          color: #333;
        }
        
        .user-greeting .logout-btn {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: white;
          color: #ff5722;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 0;
          text-align: center;
          border-radius: 0 0 30px 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 100;
        }
        
        .user-greeting:hover {
          border-radius: 30px 30px 0 0;
        }
        
        .user-greeting:hover .logout-btn {
          opacity: 1;
          visibility: visible;
        }
        
        .user-greeting .logout-btn:hover {
          background: #f9f9f9;
        }
        
        /* For mobile screens */
        @media (max-width: 768px) {
          .user-greeting {
            padding: 6px 12px;
            font-size: 14px;
          }
        }
      `;

      document.head.appendChild(style);
    }
  }

  // Initialize auth system
  addAuthStyles();
  checkAuthentication();
});
