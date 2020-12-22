const form = document.querySelector('#compose-form')
const error = document.querySelector('#error')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const title = document.querySelector('#title').value
    const text = document.querySelector('#text').value

    fetch('/compose', {
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
            window.location.replace(window.location.href.replace('compose', ''))
        } else {
            error.innerHTML = 'Error saving article...'
        }
    })
})