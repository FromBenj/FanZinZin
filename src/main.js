import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'quill/dist/quill.snow.css';
import './styles/main.css';

import {pdfReady} from "./js/front/animations.js";
import {loadRightView} from "./js/front/device-check.js";
import {addModal} from "./js/front/notes.js";

document.addEventListener('DOMContentLoaded', async () => {
    await loadRightView();
    pdfReady();
    addModal();
})
