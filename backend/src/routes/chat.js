const express = require('express');
const router = express.Router();
const { runIntent } = require('../services/dialogflow');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);
    
    console.log('Calling runIntent...');
    const result = await runIntent(message);
    console.log('Dialogflow response:', result);
    
    if (!result || !result.fulfillmentText) {
      console.error('Invalid response from Dialogflow:', result);
      return res.status(500).json({ message: 'Invalid response from Dialogflow' });
    }
    
    res.json({ message: result.fulfillmentText });
  } catch (error) {
    console.error('Error processing chat message:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error processing your request', error: error.message });
  }
});

module.exports = router;