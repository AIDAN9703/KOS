require('dotenv').config();
const { runIntent } = require('./src/services/dialogflow');

async function testDialogflow() {
  try {
    console.log('Starting Dialogflow test...');
    const result = await runIntent('Hello');
    console.log('Dialogflow response:', result);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error stack:', error.stack);
  }
}

testDialogflow();