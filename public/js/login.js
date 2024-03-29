const loginForm = document.querySelector('#login-form')

// listen for form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // get data
    const email = document.querySelector('#email').value
    const pass = document.querySelector('#pass').value
    const loginError = document.querySelector('#login-error')

    // clear the loginError field once new data has been submitted (i.e. there has been a new login attempt)
    loginError.innerHTML = ''

    // attempt to log in with data. send POST request to server with credentials.
    //  src/routers/users.js handles the validation of this request against the hashed value in the mongo database.
    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "password": pass
        })
    }).then((response) => {
        if (response.status === 200) {
            response.json().then((data) => {
                // add auth token to browser cookies
                document.cookie = `Authorization=Bearer ${data.token}; max-age=7200; path=/`
                // redirect to home page
                location.assign('/')
            })
        } else {
            loginError.innerHTML = 'Invalid credentials. Please try again.'
        }
    })

})