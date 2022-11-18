"use strict"

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();
        let error = formValidate(form);
        let formData = new FormData(form);
        if(error === 0) {
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                form.reset();
            } else {
                alert("There's some issue")
            }
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let i = 0; i < formReq.length; ++i) {
            const input = formReq[i];
            formRemoveError(input);

            if(input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if(input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                error++;
            } else {
                if(input.value === '') {
                    formAddError(input);
                    error++;
                }
            }

        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }
});






const btns = document.querySelectorAll('.button');
const modalOverlay = document.querySelector('.modal-overlay');
const modals = document.querySelectorAll('.modal');
btns.forEach((el) => {
    el.addEventListener('click', (e) => {
        let path = e.currentTarget.getAttribute('data-path');
        modals.forEach((el) => {
            el.classList.remove('modal-overlay--visible');
        });
        // body.classList.add('overflow-hidden');
        document.querySelector(`[data-target="${path}"]`).classList.add('modal--visible');
        modalOverlay.classList.add('modal-overlay--visible');
    });
});
modalOverlay.addEventListener('click', (e) => {
    if(e.target == modalOverlay) {
        modalOverlay.classList.remove('modal-overlay--visible');
        modals.forEach((el) => {
            el.classList.remove('modal--visible');
        });
    }
});


let heightsOfTitles = document.getElementsByClassName('news__title');
let heightsOfSubtitles = document.getElementsByClassName('news__subtitle');
let maxHeightOfTitles = heightsOfTitles[0].clientHeight;
let maxHeightOfSubtitles = heightsOfSubtitles[0].clientHeight;

for (let i = 0; i < 3; ++i) {
    if(maxHeightOfTitles < heightsOfTitles[i].clientHeight)  maxHeightOfTitles= heightsOfTitles[i].clientHeight;
    if(maxHeightOfSubtitles < heightsOfSubtitles[i].clientHeight)  maxHeightOfSubtitles= heightsOfSubtitles[i].clientHeight;
}
for (let i = 0; i < 3; ++i) {
    heightsOfTitles[i].style.minHeight = maxHeightOfTitles+"px";
    heightsOfSubtitles[i].style.minHeight = maxHeightOfSubtitles+"px";
}
for (let i = 3; i < heightsOfTitles.length; ++i) {
    if(maxHeightOfTitles < heightsOfTitles[i].clientHeight)  maxHeightOfTitles= heightsOfTitles[i].clientHeight;
    if(maxHeightOfSubtitles < heightsOfSubtitles[i].clientHeight)  maxHeightOfSubtitles= heightsOfSubtitles[i].clientHeight;
}
for (let i = 3; i < heightsOfTitles.length; ++i) {
    heightsOfTitles[i].style.minHeight = maxHeightOfTitles+"px";
    heightsOfSubtitles[i].style.minHeight = maxHeightOfSubtitles+"px";
}
