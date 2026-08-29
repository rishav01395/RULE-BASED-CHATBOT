// ===============================
// RULE-BASED AI CHATBOT
// Frontend JavaScript
// ===============================


// ===============================
// DOM ELEMENTS
// ===============================

const chatForm = document.getElementById("chatForm");

const userInput = document.getElementById("userInput");

const chatMessages = document.getElementById("chatMessages");

const sendButton = document.getElementById("sendButton");

const typingIndicator = document.getElementById("typingIndicator");

const clearChatButton = document.getElementById("clearChat");

const quickButtons = document.querySelectorAll(".quick-btn");


// ===============================
// ADD MESSAGE TO CHAT
// ===============================

function addMessage(message, sender) {

    const messageElement = document.createElement("div");

    messageElement.classList.add(
        "message",
        `${sender}-message`
    );


    const avatar = document.createElement("div");

    avatar.classList.add("message-avatar");

    avatar.textContent =
        sender === "user" ? "👤" : "🤖";


    const content = document.createElement("div");

    content.classList.add("message-content");


    const name = document.createElement("div");

    name.classList.add("message-name");

    name.textContent =
        sender === "user"
            ? "You"
            : "AI Assistant";


    const bubble = document.createElement("div");

    bubble.classList.add("message-bubble");

    bubble.textContent = message;


    const time = document.createElement("div");

    time.classList.add("message-time");

    time.textContent = getCurrentTime();


    content.appendChild(name);

    content.appendChild(bubble);

    content.appendChild(time);


    messageElement.appendChild(avatar);

    messageElement.appendChild(content);


    chatMessages.appendChild(messageElement);


    scrollToBottom();
}


// ===============================
// GET CURRENT TIME
// ===============================

function getCurrentTime() {

    const now = new Date();

    return now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}


// ===============================
// SCROLL TO BOTTOM
// ===============================

function scrollToBottom() {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


// ===============================
// SHOW TYPING INDICATOR
// ===============================

function showTyping() {

    typingIndicator.style.display = "flex";

    scrollToBottom();
}


// ===============================
// HIDE TYPING INDICATOR
// ===============================

function hideTyping() {

    typingIndicator.style.display = "none";
}


// ===============================
// SEND MESSAGE TO BACKEND
// ===============================

async function sendMessage(message) {

    if (!message.trim()) {

        return;
    }


    addMessage(
        message,
        "user"
    );


    userInput.value = "";

    sendButton.disabled = true;

    showTyping();


    try {

        const response = await fetch(
            "/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        const data = await response.json();


        // Small delay for natural conversation feel

        await new Promise(
            resolve => setTimeout(resolve, 500)
        );


        hideTyping();


        if (data.success) {

            addMessage(
                data.response,
                "bot"
            );

        } else {

            addMessage(
                data.response ||
                "Something went wrong.",
                "bot"
            );
        }


    } catch (error) {

        console.error(
            "Chatbot Error:",
            error
        );


        hideTyping();


        addMessage(
            "Unable to connect to the chatbot server. Please try again.",
            "bot"
        );

    } finally {

        sendButton.disabled = false;

        userInput.focus();
    }
}


// ===============================
// FORM SUBMISSION
// ===============================

chatForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const message =
            userInput.value.trim();


        if (message) {

            sendMessage(message);
        }
    }
);


// ===============================
// QUICK QUESTION BUTTONS
// ===============================

quickButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const message =
                    this.dataset.message;


                sendMessage(message);
            }
        );
    }
);


// ===============================
// CLEAR CHAT
// ===============================

clearChatButton.addEventListener(
    "click",
    function () {

        const confirmed =
            confirm(
                "Are you sure you want to clear the conversation?"
            );


        if (!confirmed) {

            return;
        }


        chatMessages.innerHTML = "";


        addMessage(
            "Hello! 👋 I'm ready to chat. How can I help you?",
            "bot"
        );


        userInput.focus();
    }
);


// ===============================
// ENTER KEY SUPPORT
// ===============================

userInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            chatForm.requestSubmit();
        }
    }
);


// ===============================
// INITIALIZE CHATBOT
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        userInput.focus();

        scrollToBottom();
    }
);