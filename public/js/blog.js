// urlParams contains query string parameters from request URL
const urlParams = new URLSearchParams(window.location.search)
const currentPage = parseInt(urlParams.get('page'), 10)

// increment page number by 1, or set equal to two if no currentPage is in the URL (i.e. user is on page 1)
const nextPage = () => {
    if (currentPage) {
        location.assign(window.location.href.replace(`page=${currentPage}`, `page=${currentPage + 1}`))
    } else {
        location.assign(window.location.href + `?page=2`)
    }
}

const prevPage = () => {
    if (currentPage && currentPage > 1) {
        location.assign(window.location.href.replace(`page=${currentPage}`, `page=${currentPage - 1}`))
    } else {
        return
    }
}