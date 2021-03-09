const urlParams = new URLSearchParams(window.location.search)
const currentPage = parseInt(urlParams.get('page'), 10)

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