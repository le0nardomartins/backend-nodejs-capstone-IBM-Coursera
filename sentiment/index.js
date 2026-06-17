require('dotenv').config();
const express = require('express');
const cors = require('cors');
const natural = require('natural');

const app = express();
const PORT = process.env.SENTIMENT_PORT || 3070;

app.use(cors());
app.use(express.json());

const tokenizer = new natural.WordTokenizer();
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer('English', stemmer, 'afinn');

// POST /sentiment - analyze sentiment of provided text
app.post('/sentiment', (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const tokens = tokenizer.tokenize(text);
        const score = analyzer.getSentiment(tokens);

        let sentiment;
        if (score > 0) {
            sentiment = 'positive';
        } else if (score < 0) {
            sentiment = 'negative';
        } else {
            sentiment = 'neutral';
        }

        res.json({ score, sentiment, tokens });
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /health
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Sentiment service running on port ${PORT}`);
});

module.exports = app;
