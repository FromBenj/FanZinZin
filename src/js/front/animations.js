import {getPDF} from "./custom-pdf-available.js";

export function pdfReady() {
    const submitBtn = document.getElementById('submit-btn');
    const resultMessage = document.getElementById('result-message-container');
    if (!submitBtn || !resultMessage) return;
    submitBtn.addEventListener('click', async (e) => {
        const errors = errorHandling();
        if (errors.length !== 0) {
            errorMessagesHandling(errors);
            return;
        }
        resultMessage.classList.add('done-container');
        await getPDF(e)
            .then(() => resultAnimation(resultMessage))
            .catch((error => console.log('error when creating the pdf: ' + error)))
    })
}

function errorHandling() {
    let errorMessages = [];
    const pagesInput = document.getElementById('pages-number');
    const cutInput = document.getElementById('cut-margin');
    if (!pagesInput || !cutInput) {
        console.log('error: no page number input or no margin cut input.');
        return;
    }
    const pagesNbr = pagesInput.value;
    const cutMargin = cutInput.value;
    if (!pagesNbr || !cutMargin) {
        errorMessages.push("Oops, tu n'as pas rentré toutes test données.");
        return errorMessages;
    }
    const mmToPts = 2.83465;
    const fanzineWidth = 148 * mmToPts; // For a A5 format, in pts
    const rectangleMargin = 2 / mmToPts;  // cf. pdf-creation.js
    if ((typeof pagesNbr) !== 'string' || parseInt(pagesNbr) === 0 || parseInt(pagesNbr) % 2 !== 0) errorMessages.push("Désolé mais le nombre de pages n'est pas correct (0, non divisible par 2,...)");
    if ((typeof cutMargin) !== 'string' || parseInt(cutMargin) < 0 || parseInt(cutMargin) > (fanzineWidth - rectangleMargin) / 2) errorMessages.push("Désolé mais la marge de découpe n'est pas bonne");

    return errorMessages;
}

const errorMessagesHandling = (errors) => {
    const submitBtn = document.getElementById('submit-btn');
    const messagesContainer = document.getElementById('form-errors');
    const pagesInput = document.getElementById('pages-number');
    const marginInput = document.getElementById('cut-margin');
    const importContainer = document.getElementById('import-btns-container');
    if (!submitBtn || !messagesContainer || !pagesInput || !marginInput || !importContainer) return;
    if (errors.length === 0) return;
    submitBtn.disabled = true;
    messagesContainer.classList.add('error-messages');
    importContainer.classList.replace('d-flex', 'd-none');
    errors.forEach((error) => {
        const p = document.createElement('p');
        p.innerText = error;
        messagesContainer.appendChild(p);
    })

    const backToInitial = () => {
        messagesContainer.replaceChildren();
        submitBtn.disabled = false;
        messagesContainer.classList.remove('error-messages');
        importContainer.classList.replace('d-none', 'd-flex');
    }
    pagesInput.addEventListener("focus", () => backToInitial());
    marginInput.addEventListener("focus", () => backToInitial());
}

const resultAnimation = (element, stop = false) => {
    if (!element) return;
    gsap.timeline()
        .to(element, {
            scale: 1.5,
            duration: 0.4,
            ease: "back.out(1.7)"
        })
    if (!stop) {
        gsap.timeline()
            .to(element, {
                scale: 0,
                duration: 0.4,
                ease: "back.in(1.7)",
                delay: 0.6
            })
    }
}
