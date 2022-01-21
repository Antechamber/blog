// grab relevent elements
const form = document.querySelector('#compose-form')
const error = document.querySelector('#error')

// listen for form submissions
form.addEventListener('submit', (e) => {
    e.preventDefault()

    // grab submitted data from form
    const title = document.querySelector('#title').value
    const text = document.querySelector('#text').value

    // send a POST request to server. Then wait for promise to resolve.
    // If status 201 is recieved, send user back to home page by removing 'blog/compose' from URL
    fetch('/blog/compose', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": title,
            "text": text
        })
    }).then((response) => {
        if (response.status === 201) {
            window.location.replace(window.location.href.replace('blog/compose', ''))
        } else {
            // error is a blank element in the form that only becomes visible when the below script injects innerHTML
            error.innerHTML = 'Error saving article...'
        }
    })
})