import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap';
import {pdfReady} from "./js/front/animations.js";
import {loadRightView} from "./js/front/device-check.js";

document.addEventListener('DOMContentLoaded', async () => {
    await loadRightView();
    pdfReady();
})
