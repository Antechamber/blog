const menu = document.querySelector('.topnav-actions-dropdown-content')
const dropdown = document.querySelector('#topnav-actions-dropdown')

// event.target is the element that was clicked
// two cases: either 1) the element clicked is the main dropdown button( showing username) or somewhere else on the page,
//  or 2) the element clicked was inside the dropdown (in .topnav-actions-dropdown-content)
window.onclick = function (event) {
    // if click occurred anywhere except the 'dropdown' button, hide the menu
    if (!dropdown.contains(event.target)) {
        menu.style.display = 'none'
    } else {
        // if click occurred on the button, show the menu
        menu.style.display === 'flex' ? menu.style.display = 'none' : menu.style.display = 'flex'
    }
}

