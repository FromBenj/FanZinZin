export async function loadRightView() {
    let timeOut;
    await loadView();
    window.addEventListener('resize', async () => {
        clearTimeout(timeOut);
        timeOut = setTimeout(async () => {
            await loadView();
        }, 150)
        await loadView();
    })
}

function isDeviceCorrect() {
    if (window.matchMedia("(max-width: 767px) or (orientation: portrait)").matches) {

        return false;
    }

    return true;
}

async function loadView() {
    const app = document.getElementById("app");
    if (!app) return;;
    let viewPath = isDeviceCorrect() ? 'views/home.html' : 'views/error.html';
    await fetch(viewPath)
        .then(response => response.text())
        .then(html => app.innerHTML = html)
        .catch(error => console.log('Impossible to load ' + viewPath + ': ' + error));
}
