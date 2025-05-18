// script.js

function createNameInputs(count) {
    const container = document.getElementById('names-container');
    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.classList.add('player-name');

        const label = document.createElement('label');
        label.setAttribute('for', `player-name-${i}`);
        label.textContent = `Spieler ${i} `;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player-name-${i}`;
        input.name = `player-name-${i}`;
        input.placeholder = `Name`;

        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);
    }
}

const radios = document.querySelectorAll('input[name="player-count"]');
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const count = parseInt(radio.value);
        createNameInputs(count);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const checkedRadio = document.querySelector('input[name="player-count"]:checked');
    createNameInputs(parseInt(checkedRadio.value));
});

document.getElementById('start-btn').addEventListener('click', () => {
    const nameInputs = document.querySelectorAll('#names-container input');
    const playerNames = Array.from(nameInputs).map((input, index) => {
        const name = input.value.trim();
        return name !== '' ? name : `Spieler ${index + 1}`;
    });

    createTrackingTable(playerNames);

    // Hier Button sichtbar machen
    document.getElementById('evaluate-btn').style.display = 'inline-block';
});

function createTrackingTable(names) {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';

    const table = document.createElement('table');
    table.border = '1';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';

    const headRow = document.createElement('tr');
    const headLabel = document.createElement('th');
    headLabel.textContent = 'Spieler';
    headRow.appendChild(headLabel);

    names.forEach(name => {
        const th = document.createElement('th');
        th.textContent = name;
        headRow.appendChild(th);
    });
    table.appendChild(headRow);

    const bidRow = document.createElement('tr');
    const bidLabel = document.createElement('td');
    bidLabel.textContent = 'Angesagt';
    bidRow.appendChild(bidLabel);

    names.forEach((_, i) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.name = `bid-${i}`;
        input.placeholder = '0';
        td.appendChild(input);
        bidRow.appendChild(td);
    });
    table.appendChild(bidRow);

    const actualRow = document.createElement('tr');
    const actualLabel = document.createElement('td');
    actualLabel.textContent = 'Tatsächlich';
    actualRow.appendChild(actualLabel);

    names.forEach((_, i) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.name = `actual-${i}`;
        input.placeholder = '0';
        td.appendChild(input);
        actualRow.appendChild(td);
    });
    table.appendChild(actualRow);

    tableContainer.appendChild(table);
}

const roundResults = [];
let totalPoints = [];

document.getElementById('evaluate-btn').addEventListener('click', () => {
    const bidInputs = document.querySelectorAll('input[name^="bid-"]');
    const actualInputs = document.querySelectorAll('input[name^="actual-"]');

    const round = [];
    totalPoints = totalPoints.length ? totalPoints : Array(bidInputs.length).fill(0);

    for (let i = 0; i < bidInputs.length; i++) {
        const bid = parseInt(bidInputs[i].value) || 0;
        const actual = parseInt(actualInputs[i].value) || 0;

        let points = 0;
        if (bid === actual) {
            points = 10 + (actual * 3);
        } else {
            points = actual * -3;
        }

        round.push({ bid, actual, points });
        totalPoints[i] += points;
    }

    roundResults.unshift(round);
    renderResultsTable();
});

function renderResultsTable() {
    const namesRow = document.querySelectorAll('#table-container th');
    const playerNames = Array.from(namesRow).slice(1).map(th => th.textContent.split(' (')[0]);

    const rankings = [...totalPoints]
        .map((pts, i) => ({ index: i, pts }))
        .sort((a, b) => b.pts - a.pts);

    const nameWithRank = playerNames.map((name, i) => {
        const place = rankings.findIndex(r => r.index === i) + 1;
        return `${name} (Platz ${place})`;
    });

    const table = document.createElement('table');
    table.border = '1';
    table.style.marginTop = '20px';
    table.style.borderCollapse = 'collapse';
    table.style.minWidth = '300px';

    const headRow = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Runde';
    headRow.appendChild(th);
    nameWithRank.forEach(name => {
        const th = document.createElement('th');
        th.textContent = name;
        headRow.appendChild(th);
    });
    table.appendChild(headRow);

    const totalRow = document.createElement('tr');
    const labelTd = document.createElement('td');
    labelTd.textContent = 'Gesamt';
    totalRow.appendChild(labelTd);
    totalPoints.forEach(score => {
        const td = document.createElement('td');
        td.textContent = score;
        totalRow.appendChild(td);
    });
    table.appendChild(totalRow);

    roundResults.forEach((round, idx) => {
        const row = document.createElement('tr');
        const labelTd = document.createElement('td');
        labelTd.textContent = `Runde ${roundResults.length - idx}`;
        row.appendChild(labelTd);

        round.forEach(entry => {
            const td = document.createElement('td');
            td.textContent = entry.points;
            row.appendChild(td);
        });

        table.appendChild(row);
    });

    const container = document.getElementById('results-table-container');
    container.innerHTML = '';
    container.appendChild(table);
}
