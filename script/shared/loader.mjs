//show + hide Loader

export function showLoader() {
    const loaderContainer = document.getElementById('loader-container');
    if (loaderContainer) {
        loaderContainer.classList.remove('hidden');
    }
}

export function hideLoader() {
    const loaderContainer = document.getElementById('loader-container');
    if (loaderContainer) {
        loaderContainer.classList.add('hidden');
    }
}