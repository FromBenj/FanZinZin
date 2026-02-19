import {createHorizontalA4Template} from './../logic/pdf-creation.js';
import {pdfButtonsAppear} from "./pdf-available.js";

export function getPDF() {
    const btn = document.getElementById('submit-btn');
    const pagesInput = document.getElementById('pages-number');
    const marginInput = document.getElementById('cut-margin');
    if (!btn || !pagesInput || !marginInput) return;

    btn.addEventListener('click', async (e) => {
        await pdfCreation(e, pagesInput, marginInput);
    })
    btn.addEventListener('touchstart', async (e) => {
        await pdfCreation(e, pagesInput, marginInput);
    })
}

const pdfCreation = async (e, pagesInput, marginInput) => {
    e.preventDefault();
    const pagesNbr = parseInt(pagesInput.value);
    if (isNaN(pagesNbr) || !Number.isInteger(pagesNbr) || pagesNbr <= 0) return;
    const cutMargin = parseInt(marginInput.value);
    if (isNaN(cutMargin) || !Number.isInteger(cutMargin) || cutMargin < 0) return;
    console.log(pagesNbr, cutMargin)
    await createHorizontalA4Template(pagesNbr, cutMargin)
        // .then(() => pdfButtonsAppear())
        // .catch(error => console.log(error))
}
