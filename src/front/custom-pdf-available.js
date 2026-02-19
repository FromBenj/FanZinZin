import {createHorizontalA4Template} from './../logic/pdf-creation.js';
import {pdfButtonsAppear} from "./animations.js";

export function getPDF() {
    const btn = document.getElementById('submit-btn');
    const pagesInput = document.getElementById('pages-number');
    const marginInput = document.getElementById('cut-margin');
    if (!btn || !pagesInput || !marginInput) return;

    btn.addEventListener('click', async (e) => {
        await pdfCreation(e, pagesInput, marginInput);
    })
    // btn.addEventListener('touchstart', async (e) => {
    //     await pdfCreation(e, pagesInput, marginInput);
    // })
}

const pdfCreation = async (e, pagesInput, marginInput) => {
    e.preventDefault();
    const pagesNbr = parseInt(pagesInput.value);
    if (isNaN(pagesNbr) || !Number.isInteger(pagesNbr) || pagesNbr <= 0) return;
    const cutMargin = parseInt(marginInput.value);
    if (isNaN(cutMargin) || !Number.isInteger(cutMargin) || cutMargin < 0) return;

    return await createHorizontalA4Template(pagesNbr, cutMargin)
        .then((pdfBytes) => {
            previewPDF(pdfBytes);
            downloadPDF(pdfBytes, pagesNbr)
        })
        .catch(error => console.log('pdfCreation function failed: ' + error))
    // .then(() => pdfButtonsAppear())
    // .catch(error => console.log(error))
}

const previewPDF = (pdfBytes) => {
    const previewBtn = document.getElementById('preview-btn');
    if (!previewBtn) return;
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    previewBtn.addEventListener('click', () => {
            const url = URL.createObjectURL(blob);
            window.open(url);
        }
    )
}

const downloadPDF = (pdfBytes, pagesNbr) => {
    const downloadBtn = document.getElementById('download-btn');
    if (!downloadBtn) return;
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    downloadBtn.addEventListener('click', () => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = pdfName(pagesNbr) + '.pdf';
            a.click();
        }
    )
}

const pdfName = (pagesNbr) => {
    const now = new Date();
    const pdfDate = now.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).replaceAll('/', '_');

    return `my-beautiful_${pagesNbr}-pages-template_${pdfDate}`;
}



