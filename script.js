async function fetchLocationDetails() {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      }
      
      async function updateIPAddress() {
        const ipAddressElement = document.getElementById('ipAddress');
        const ipAddress = await fetchLocationDetails();
        ipAddressElement.textContent = ipAddress;
      }
      
      document.getElementById('getStartedBtn').addEventListener('click', () => {
        // Add functionality for the "Get Started" button here
        alert('Get started button clicked!');
      });
      
      // Fetch and display the user's IP address when the page loads
      updateIPAddress();
      

      document.getElementById('getStartedBtn').addEventListener('click', () => {
        // Navigate to the details page
        window.location.href = 'details.html';
      });
      
      