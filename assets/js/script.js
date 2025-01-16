// script.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const email = document.getElementById("email").value;
        const feedback = document.getElementById("feedback").value;

        if (name && contactNumber && email && feedback) {
            alert(`Thank you for your feedback, ${name}!`);
            form.reset();
        } else {
            alert("Please fill out all fields before submitting.");
        }
    });

    // Stars Animation
    createStars();

    function createStars() {
        const starContainer = document.body;

        // Reduce the number of stars for a subtle effect
        for (let i = 0; i < 30; i++) { // Reduced to 30 stars
            const star = document.createElement("div");
            star.classList.add("star");
            star.style.left = Math.random() * 100 + "%";
            star.style.top = Math.random() * 100 + "%";
            star.style.animationDuration = Math.random() * 4 + 3 + "s"; // Randomize speed
            star.style.animationDelay = Math.random() * 2 + "s"; // Add random delay for variation
            starContainer.appendChild(star);
        }
    }

    // Add Star Styles Dynamically
    const style = document.createElement("style");
    style.innerHTML = `
        .star {
            position: absolute;
            width: 4px; /* Slightly smaller for subtlety */
            height: 4px; /* Slightly smaller for subtlety */
            background-color: #fff; /* Default white */
            border-radius: 50%;
            animation: twinkle 3s infinite, moveStar 10s linear infinite;
            opacity: 0.8;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5);
        }

        /* Twinkling Effect */
        @keyframes twinkle {
            0%, 100% {
                opacity: 0.8;
            }
            50% {
                opacity: 0.2;
            }
        }

        /* Add random movement for the stars */
        @keyframes moveStar {
            0% {
                transform: translateY(0);
                opacity: 0.8;
            }
            100% {
                transform: translateY(50px); /* Slight vertical movement */
                opacity: 0.3;
            }
        }

        /* White Stars */
        .star:nth-child(odd) {
            background-color: #fff; /* White */
        }

        /* Blue Stars */
        .star:nth-child(even) {
            background-color: #00bfff; /* Blue */
        }
    `;
    document.head.appendChild(style);
});
