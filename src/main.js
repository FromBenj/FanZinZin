import {getPDF} from "./js/front/custom-pdf-available.js";
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import {pdfReady} from "./js/front/animations.js";
import {loadRightView} from "./js/front/device-check.js";

document.addEventListener('DOMContentLoaded', async () => {
    await loadRightView();
    pdfReady();
})
