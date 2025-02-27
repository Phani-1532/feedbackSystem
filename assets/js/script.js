const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');
const app = express();
const port = 3000;

mongoose
    .connect('mongodb://127.0.0.1:27017/coderone_feedback', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
    });

app.use('/assets', express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/submit-feedback', async (req, res) => {
    const { name, contactNumber, email, feedback } = req.body;

    // Validate phone number
    const phoneNumberPattern = /^\d+$/;
    if (!phoneNumberPattern.test(contactNumber)) {
        return res.status(400).send('Invalid phone number. Please enter only digits.');
    }

    // Check if feedback already exists for the same user
    const existingFeedback = await Feedback.findOne({ $or: [{ email }, { contactNumber }, { name }] });
    if (existingFeedback) {
        return res.status(400).send('Your feedback already exists.');
    }

    // Validate feedback length
    if (feedback.length < 20) {
        return res.status(400).send('Feedback must be at least 20 characters long.');
    }

    const newFeedback = new Feedback({
        name,
        contactNumber,
        email,
        feedback,
    });

    try {
        await newFeedback.save();
        console.log('Feedback submitted successfully');
        res.send(`
           <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Feedback Submitted</title>
                <style>
                    body {
                        font-family: 'Poppins', sans-serif;
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #74ebd5, #9face6);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        color: #fff;
                        overflow: hidden;
                    }
                    .container {
                        background: rgba(0, 0, 0, 0.85);
                        padding: 2rem;
                        border-radius: 15px;
                        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
                        max-width: 500px;
                        width: 100%;
                        text-align: center;
                        animation: fadeIn 1.5s ease;
                    }
                    h1 {
                        margin-bottom: 1rem;
                        font-size: 2rem;
                        color: #74ebd5;
                        text-shadow: 0 0 10px #74ebd5;
                    }
                    p {
                        font-size: 1.2rem;
                        color: #ddd;
                        margin-bottom: 2rem;
                    }
                    a.btn {
                        display: inline-block;
                        padding: 1rem;
                        background-color: #74ebd5;
                        color: #000;
                        font-weight: bold;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1.1rem;
                        text-transform: uppercase;
                        text-decoration: none;
                        box-shadow: 0 0 10px rgba(116, 235, 213, 0.8);
                        transition: all 0.3s ease;
                    }
                    a.btn:hover {
                        background-color: #56c9a3;
                        box-shadow: 0 0 20px rgba(116, 235, 213, 1), 0 0 30px rgba(116, 235, 213, 0.7);
                    }
                    /* Fade-in Animation */
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    /* Responsive Design */
                    @media (max-width: 768px) {
                        .container {
                            padding: 1.5rem;
                            margin: 0 10px;
                            max-width: 90%;
                        }
                        h1 {
                            font-size: 1.8rem;
                        }
                        p {
                            font-size: 1rem;
                        }
                        a.btn {
                            font-size: 1rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Thank You!</h1>
                    <p>Your feedback has been successfully submitted.</p>
                    <a class="btn" href="/">Back to Home</a>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Error submitting feedback:', err.message);
        res.status(500).send('There was an error in submitting your feedback');
    }
});

// New route to check if the name, email, or phone number already exists
app.post('/check-feedback', async (req, res) => {
    const { name, contactNumber, email } = req.body;
    const existingFeedback = await Feedback.findOne({ $or: [{ email }, { contactNumber }, { name }] });
    if (existingFeedback) {
        return res.status(400).json({ message: 'Feedback already exists for this user.' });
    }
    res.status(200).json({ message: 'OK' });
});

app.listen(port, () => {
    console.log(`Feedback System is running on http://localhost:${port}`);
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        // Validate the form fields
        const name = document.getElementById("name").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const email = document.getElementById("email").value;
        const feedback = document.getElementById("feedback").value;

        let valid = true;

        if (!name || !contactNumber || !email || !feedback) {
            valid = false;
            document.getElementById("formError").textContent = "Please fill out all fields before submitting.";
        } else {
            document.getElementById("formError").textContent = "";
        }

        if (!/^\d+$/.test(contactNumber)) {
            valid = false;
            document.getElementById("phoneError").textContent = "Invalid phone number. Please enter only digits.";
        } else {
            document.getElementById("phoneError").textContent = "";
        }

        if (feedback.length < 20) {
            valid = false;
            document.getElementById("feedbackError").textContent = "Feedback must be at least 20 characters long.";
        } else {
            document.getElementById("feedbackError").textContent = "";
        }

        if (valid) {
            const response = await fetch('/check-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, contactNumber, email })
            });

            const result = await response.json();

            if (response.status === 400) {
                valid = false;
                document.getElementById("formError").innerHTML = result.message;
            } else {
                document.getElementById("formError").textContent = "";
            }
        }

        if (!valid) {
            event.preventDefault();
        } else {
            alert("Feedback submitted successfully");
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
        .error {
            color: red;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
});