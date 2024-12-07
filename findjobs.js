
const aboutDescriptions = {
  pinterest: "Pinterest is a visual discovery engine for finding ideas like recipes, home and style inspiration, and more.",
  spotify: "Spotify is a digital music service that gives you access to millions of songs and podcasts.",
  mailchimp: "Mailchimp is an all-in-one marketing platform for small businesses, offering email marketing, automations, and more.",
  google: "Google is a multinational technology company that specializes in Internet-related services and products.",
  amazon: "Amazon is a multinational technology and e-commerce company that focuses on retail, cloud computing, and artificial intelligence."
};

// Initialize job data from job cards
const jobDescriptions = {
  pinterest: "You will play a crucial role in creating engaging and visually appealing user interfaces for our job posting platform. Your primary responsibility will be to design and optimize the user experience of our job posting interface, ensuring it is easy to use and visually attractive.",
  spotify: "We are currently growing our community of highly qualified UI Designers who will help us create visually compelling designs that resonate with our audience. Your role will involve working on designing intuitive user interfaces for both our app and web platforms.",
  mailchimp: "Join our creative team to help design user-friendly interfaces for our email marketing services. We are looking for a designer who is passionate about creating visually appealing, functional designs that enhance the user experience.",
  google: "Join our innovative design team at Google to shape the future of digital experiences. As a UI/UX Designer, you will have the opportunity to work on cutting-edge projects that impact millions of users worldwide.",
  amazon: "Amazon is seeking a passionate and detail-oriented Marketing Analyst to help drive our UI/UX designs. Your role will involve designing exceptional interfaces that deliver a seamless user experience across various platforms."
};



const companyImages = {
  Pinterest: "images/pinterest.png",
  Spotify: "images/spotify.png",
  Mailchimp: "images/mailchimp.png",
  Google: "images/GoogleChrome.png",
  Amazon: "images/Amazon.png"
};

const bannerImages = {
  Pinterest: "images/pinterestbanner.jpeg",
  Spotify: "images/spotifybanner.jpeg",
  Mailchimp: "images/mailchimpbanner.jpeg",
  Google: "images/googlebanner.jpg",
  Amazon: "images/amazonbanner.jpeg"
};

// Ensure job card images and descriptions are set when the page loads
document.querySelectorAll('.job-card').forEach(card => {
  const companyName = card.dataset.company;
  const companyImg = companyImages[companyName];

  // Set the company logo
  const imgElement = card.querySelector('img');
  if (companyImg) {
    imgElement.src = companyImg;
    imgElement.alt = `${companyName} Logo`;
  }

  // Assign job description to the job card
  const jobDescription = jobDescriptions[companyName.toLowerCase()] || "No description available.";
  const descriptionElement = card.querySelector('.description');
  if (descriptionElement) {
    descriptionElement.textContent = jobDescription;
  }
});

// Track the currently displayed job
let currentJobDetails = null;

// Function to toggle job details and update company descriptions
function toggleJobDetails(company, title, location, salary, type) {
  const jobDetails = document.querySelector('.jobdetails');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-pane');
  const tabIndicator = document.querySelector('.tab-indicator');

  if (currentJobDetails === company) {
    // Hide details if the same job is clicked
    jobDetails.classList.remove('show');
    jobDetails.classList.add('hidden');
    clearMap();
    currentJobDetails = null;
  } else {
    // Update job details content
    document.getElementById("job-title").textContent = title;
    document.getElementById("job-company").textContent = company;
    document.getElementById("job-location").textContent = `${location}`;
    document.getElementById("job-salary").textContent = `${salary}`;
    document.getElementById("job-type").textContent = `${type}`;

    // Set job description from jobDescriptions (for job-specific info)
    const jobDescription = jobDescriptions[company.toLowerCase()] || "No description available.";
    document.getElementById("job-description").textContent = jobDescription;

    // Update company logo and banner image
    const companyImg = companyImages[company];
    document.getElementById("job-company-img").src = companyImg;
    document.getElementById("job-company-img").alt = `${company} Logo`;

    const bannerImg = bannerImages[company];
    document.getElementById("job-banner-img").src = bannerImg;
    document.getElementById("job-banner-img").alt = `${company} Banner`;

    // Reset tabs and show "Details" tab
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById('tab-details').classList.add('active');
    document.getElementById('content-details').classList.add('active');
    tabIndicator.style.width = `${tabs[0].offsetWidth}px`;
    tabIndicator.style.left = `${tabs[0].offsetLeft}px`;

    // Show the job details section
    jobDetails.classList.remove('hidden');
    jobDetails.classList.add('show');
    currentJobDetails = company;
  }
}


// Attach click events to job cards
document.querySelectorAll('.job-card').forEach(card => {
  card.addEventListener('click', () => {
    const { company, title, location, salary, type } = card.dataset;
    toggleJobDetails(company, title, location, salary, type);
  });
});

// Function to load the map
function loadMap(location) {
  const iframe = document.getElementById("map-iframe");
  const query = encodeURIComponent(location);
  iframe.src = `https://www.google.com/maps?q=${query}&output=embed`;
}

// Function to clear the map
function clearMap() {
  const iframe = document.getElementById("map-iframe");
  if (iframe) iframe.src = ""; // Clear iframe
}

// Tab switching logic
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-pane');
    const tabIndicator = document.querySelector('.tab-indicator');

    // Remove active class from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab
    tab.classList.add('active');
    const tabContentId = `content-${tab.id.split('-')[1]}`;
    document.getElementById(tabContentId).classList.add('active');

    // Handle the Map tab specifically
    if (tab.id === "tab-maps") {
      if (currentJobDetails) {
        // Get the location from the job details and load the map
        const location = document.getElementById("job-location").textContent.replace("Location: ", "").trim();
        loadMap(location); // Load the map with the location
      }
    } else {
      clearMap(); // Clear the map when switching to another tab
    }

    // Adjust tab indicator
    tabIndicator.style.width = `${tab.offsetWidth}px`;
    tabIndicator.style.left = `${tab.offsetLeft}px`;
  });
});

// Function to load the map with location
function loadMap(location) {
  const iframe = document.getElementById("map-iframe");
  const query = encodeURIComponent(location);
  iframe.src = `https://www.google.com/maps?q=${query}&output=embed`; // Embed the map for the location
}

// Function to clear the map (reset iframe)
function clearMap() {
  const iframe = document.getElementById("map-iframe");
  if (iframe) iframe.src = ""; // Clear the iframe source
}

// Initialize the default tab
document.getElementById('tab-details').click();

// New Filtering System
const jobCards = document.querySelectorAll('.job-card');

// Filter criteria
let searchQuery = "";
let selectedFilters = {
  type: [],
  location: "",
  experience: [],
  salaryRange: [1000, 10000],
  workType: []
};

// Utility function to filter jobs based on criteria
function filterJobs() {
  jobCards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const company = card.dataset.company.toLowerCase();
    const location = card.dataset.location.toLowerCase();
    const type = card.dataset.type.toLowerCase();
    const salary = parseInt(card.dataset.salary.replace(/[^0-9]/g, ""));

    const matchesSearch =
      title.includes(searchQuery) ||
      company.includes(searchQuery) ||
      location.includes(searchQuery);

    const matchesType =
      !selectedFilters.type.length ||
      selectedFilters.type.some(filter => type.includes(filter.toLowerCase()));

    const matchesLocation =
      !selectedFilters.location ||
      location.includes(selectedFilters.location.toLowerCase());

    const matchesExperience =
      !selectedFilters.experience.length ||
      selectedFilters.experience.some(exp => card.dataset.type.toLowerCase().includes(exp.toLowerCase()));

    const matchesSalary =
      salary >= selectedFilters.salaryRange[0] &&
      salary <= selectedFilters.salaryRange[1];

    const matchesWorkType =
      !selectedFilters.workType.length ||
      selectedFilters.workType.some(work => type.includes(work.toLowerCase()));

    if (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesExperience &&
      matchesSalary &&
      matchesWorkType
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Event listener for search bar
document.querySelector(".search-input").addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  filterJobs();
});

// Event listeners for filters
document.querySelectorAll(".filter-group input").forEach((input) => {
  input.addEventListener("change", () => {
    const filterType = input.closest(".filter-group").classList[1];
    const value = input.type === "checkbox" ? input.checked : input.value;

    switch (filterType) {
      case "filter-job-type":
        if (value)
          selectedFilters.type.push(input.nextSibling.textContent.trim());
        else
          selectedFilters.type = selectedFilters.type.filter(
            (f) => f !== input.nextSibling.textContent.trim()
          );
        break;

      case "filter-location":
        selectedFilters.location = value.toLowerCase();
        break;

      case "filter-experience-level":
        if (value)
          selectedFilters.experience.push(input.nextSibling.textContent.trim());
        else
          selectedFilters.experience = selectedFilters.experience.filter(
            (f) => f !== input.nextSibling.textContent.trim()
          );
        break;

      case "filter-range-salary":
        selectedFilters.salaryRange = input.value
          .split("-")
          .map((num) => parseInt(num, 10));
        break;

      case "filter-on-location":
        if (value)
          selectedFilters.workType.push(input.nextSibling.textContent.trim());
        else
          selectedFilters.workType = selectedFilters.workType.filter(
            (f) => f !== input.nextSibling.textContent.trim()
          );
        break;
    }

    filterJobs();
  });
});

// Reset filters button
document.querySelector(".reset-filter").addEventListener("click", () => {
  selectedFilters = {
    type: [],
    location: "",
    experience: [],
    salaryRange: [1000, 10000],
    workType: [],
  };

  document.querySelectorAll(".filter-group input").forEach((input) => {
    if (input.type === "checkbox") input.checked = false;
    else input.value = "";
  });

  filterJobs();
});

