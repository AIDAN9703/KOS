const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// WARNING: This is for debugging purposes only. Never include credentials in your code for production.
const credentials = {
 "type": "service_account",
  "project_id": "kos-glif",
  "private_key_id": "be71d8e0ae95c6e4206637896ff3ad4aeb3ae517",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3baTEif+j1L3v\nyD0Xnvqm0kJDnIh0NAiPanvPcT7Hu8/QYm/tPgQWvD/hDYzyNIBj6Zared/PzoSb\n2bRsxVaDmuO1ELTagNW9Ei2k7N+4VKFLRhOELEZ5EliFImK6/BgNp2d6KbS+XKH1\n2SI3pb2exEmy+uBfmR6Xu+z7OBbd1D5VZ1a6BVCwoY0U+bkqu0a65xTltg38xOjP\n5wtEFLwYg8VMVNoEtqgbw5nqEdVJx8eqAzkPa7cdbUbjkKcNnDydKs24V5Crky8m\nSocnycR0x6e5z2dJl+LD8D2q4s3H5I0rMmGOApkRe7/e5ga/ly4WqiNh0Ru0AhFp\npBETxmNLAgMBAAECggEARy7kp2UKcTDJOPmTQ8xtZznnf0eK6NWckNN5EsrW2zo2\nbp8U4pOTkKMjgxn4HbJkNOHcl9UnFwUFD1pQG3oFlfMQ9R5zoOwohkQ8tGk8dNNa\n+NRMFJn+C1QkSB5NBFV6nCngDVeMDefy7m6CSegnCysPksarNk48whOq5t8geJsR\nGwIw7va/lDJJLj9OjignaZjwArHqV2PHcoBXFRw6wtBSZuflmZTP1J2UubZDwPW9\nrIMzXKT6RMwbH80CUqzZ5UGXc9G8pv61U7OJ55aNEPqhV3nQKlwO7GQRe3cKMzIY\nJh7GUbfJiScA+Fb1DO3l2ickVGH+252/vbuJfO8x2QKBgQDxizKga9O8SAskHDX8\nLD+d3BuSIasHDFP61hg9oRoBLiNr9e5P46W2hh2TbcnlW7Nq+lJuuh411wrdZtoS\nUtbMO641Ox18PP5oALWHmjeoAUQlgG/tCv+C5dCeZ07sqs6uoYdBQjd5NM51yNwE\n22yJ7PQH19ty3BjwflFXVEqQNQKBgQDCaAhSuWqTe6nQFs5CRNMnnAvItKnaUzwB\nh9OO9poPkTvouwtKC90fG3USlNn0gfL/gYK2BbM4KQTkjQc+9pb4W1To4SWU1Q5Z\nBjqVFlQMu796B5OZ46O+7u7qaKoT15lk0lVP3IbL0wx4FSyWzcfzG3+q6K8tZurg\nXQB/OLKVfwKBgQDnsxEjVYvMZodZYj5e4cs8kHFaIjW/ExJT4Z9rLuiVDT8pRsYN\nmF/T0J76Vyx+eRKIogsE8EAegWOIsiqpvRES5ITdxxEnphKcjWGU7FhLLrvCBYxY\nJF6pn+4YpRzOZaLRXV0zOmOgPwl1bvGvLxTU0ZndFDEL4xmBSIqabN8BqQKBgHSg\n3uVqETMbjFunYuREz/zCVBt7ry6ooqY0a0ooTXKraaqMlBA/H9Aqs8iK/lr+nt6E\nPvueXc+CZEoNBVzTqOykNkNj1xz72Ji18O1CMPhWpl+6LeWzuKeyRijg07AFtyPS\nP5YisceT/LYJ1e8+0wbY53WMFJQDW0Nw5/xq8lBXAoGAUeKUrj7nHaQrDP2EbhhW\nzRNy2t9FvKPNIGb9hWiZJrzq4V6srThW4nLX9B7QS2tb8t224Ym6dThEFmoRbfXA\nfcDrMtVOT+RtKOsuxqPQ2XkUMuapjg0m6USw6mODC4D8dSK6PtD+HgDpZUlQDgLQ\n5CSdeP69ESBAf3gGjcW4jIY=\n-----END PRIVATE KEY-----\n",
  "client_email": "dialogflow-chat@kos-glif.iam.gserviceaccount.com",
  "client_id": "110810245445201387905",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dialogflow-chat%40kos-glif.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

const projectId = credentials.project_id;
const sessionClient = new dialogflow.SessionsClient({credentials});

async function runIntent(text) {
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  console.log('Creating Dialogflow request...');
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: 'en-US',
      },
    },
  };

  try {
    console.log('Sending request to Dialogflow...');
    const responses = await sessionClient.detectIntent(request);
    console.log('Received response from Dialogflow');
    return responses[0].queryResult;
  } catch (error) {
    console.error('Error in Dialogflow request:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

module.exports = { runIntent };