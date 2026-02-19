import {PDFDocument, rgb, StandardFonts} from "pdf-lib";
import fs from "fs";
import path from 'path';
import {fileURLToPath} from 'url';

async function horizontalA4TemplatePDF(pagesNbr, mmCutMargin) {
    if (!pagesNbr || typeof pagesNbr !== 'number' || pagesNbr === 0 || !pagesNbr % 2) return;
    if (!mmCutMargin || typeof mmCutMargin !== 'number' || mmCutMargin < 0 || mmCutMargin >= 210 / 2) return;
    const pdf = await PDFDocument.create();
    const defaultFont = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    const font = {
        default: defaultFont,
        bold: boldFont
    }

    const mmToPts = 2.83465;
    const cutMargin = mmCutMargin * mmToPts;

    const pageSize = {
        width: 297 * mmToPts,
        height: 210 * mmToPts
    }
    const fanzinePage = {
        width: 148 * mmToPts,
        height: 210 * mmToPts,
    }

    for (let i = 1; i <= pagesNbr / 2; i++) {
        const page = pdf.addPage([pageSize.width, pageSize.height]);
        const cover = i === 1 || i === pagesNbr/2;
        addFanzinePage(i, 'left', cover, font, fanzinePage, pageSize, pagesNbr, cutMargin, page);
        addFanzinePage(i, 'right', cover, font, fanzinePage, pageSize, pagesNbr, cutMargin, page);
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const pdfFolder = __dirname + '/pdf';
    const pdfBytes = await pdf.save();
    fs.writeFileSync(`${pdfFolder}/fanzinzin-${pagesNbr}_pages.pdf`, pdfBytes);
    console.log(`✅ Created: fanzinzin-${pagesNbr}_pages.pdf`);
}

await horizontalA4TemplatePDF(6, 2);

function addFanzinePage(i, position, cover, font, fanzineSize, pageSize, pagesNumber, cutMargin, page) {
    if (!['left', 'right'].includes(position)) return;
    if (typeof cover !== 'boolean') return;
    if (!font || Object.keys(font).length !== 2 || !font.default || !font.bold) return;
    if (!isTemplateSizeCorrect(fanzineSize)) return;
    if (!isTemplateSizeCorrect(pageSize)) return;
    if (!cutMargin || typeof cutMargin !== 'number' || cutMargin < 0 || cutMargin >= 210 / 2) return;
    if (!page) return;

    const borderWidth = Math.min(2, cutMargin * 2);
    const rectangle = {
        width: fanzineSize.width - 2 * cutMargin,
        height: fanzineSize.height - 2 * cutMargin,
    };
    const pseudoLineMargin = 20;
    const pseudoLine = {
        width: 2,
        height: fanzineSize.height - pseudoLineMargin * 2,
    };

    let rectangleX;
    let rectangleY;
    if (position === 'left') {
        rectangleX = (pageSize.width / 2 - rectangle.width) / 2;
        rectangleY = (pageSize.height - rectangle.height) / 2;

        page.drawRectangle({
            x: (pageSize.width - pseudoLine.width) / 2,
            y: pseudoLineMargin,
            width: pseudoLine.width,
            height: pseudoLine.height,
            color: rgb(0.059, 0.376, 0.388),
        })
    }
    if (position === 'right') {
        rectangleX = (pageSize.width * 3 / 2 - rectangle.width) / 2;
        rectangleY = (pageSize.height - rectangle.height) / 2;
    }
    page.drawRectangle({
        x: rectangleX,
        y: rectangleY,
        width: rectangle.width,
        height: rectangle.height,
        borderColor: rgb(0.561, 0.224, 0.224),
        borderWidth: borderWidth,
    });
    addLabel(i, position, cover, font, pageSize, pagesNumber, page)

    return page;
}

function addLabel(i, position, cover, font, pageSize, pagesNumber, page) {
    if (!['left', 'right'].includes(position)) return;
    if (!cover || typeof cover !== "boolean") return;
    if (!font || Object.keys(font).length !== 2 || !font.default || !font.bold) return;
    if (!isTemplateSizeCorrect(pageSize)) return;
    if (!pagesNumber || typeof pagesNumber !== 'number' || pagesNumber === 0 || pagesNumber % 2 !== 0) return;
    if (!page) return;
    const label = cover ?
        `Fanzinzin ${i} / ${pagesNumber} C'est la cover Thibz` :
        `Fanzinzin ${i} / ${pagesNumber}`;
    const textSize = cover ? 20 : 25;
    const color = cover ? rgb(0, 0.373, 0.388) : rgb(0.431, 0.431, 0.431);
    const fontType = cover ? font.default : font.bold;
    const textWidth = fontType.widthOfTextAtSize(label, textSize);

    page.drawText(label, {
        x: (pageSize.width / 2 - textWidth) / 2,
        y: (pageSize.height - textSize) / 2,
        size: textSize,
        font: fontType,
        color: color,
    });

    return page;
}

function isTemplateSizeCorrect(page) {
    return page &&
        typeof page === "object" &&
        Object.keys(page).length === 2 &&
        typeof page.width === 'number' && page.width > 0 &&
        typeof page.height === 'number' && page.height > 0;
}
