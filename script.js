// DOM elements
const chatContainer = document.getElementById("chat_container");
const chatForm = document.getElementById("chat_form");
const chatInput = document.getElementById("chat_input");

// Function to append messages
function appendMessage(sender, text) {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat");

  const profile = document.createElement("div");
  profile.classList.add("profile", sender);
  profile.innerHTML = sender === "user" ? "👤" : "🤖";  

  // Message bubble
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;

  chatDiv.appendChild(profile);
  chatDiv.appendChild(message);
  chatContainer.appendChild(chatDiv);

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to get bot response from Gemini API
async function getBotResponse(userMessage) {
  const API_KEY = "AIzaSyDeYXylJMOMDYKy6E-jKSLj1QJf7NKXWY0";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Show "typing..." placeholder
  const typingMessage = document.createElement("div");
  typingMessage.classList.add("message", "bot");
  typingMessage.textContent = "Typing...";
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("chat");
  const botProfile = document.createElement("div");
  botProfile.classList.add("profile", "bot");
  botProfile.textContent = "🤖";
  typingDiv.appendChild(botProfile);
  typingDiv.appendChild(typingMessage);
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates.length) {
      throw new Error("No response from Gemini API");
    }

    // Remove typing placeholder
    typingDiv.remove();

    // Parse bot message safely
    const botMessage =
      data.candidates[0].content.parts?.[0].text ??
      data.candidates[0].content[0].parts[0].text;

    appendMessage("bot", botMessage);
  } catch (error) {
    console.error("Error:", error);
    typingDiv.remove();
    appendMessage(
      "bot",
      "Sorry, I'm having trouble responding. Please try again."
    );
  }
}

// Handle form submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatInput.value = "";
  getBotResponse(message);
});
