import Quill from 'quill';

export function addModal() {
    const button = document.getElementById('notes-button');
    const modalContainer = document.getElementById('notes-modal-container');
    if (!button || !modalContainer) return;

    button.addEventListener('click', async () => {
        await fetch('views/notes.html')
            .then(response => response.text())
            .then(html => modalContainer.innerHTML = html)
            .then(() => {
                const quill = addTextEditor();
                setContent(quill);
                textChangeListener(quill);
            })
            .catch(error => console.log('Impossible to load the notes modal: ' + error));
    })
}

const addTextEditor = () => {
    const editor = document.getElementById("editor");
    if (!editor) return;

    return new Quill(editor, {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
            ],
        },
        placeholder: 'Pense-bête pour la prochaine fois...',
        theme: 'snow',
    });
}

const textChangeListener = (quill) => {
    if (!quill) return;
    quill.on('text-change', function (delta, oldDelta, source) {
        if (source === 'user') {
            const content = quill.getContents();
            localStorage.setItem('note-content', JSON.stringify(content));
        }
    });
}

const setContent = (quill) => {
    if (!quill) return;
    const savedNotes = localStorage.getItem('note-content');
    if (savedNotes) {
        quill.setContents(JSON.parse(savedNotes));
    }
}
