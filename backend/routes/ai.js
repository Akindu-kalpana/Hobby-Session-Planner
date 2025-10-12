const express = require('express');
const router = express.Router();
const db = require('../database');

// Mock AI suggestions - simulates OpenAI responses
// In production, this would use the real OpenAI API
const mockSuggestions = [
  {
    title: "Sunset Photography Walk",
    description: "Join us for an evening photography session capturing beautiful sunsets. Bring your camera or smartphone and learn composition techniques while enjoying nature. Perfect for beginners and experienced photographers alike!"
  },
  {
    title: "Board Game Strategy Night",
    description: "Dive into strategic board games like Catan, Ticket to Ride, and Carcassonne. Learn new games, meet fellow enthusiasts, and enjoy friendly competition in a relaxed atmosphere."
  },
  {
    title: "Urban Sketching Adventure",
    description: "Explore the city with sketchbook in hand! We'll visit interesting locations, practice quick sketching techniques, and capture the urban landscape. All skill levels welcome - materials provided."
  },
  {
    title: "Cooking Around the World",
    description: "Travel through cuisine! Each session focuses on a different country's traditional dishes. Learn cooking techniques, cultural food history, and enjoy tasting our creations together."
  },
  {
    title: "Beginner's Yoga Flow",
    description: "Gentle yoga session perfect for newcomers. Focus on basic poses, breathing techniques, and mindfulness. Build flexibility and strength in a supportive, non-judgmental environment."
  },
  {
    title: "Book Club Discussion",
    description: "Monthly gathering to discuss thought-provoking books. Share insights, debate themes, and discover new perspectives. Includes coffee and snacks while we explore literature together."
  },
  {
    title: "Trail Running Group",
    description: "Hit the trails with fellow runners! Explore scenic routes, improve endurance, and enjoy the outdoors. Multiple pace groups available to match your fitness level."
  },
  {
    title: "Pottery & Ceramics Workshop",
    description: "Get your hands dirty with clay! Learn wheel throwing or hand-building techniques. Create functional pottery or artistic pieces. All materials and firing included."
  }
];

// generate session suggestion based on existing sessions
router.post('/suggest', async (req, res) => {
  try {
    // get recent sessions from database to show we're analyzing them
    db.all('SELECT title, description FROM sessions ORDER BY created_at DESC LIMIT 5', [], async (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // pick a random suggestion
      const randomIndex = Math.floor(Math.random() * mockSuggestions.length);
      const suggestion = mockSuggestions[randomIndex];

      // format the response like AI would
      const formattedSuggestion = `Title: "${suggestion.title}"\n\nDescription: ${suggestion.description}`;

      res.json({
        suggestion: formattedSuggestion,
        sessions_analyzed: sessions.length,
        note: "Mock AI - simulates OpenAI for demonstration purposes"
      });
    });
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});

module.exports = router;

/*
const OpenAI = require('openai');

// initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Real OpenAI suggestion endpoint
router.post('/suggest', async (req, res) => {
  try {
    // get recent sessions from database
    db.all('SELECT title, description, date, location FROM sessions ORDER BY created_at DESC LIMIT 5', [], async (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // prepare context for AI
      let context = 'Based on these recent hobby sessions:\n';
      sessions.forEach((session, index) => {
        context += `${index + 1}. ${session.title} - ${session.description || 'No description'}\n`;
      });
      context += '\nSuggest a new hobby session idea with a creative title and engaging description.';

      // call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that suggests creative hobby session ideas. Provide a catchy title and engaging description for hobby activities."
          },
          {
            role: "user",
            content: context
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      });

      const suggestion = completion.choices[0].message.content;

      res.json({
        suggestion: suggestion,
        sessions_analyzed: sessions.length
      });
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggestion',
      details: error.message 
    });
  }
});
*/
