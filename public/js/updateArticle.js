const form = document.querySelector('#compose-form')
const error = document.querySelector('#error')
const articleID = window.location.href.split('article=')[1]


form.addEventListener('submit', (e) => {
    e.preventDefault()

    const title = document.querySelector('#title').value
    const text = document.querySelector('#text').value

    // send form data to server in a PATCH request to update article in the DB
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
            location.assign('/')
        } else {
            error.innerHTML = 'Error updating article...'
        }
    })
})

// send DELETE request to remove record from the DB
const deleteArticle = () => {
    fetch('/blog/deletearticle?article=' + articleID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.status === 200) {
            location.assign('/blog/myarticles')
        } else {
            error.innerHTML = "Couldn't delete article..."
        }
    })
}