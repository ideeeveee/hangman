$(document).ready(function () {
    $('#hangmanForm').submit(function (e) {
        e.preventDefault();
        var csrfToken = $('[name=csrfmiddlewaretoken]').val();
        var formData = $(this).serialize();
        var $form = $(this);
        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: formData,
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function (data) {
                updateStickFigure(data.attempts, data.result);
                if (data && data.currentAnswer) {
                    updateCurrentAnswer(data.currentAnswer);
                    $('#characterInput').val('');
                }
                if (data && data.result) {
                    if (data.result != 'IN_PROGRESS') {
                        displayMessage(data)
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });

    function updateCurrentAnswer(newCurrentAnswer) {
        var $bigBoldCharacters = $('.big-bold-characters');
        $bigBoldCharacters.find('span').each(function (index) {
            $(this).text(newCurrentAnswer[index]);
        });
    }

    $(document).on('click', '.message', function () {
        redirectToHomepage();
    });

    function redirectToHomepage() {
        window.location.href = '/';
    }

    function createMessageElement(message, resultClass) {
        return $('<div class="message ' + resultClass + '"></div>').text(message);
    }

    function displayMessage(response) {
        if (response.result) {
            var resultClass = response.result === 'LOSE' ? 'lose' : response.result === 'WIN' ? 'win' : '';

            if (resultClass) {
                var messageText = response.result === 'LOSE' ? 'Out of attempts! Try another one?' : 'Nailed it! Try another one?';
                var $messageElement = createMessageElement(messageText, resultClass);
                updateCurrentAnswer(response.answer);
                $('body').append($messageElement);
            }
        }
    }

    function updateStickFigure(numParts, result) {
        const stickFigure = document.getElementById("stickFigure");
        stickFigure.innerHTML = "";

        if(result == 'IN_PROGRESS'){
            stickFigure.innerHTML += `
            <line x1="10" y1="10" x2="80" y2="10" stroke="#000" stroke-width="7" />
            <line x1="20" y1="0" x2="20" y2="130" stroke="#000" stroke-width="7" />`;

        } else if(result == 'WIN') {
            numParts = 6;
        }
        else {
            stickFigure.innerHTML += `
            <line x1="10" y1="10" x2="80" y2="10" stroke="#000" stroke-width="7" />
            <line x1="20" y1="0" x2="20" y2="130" stroke="#000" stroke-width="7" />`;
            numParts = 7;
        }
        if (numParts >= 1) {
            stickFigure.innerHTML += `
            <circle cx="50" cy="30" r="10" fill="#fff" />`;
        }

        if (numParts >= 2) {
            stickFigure.innerHTML += `
              <line x1="50" y1="40" x2="50" y2="90" stroke="#fff" stroke-width="5" />`; // Body
        }

        if (numParts >= 3) {
            stickFigure.innerHTML += `<line x1="50" y1="50" x2="60" y2="70" stroke="#fff" stroke-width="5" />`; // right arm
        }

        if (numParts >= 4) {
            stickFigure.innerHTML += `<line x1="50" y1="50" x2="40" y2="70" stroke="#fff" stroke-width="5" />`; // Left Arm
        }

        if (numParts >= 5) {
            stickFigure.innerHTML += `<line x1="50" y1="90" x2="60" y2="120" stroke="#fff" stroke-width="5" />`; // Right leg
        }

        if (numParts >= 6) {
            stickFigure.innerHTML += `<line x1="50" y1="90" x2="40" y2="120" stroke="#fff" stroke-width="5" />`; // Left Leg
        }

        if (numParts >= 7) {
            stickFigure.innerHTML += `<line x1="50" y1="10" x2="50" y2="20" stroke="#000" stroke-width="5" />`; // neck
        }

        if(result == 'WIN') {
            dance();
        }
    }

    function dance() {
            gsap.timeline({ repeat: -1, yoyo: true })
                .to("#stickFigure", { duration: 0.5, ease: "power1.inOut", y: -10, rotation: -10 })
                .to("#stickFigure", { duration: 0.5, ease: "power1.inOut", y: 0, rotation: 0 })
                .to("#stickFigure", { duration: 0.5, ease: "power1.inOut", y: -10, rotation: 10 })
                .to("#stickFigure", { duration: 0.5, ease: "power1.inOut", y: 0, rotation: 0 })
                .to("#stickFigure line:nth-child(3)", { duration: 0.3, rotation: 20, transformOrigin: "50% 50%" }, "-=0.5")
                .to("#stickFigure line:nth-child(5)", { duration: 0.3, rotation: -20, transformOrigin: "50% 50%" }, "-=0.5")
                .to("#stickFigure line:nth-child(4)", { duration: 0.3, rotation: 20, transformOrigin: "50% 100%" }, "-=0.5")
                .to("#stickFigure line:nth-child(6)", { duration: 0.3, rotation: -20, transformOrigin: "50% 100%" }, "-=0.5")
                .to("#stickFigure", { duration: 0.5, ease: "power1.inOut", y: -10, rotation: -10 })
                .to("#stickFigure", { duration: 0.5, ease: "power1.inOut", y: 0, rotation: 0 })
                .to("#stickFigure", { duration: 0.5, ease: "power1.inOut", y: -10, rotation: 10 })
                .to("#stickFigure", { duration: 0.5, ease: "power1.inOut", y: 0, rotation: 0 })
                .to("#stickFigure line:nth-child(3)", { duration: 0.3, rotation: -20, transformOrigin: "50% 50%" }, "-=0.5")
                .to("#stickFigure line:nth-child(5)", { duration: 0.3, rotation: 20, transformOrigin: "50% 50%" }, "-=0.5")
                .to("#stickFigure line:nth-child(4)", { duration: 0.3, rotation: -20, transformOrigin: "50% 100%" }, "-=0.5")
                .to("#stickFigure line:nth-child(6)", { duration: 0.3, rotation: 20, transformOrigin: "50% 100%" }, "-=0.5");

        }

});