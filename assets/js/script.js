document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        // Validate the form fields
        const name = document.getElementById("name").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const email = document.getElementById("email").value;
        const feedback = document.getElementById("feedback").value;

        if (!name || !contactNumber || !email || !feedback) {
            event.preventDefault(); // Prevent form submission only if fields are empty
            alert("Please fill out all fields before submitting.");
        } else {
            // Allow form submission to server
            alert(`Thank you for your feedback, ${name}!`);
            // Optionally, reset the form
            // form.reset();
        }
    });

    // Stars Animation
    createStars();

    function createStars() {
        const starContainer = document.body;

        for (let i = 0; i < 30; i++) {
            const star = document.createElement("div");
            star.classList.add("star");
            star.style.left = Math.random() * 100 + "%";
            star.style.top = Math.random() * 100 + "%";
            star.style.animationDuration = Math.random() * 4 + 3 + "s";
            star.style.animationDelay = Math.random() * 2 + "s";
            starContainer.appendChild(star);
        }
    }

    // Add Star Styles Dynamically
    const style = document.createElement("style");
    style.innerHTML = `
        .star {
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: #fff;
            border-radius: 50%;
            animation: twinkle 3s infinite, moveStar 10s linear infinite;
            opacity: 0.8;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5);
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.2; }
        }
        @keyframes moveStar {
            0% { transform: translateY(0); opacity: 0.8; }
            100% { transform: translateY(50px); opacity: 0.3; }
        }
        .star:nth-child(odd) { background-color: #fff; }
        .star:nth-child(even) { background-color: #00bfff; }
    `;
    document.head.appendChild(style);
});
