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
    const newFeedback = new Feedback({
        name: req.body.name,
        contactNumber: req.body.contactNumber,
        email: req.body.email,
        feedback: req.body.feedback,
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
                <title>FeedBack Submitted</title>
            </head>
            <body>
                <h1>Thank You!</h1>
                <p>Your FeedBack has been Successfully Submitted</p>
                <a href="/">Back to Home</a>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Error submitting feedback:', err.message);
        res.status(500).send('There was an error in submitting your feedback');
    }
});

app.listen(port, () => {
    console.log(`Feedback System is running on http://localhost:${port}`);
});
