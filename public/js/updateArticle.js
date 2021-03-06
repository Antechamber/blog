const form = document.querySelector('#compose-form')
const error = document.querySelector('#error')
const articleID = window.location.href.split('article=')[1]


form.addEventListener('submit', (e) => {
    e.preventDefault()

    const title = document.querySelector('#title').value
    const text = document.querySelector('#text').value

    fetch('/blog/compose?article=' + articleID, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": title,
            "text": text
        })
    }).then((response) => {
        if (response.status === 200) {
            window.location.replace(window.location.hostname + '/blog')
        } else {
            error.innerHTML = 'Error updating article...'
        }
    })
})