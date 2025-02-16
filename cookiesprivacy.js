document.addEventListener('DOMContentLoaded', function() {
    const privacyLink = document.querySelector('#privacy-link');
    const cookiesLink = document.querySelector('#cookies-link');
    const privacyButton = document.querySelector('#privacy-read-btn');
    const cookiesButton = document.querySelector('#cookies-read-btn');
    const backToHomeButtons = document.querySelectorAll('#back-to-home');

    if (privacyLink) {
        privacyLink.addEventListener('click', function(event) {
            event.preventDefault();
            const privacySection = document.querySelector('#privacy-section');
            if (privacySection) {
                privacySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (cookiesLink) {
        cookiesLink.addEventListener('click', function(event) {
            event.preventDefault();
            const cookiesSection = document.querySelector('#cookies-section');
            if (cookiesSection) {
                cookiesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (privacyButton) {
        privacyButton.addEventListener('click', function() {
            const privacySection = document.querySelector('#privacy-section');
            if (privacySection) {
                privacySection.style.display = 'none';
            }
        });
    }

    if (cookiesButton) {
        cookiesButton.addEventListener('click', function() {
            const cookiesSection = document.querySelector('#cookies-section');
            if (cookiesSection) {
                cookiesSection.style.display = 'none';
            }
        });
    }

    for (let i = 0; i < backToHomeButtons.length; i++) {
        backToHomeButtons[i].addEventListener('click', function() {
            window.location.href = './index.html';
        });
    }
});
