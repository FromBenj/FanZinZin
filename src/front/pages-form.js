export function pagesRepartition() {
    const btn = document.getElementById('number-done-btn');
    const input = document.getElementById('pages-number');
    if (!btn || !input) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pages = parseInt(input.value);
        if (isNaN(pages) || !Number.isInteger(pages) || pages <= 0) return;
        const repartition = getRepartition(pages);
        console.log(repartition)
        // Add message "done!"
    })

    btn.addEventListener('touchstart', () => {
    })
}

pagesRepartition()


function renderSolution() {

}

function getRepartition(pages) {
    if (!Number.isInteger(pages) || pages % 2 === 1) return;
    let repartition = [];
    let leftPage = 0;
    let rightPage = pages;
    while(leftPage < rightPage) {
        let page = leftPage === 0 || leftPage === 1 ?
            {left: leftPage, right: rightPage, cover: true} :
            {left: leftPage, right: rightPage};
        repartition.push(page);
        leftPage++;
        rightPage--;
    }

    return repartition;
}
