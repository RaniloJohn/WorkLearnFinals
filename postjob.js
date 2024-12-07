// Reference to the form and job listings container
const postJobForm = document.getElementById('postJobForm');
const jobListingsContainer = document.getElementById('jobListings');

// Load saved jobs on page load
const savedJobs = JSON.parse(localStorage.getItem('jobs')) || [];
renderJobs(savedJobs);

// Form submission event listener
postJobForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Create job object
  const job = {
    jobTitle: document.getElementById('jobTitle').value,
    companyName: document.getElementById('companyName').value,
    location: document.getElementById('location').value,
    salary: document.getElementById('salary').value,
    jobType: document.getElementById('jobType').value,
    jobDescription: document.getElementById('jobDescription').value,
  };

  // Save job to localStorage
  savedJobs.push(job);
  localStorage.setItem('jobs', JSON.stringify(savedJobs));

  // Render the new job and clear the form
  renderJobs(savedJobs);
  postJobForm.reset();
});

// Function to render jobs
function renderJobs(jobs) {
  jobListingsContainer.innerHTML = ''; // Clear previous listings

  jobs.forEach((job, index) => {
    const jobCard = document.createElement('div');
    jobCard.classList.add('job-card');
    
    jobCard.innerHTML = `
      <h2>${job.jobTitle}</h2>
      <p><strong>Company:</strong> ${job.companyName}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Salary:</strong> ${job.salary}</p>
      <p><strong>Type:</strong> ${job.jobType}</p>
      <p>${job.jobDescription}</p>
      <div class="job-actions">
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;

    // Append job card to job listings container
    jobListingsContainer.appendChild(jobCard);
  });

  // Attach event listeners for delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteJob);
  });
}

// Delete job function
function deleteJob(e) {
  const index = e.target.getAttribute('data-index');
  
  // Remove the job from the saved jobs array
  savedJobs.splice(index, 1);

  // Update localStorage
  localStorage.setItem('jobs', JSON.stringify(savedJobs));

  // Re-render jobs after deletion
  renderJobs(savedJobs);
}
