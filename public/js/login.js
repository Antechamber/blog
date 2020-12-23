const loginForm = document.querySelector('#login-form')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // get data
    const email = document.querySelector('#email').value
    const pass = document.querySelector('#pass').value
    const loginError = document.querySelector('#login-error')

    loginError.innerHTML = ''

    // attemp to log in with data
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
                document.cookie = `Authorization=Bearer ${data.token}`
                window.location.replace(window.location.href.replace('users/login', 'blog/compose'))
            })
        } else {
            loginError.innerHTML = 'Invalid credentials. Please try again.'
        }
    })

})