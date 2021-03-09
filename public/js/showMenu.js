const menu = document.querySelector('.topnav-actions-dropdown-content')
const dropdown = document.querySelector('#topnav-actions-dropdown')

window.onclick = function (event) {
    console.log(menu)
    if (!dropdown.contains(event.target)) {
        menu.style.display = 'none'
    } else {
        menu.style.display === 'flex' ? menu.style.display = 'none' : menu.style.display = 'flex'
    }
}

