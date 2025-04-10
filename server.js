const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Report = require('./models/Report');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Login route
app.post('/api/login', async (req, res) => {
    const { userId, email } = req.body;

    let user = await User.findOne({ userId });

    if (!user) {
        user = new User({ userId, email });
        await user.save();
    }

    res.json({ message: 'Login successful', userId: user.userId });
});

// Report a fake account
app.post('/api/report', async (req, res) => {
    const { userId, handle } = req.body;

    const report = new Report({
        userId,
        handle,
        status: 'Fake Account',
        detectedAt: new Date()
    });

    await report.save();

    res.json({ message: 'Reported successfully' });
});

// Get history
app.get('/api/history/:userId', async (req, res) => {
    const reports = await Report.find({ userId: req.params.userId });
    res.json(reports);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
