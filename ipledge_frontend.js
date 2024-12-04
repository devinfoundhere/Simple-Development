// I hope this works
async function interactWithIPledge(action, patientId, data) {
  // Input validation
  if (!action || typeof action !== 'string') {
    console.error('Invalid action parameter. It must be a non-empty string.');
    alert('Invalid action parameter. Please provide a valid action.');
    return;
  }

  if (!patientId || typeof patientId !== 'string') {
    console.error('Invalid patientId parameter. It must be a non-empty string.');
    alert('Invalid patientId parameter. Please provide a valid patient ID.');
    return;
  }

  if (typeof data !== 'object' || data === null) {
    console.error('Invalid data parameter. It must be an object.');
    alert('Invalid data parameter. Please provide valid data.');
    return;
  }

  try {
    const response = await fetch('/api/ipledge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, patientId, data })
    });

    // Check for network or server errors
    if (!response.ok) {
      let errorMessage = 'An error occurred while interacting with iPledge.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message ? `Error: ${errorData.message}` : errorMessage;
      } catch (jsonError) {
        console.error('Failed to parse error response:', jsonError);
      }
      throw new Error(errorMessage);
    }

    // Parse the response data
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response data:', parseError);
      throw new Error('Failed to parse response data from iPledge.');
    }

    // Log and handle the response
    console.log('Response from iPledge:', responseData);
    // Handle the response appropriately in the frontend (e.g., update UI)
    alert('Operation completed successfully. Please check the console for details.');
  } catch (error) {
    console.error('Error interacting with iPledge:', error);
    alert(`Error: ${error.message}`);
  }
}

// Utility function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const action = document.getElementById('actionInput').value;
  const patientId = document.getElementById('patientIdInput').value;
  const data = {}; // Modify as needed to collect additional data from the form

  // Example: Collecting additional data
  const additionalDataInput = document.getElementById('additionalDataInput');
  if (additionalDataInput) {
    try {
      data.additionalData = JSON.parse(additionalDataInput.value);
    } catch (e) {
      alert('Invalid JSON format for additional data. Please correct it and try again.');
      return;
    }
  }

  interactWithIPledge(action, patientId, data);
}

// Add event listener to form
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ipledgeForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
});

// Example HTML for user interaction (to be included in your frontend)
/*
<form id="ipledgeForm">
  <label for="actionInput">Action:</label>
  <input type="text" id="actionInput" name="action" required>
  <label for="patientIdInput">Patient ID:</label>
  <input type="text" id="patientIdInput" name="patientId" required>
  <label for="additionalDataInput">Additional Data (JSON format):</label>
  <input type="text" id="additionalDataInput" name="additionalData">
  <button type="submit">Submit</button>
</form>
*/
