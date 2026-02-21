import {gsap} from "gsap";
import {getPDF} from "./custom-pdf-available.js";

export function pdfReady() {
    const submitBtn = document.getElementById('submit-btn')
    const resultMessage = document.getElementById('result-message-container');
    if (!submitBtn || !resultMessage) return;
    submitBtn.addEventListener('click', async (e) => {
        const errors = errorHandling();
        if (errors.length !== 0) {
            resultMessage.classList.add('error-container');
            popErrorMessage(errors, resultMessage);
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
    if ((typeof pagesNbr) !== 'string' || parseInt(pagesNbr) === 0 || parseInt(pagesNbr) % 2 !== 0) errorMessages.push("Désolé mais le nombre de pages n'est pas correct (0, non divisible par 2,...)");
    if ((typeof cutMargin) !== 'string' || parseInt(cutMargin) < 0) errorMessages.push("Désolé mais la marge de découpe n'est pas bonne.");

    return errorMessages;
}

const popErrorMessage = (errors, element) => {

    resultAnimation(element, true);
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
