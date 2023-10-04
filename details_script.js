// Function to get the user's IP address
async function getIPAddress() {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          return data.ip;
        } catch (error) {
          console.error('Error fetching IP address:', error);
          return null;
        }
      }
      
      // Function to get location details based on IP address
      async function getLocationDetails(ip) {
        if (!ip) {
          return Promise.reject('Invalid IP address');
        }
      
        try {
          const response = await fetch(`https://ipapi.co/${ip}/json/`);
          const data = await response.json();
          const { city, region, org, hostname, latitude, longitude } = data;
          return { city, region, org, hostname, latitude, longitude };
        } catch (error) {
          console.error('Error fetching location details:', error);
          return null;
        }
      }
      
      // Function to update the page with location details
      function updateLocationDetailsOnPage(city, region, org, hostname, latitude, longitude) {
        const cityElement = document.getElementById('city');
        const regionElement = document.getElementById('region');
        const orgElement = document.getElementById('organization');
        const hostnameElement = document.getElementById('hostname');
        const latitudeElement = document.getElementById('latitude');
        const longitudeElement = document.getElementById('longitude');
      
        if (cityElement && regionElement && orgElement && hostnameElement && latitudeElement && longitudeElement) {
          cityElement.innerText = city || 'N/A';
          regionElement.innerText = region || 'N/A';
          orgElement.innerText = org || 'N/A';
          hostnameElement.innerText = hostname || 'N/A';
          latitudeElement.innerText = latitude || 'N/A';
          longitudeElement.innerText = longitude || 'N/A';
        }
      }
// Function to update the map URL with the latitude and longitude
function updateMapUrl(latitude, longitude) {
        const mapIframe = document.getElementById('map-iframe');
        if (mapIframe) {
          const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
          mapIframe.src = mapUrl;
        }
      }
      
      // Function to get the pincode based on IP address using ipapi.co
async function getPincode(ip) {
        if (!ip) {
          return Promise.reject('Invalid IP address');
        }
      
        try {
          const response = await fetch(`https://ipapi.co/${ip}/json/`);
          const data = await response.json();
          return data.postal;
        } catch (error) {
          console.error('Error fetching pincode:', error);
          return null;
        }
      }

      // Function to get the user's time zone
async function getTimeZone(ip) {
        if (!ip) {
          return Promise.reject('Invalid IP address');
        }
      
        try {
          const response = await fetch(`https://ipapi.co/${ip}/json/`);
          const data = await response.json();
          return data.timezone;
        } catch (error) {
          console.error('Error fetching time zone:', error);
          return null;
        }
      }
      // Function to get the current date and time for a given time zone
function getDateTimeForTimeZone(timezone) {
        const date = new Date().toLocaleString('en-US', { timeZone: timezone });
        return new Date(date);
      }

      // Function to get the list of post offices based on pincode
async function getPostOffices(pincode) {
  if (!pincode) {
    return Promise.reject('Invalid pincode');
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    const postOfficeDetails = data[0].PostOffice;
    if (postOfficeDetails && postOfficeDetails.length > 0) {
      return postOfficeDetails;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching post offices:', error);
    return [];
  }
}
      
     // Main function to fetch and display IP address, location details, pincode, time zone, date & time, and post offices
async function displayInfo() {
  const ipAddress = await getIPAddress();

  if (ipAddress) {
    document.getElementById('ip-address').innerText = ipAddress;
    const locationData = await getLocationDetails(ipAddress);

    if (locationData) {
      updateLocationDetailsOnPage(locationData.city, locationData.region, locationData.org, locationData.hostname, locationData.latitude, locationData.longitude);
      
      // Display pincode information
      const pincode = await getPincode(ipAddress);
      if (pincode) {
        document.getElementById('pincode').innerText = pincode;
        const postOffices = await getPostOffices(pincode);
        displayPostOffices(postOffices);
      } else {
        document.getElementById('pincode').innerText = 'N/A';
        document.getElementById('post-offices').innerText = 'No post offices available for this pincode.';
      }

      // Display time zone, date, and time
      const timezone = await getTimeZone(ipAddress);
      if (timezone) {
        const dateTime = getDateTimeForTimeZone(timezone);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
        const formattedDateTime = dateTime.toLocaleDateString(undefined, options);
        document.getElementById('timezone').innerText = `Time Zone: ${timezone}`;
        document.getElementById('datetime').innerText = `Date & Time: ${formattedDateTime}`;
      } else {
        document.getElementById('timezone').innerText = 'Time Zone: N/A';
        document.getElementById('datetime').innerText = 'Date & Time: N/A';
      }

      updateMapUrl(locationData.latitude, locationData.longitude);
    }
  } else {
    document.getElementById('ip-address').innerText = 'Unable to retrieve IP address.';
  }
}



function displayPostOffices(postOffices) {
  const postOfficeContainer = document.getElementById('post-offices');
  postOfficeContainer.innerHTML = '';
  document.getElementById('pincode-info').innerText = 'Message: Number of pincode(s) found: '+postOffices.length;

  if (postOffices.length > 0) {
    postOffices.forEach(postOffice => {
      const card = document.createElement('div');
      card.classList.add('card');

      const postOfficeName = document.createElement('p');
      postOfficeName.innerText = `Name: ${postOffice.Name}`;
      card.appendChild(postOfficeName);

      const branchType = document.createElement('p');
      branchType.innerText = `Branch Type: ${postOffice.BranchType}`;
      card.appendChild(branchType);

      const deliveryStatus = document.createElement('p');
      deliveryStatus.innerText = `Delivery Status: ${postOffice.DeliveryStatus}`;
      card.appendChild(deliveryStatus);

      const district = document.createElement('p');
      district.innerText = `District: ${postOffice.District}`;
      card.appendChild(district);

      const division = document.createElement('p');
      division.innerText = `Division: ${postOffice.Division}`;
      card.appendChild(division);

      postOfficeContainer.appendChild(card);
    });
  } else {
    postOfficeContainer.innerHTML = 'No post offices available for this pincode.';
  }
}

function searchPostOffices() {
  const searchQuery = document.getElementById('search-input').value.toLowerCase();
  const postOfficeCards = document.querySelectorAll('.card');

  postOfficeCards.forEach(card => {
    const cardContent = card.innerText.toLowerCase();
    if (cardContent.includes(searchQuery)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Call the main function to fetch and display information
displayInfo();




      
      
      