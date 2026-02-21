import {createHorizontalA4Template} from '../logic/pdf-creation.js';

export async function getPDF(e) {
    const btn = document.getElementById('submit-btn');
    const pagesInput = document.getElementById('pages-number');
    const marginInput = document.getElementById('cut-margin');
    if (!btn || !pagesInput || !marginInput) return;

    return await pdfCreation(e, pagesInput, marginInput);
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
            pdfToCanva(pdfBytes, pagesNbr)
        })
        .catch(error => console.log('pdfCreation function failed: ' + error))
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

    downloadBtn.addEventListener('click', () => {
            downloadPDFAction(pdfBytes, pagesNbr);
        }
    )
}

const pdfToCanva = (pdfBytes, pagesNbr) => {
    const canvaBtn = document.getElementById('canva-btn');
    if (!canvaBtn) return;
    canvaBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        canvaBtn.disabled = true;
        try {
            downloadPDFAction(pdfBytes, pagesNbr);
            const canvaUrl = "https://www.canva.com/signup/?signupRedirect=/design%2Fplay%3Fcategory%3DtAFK2fpTBVQ%26referrer%3Ddocs%26ui%3DeyJFIjp7IkE_IjoiQSIsIkEiOiIifX0&loginRedirect=/design%2Fplay%3Fcategory%3DtAFK2fpTBVQ%26referrer%3Ddocs%26ui%3DeyJFIjp7IkE_IjoiQSIsIkEiOiIifX0";
            console.log(canvaUrl);
            window.open(canvaUrl, "_blank", "noopener");
        } catch (error) {
            console.log("Error when downloading PDF: " + error);
        }
    })
    canvaBtn.disabled = false;
}

const downloadPDFAction = (pdfBytes, pagesNbr) => {
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfName(pagesNbr) + '.pdf';
    a.click();
    a.remove();
    URL.revokeObjectURL(url)
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



