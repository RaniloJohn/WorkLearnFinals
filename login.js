document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

   
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    
    const accounts = [
        { email: "delosangeles.ranilojohn@ue.edu.ph", password: "12345", redirectTo: "profile.html" },  
        { email: "WorklearnAdmin@visa.com", password: "Password123", redirectTo: "Homepagecompany.html" } 
        
    ];

    
    let isValidAccount = false;
    let redirectPage = ""; 

   
    for (let i = 0; i < accounts.length; i++) {
        if (email === accounts[i].email && password === accounts[i].password) {
            isValidAccount = true;
            redirectPage = accounts[i].redirectTo;  
            break;  
        }
    }

    
    if (isValidAccount) {
        window.location.href = redirectPage; 
    } else {
        
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = "block"; 
    }
});
