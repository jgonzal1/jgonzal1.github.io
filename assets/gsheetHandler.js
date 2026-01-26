/*
exported gapiLoaded
exported gisLoaded
exported handleAuthClick
exported handleSignoutClick
const CLIENT_ID = globalThis.googleClientId;
const API_KEY = globalThis.sheetsApiKey;
Authorization scopes required by the API; multiple scopes can be
included, separated by spaces.
*/
let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}
/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.load('sheets', 'v4');
  gapiInited = true;
  maybeEnableButtons();
}
/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: globalThis.googleClientId,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}
/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await returnSheetsData();
  };
  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}
/**
 * Return sheets data:
 *
 */
async function returnSheetsData() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: globalThis.sheetId,
      range: globalThis.sheetRange,
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById('content').innerText = 'No values found.';
    return;
  }
  /** @typeof {[[h1,h2],[v11,v12],[v21,v22]]} */
  const rv = range.values;
  console.table(range.values);
  // Flatten to string to display
  //const output = range.values.reduce(
  //    (str, row) => `${str}${row[0]}, ${row[1]}\n`,
  //    'col1, col2:\n');
  document.getElementById('content').innerText = range.values;
}