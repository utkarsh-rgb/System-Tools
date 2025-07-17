
function sendLogToBackend(level, message) {
  fetch('http://localhost:5000/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ level, message }),
  });
}

// Log examples
sendLogToBackend('info', 'User clicked login');
sendLogToBackend('error', 'Failed to fetch data from API');

export default sendLogToBackend;
