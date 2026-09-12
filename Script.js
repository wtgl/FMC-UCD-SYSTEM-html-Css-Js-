let isPowerOn = true;
let isLightMode = false;
let currentLang = 'TR';

let flightData = {
    pilot: 'AHMET',
    copilot: 'CAN',
    pax: '142',
    airline: 'THY 1YR',
    lights: 'ALL ON',
    origin: 'LTFM',
    dest: 'LTBA'
};

const translations = {
    TR: { crewTitle: 'PILOT / YOLCU BILDIRIM', lights: 'ISIKLAR', lang: 'DIL SEÇIMI' },
    EN: { crewTitle: 'CREW / PAX DATA', lights: 'LIGHTS', lang: 'LANGUAGE' },
    DE: { crewTitle: 'BESATZUNG / PASSAGIERE', lights: 'LICHTER', lang: 'SPRACHE' }
};

let currentPage = 'CREW';
const scratchpad = document.getElementById('scratchpad');

function updateData(key, value) {
    flightData[key] = value.toUpperCase();
    renderPage();
}

const pages = {
    'LEGS': {
        title: 'ACTIVE RTE 1 LEGS',
        num: '1/2',
        render: () => `
            <div class="screen-row"><span class="magenta">173° / 1 NM</span><span class="green">178/ 1595</span></div>
            <div class="screen-row"><span class="white">DFW210/10</span><span class="green">250/ 8510</span></div>
            <div class="screen-row"><span class="white">ACT</span><span class="green">286/30095</span></div>
            <div class="screen-row"><span class="white">TORNN</span><span class="cyan">289/FL310</span></div>
            <div class="screen-row"><span class="cyan">&lt;RTE LEGS 2</span><span class="cyan">RTE DATA&gt;</span></div>
        `
    },
    'CREW': {
        title: 'CREW / PAX INFO',
        num: '1/1',
        render: () => `
            <div class="screen-row">
                <span class="green">PILOT: <input type="text" class="editable-input green" value="${flightData.pilot}" onchange="updateData('pilot', this.value)"></span>
                <span class="cyan">PAX: <input type="text" class="editable-input cyan" style="width:50px;" value="${flightData.pax}" onchange="updateData('pax', this.value)"></span>
            </div>
            <div class="screen-row">
                <span class="green">CO-PILOT: <input type="text" class="editable-input green" value="${flightData.copilot}" onchange="updateData('copilot', this.value)"></span>
                <span class="magenta">GW: ${(50 + parseInt(flightData.pax || 0)*0.08).toFixed(1)}T</span>
            </div>
            <div class="screen-row">
                <span class="cyan">AIRLINE: <input type="text" class="editable-input cyan" value="${flightData.airline}" onchange="updateData('airline', this.value)"></span>
                <span class="magenta">FUEL: ${(4 + parseInt(flightData.pax || 0)*0.015).toFixed(1)}T</span>
            </div>
            <div class="screen-row"><span class="white">&lt;REFRESH</span><span class="white">CLEAR ALL&gt;</span></div>
        `
    },
    'SETTINGS': {
        title: 'AIRCRAFT SETTINGS',
        num: '1/1',
        render: () => `
            <div class="screen-row">
                <span class="cyan">${translations[currentLang].lights}: ${flightData.lights}</span>
                <span class="green">MODE: NORMAL</span>
            </div>
            <div class="screen-row">
                <span class="magenta">${translations[currentLang].lang}: ${currentLang}</span>
                <span class="magenta">THEME: ${isLightMode ? 'LIGHT' : 'DARK'}</span>
            </div>
            <div class="screen-row">
                <span class="green">ORIGIN: <input type="text" class="editable-input green" style="width:60px;" value="${flightData.origin}" onchange="updateData('origin', this.value)"></span>
                <span class="green">DEST: <input type="text" class="editable-input green" style="width:60px;" value="${flightData.dest}" onchange="updateData('dest', this.value)"></span>
            </div>
            <div class="screen-row"><span class="white">&lt;RESET</span><span class="white">SAVE&gt;</span></div>
        `
    }
};

function renderPage() {
    if (!isPowerOn) return;
    const p = pages[currentPage] || pages['CREW'];
    document.getElementById('page-title').innerText = p.title;
    document.getElementById('page-num').innerText = p.num;

    const body = document.getElementById('screen-body');
    body.innerHTML = p.render();
}

function togglePower() {
    isPowerOn = !isPowerOn;
    const screen = document.getElementById('fmc-screen');
    if (isPowerOn) {
        screen.classList.remove('power-off');
        renderPage();
    } else {
        screen.classList.add('power-off');
        scratchpad.innerText = "";
    }
}

function toggleTheme() {
    if (!isPowerOn) return;
    isLightMode = !isLightMode;
    const screen = document.getElementById('fmc-screen');
    screen.classList.toggle('light-mode', isLightMode);
    renderPage();
}

function changePage(pageKey) {
    if (!isPowerOn) return;
    if (pages[pageKey]) {
        currentPage = pageKey;
        renderPage();
    }
}

function pressKey(val) {
    if (!isPowerOn) return;
    if (val === 'CLR') {
        scratchpad.innerText = scratchpad.innerText.slice(0, -1);
    } else if (val === 'DEL') {
        scratchpad.innerText = "DELETE";
    } else if (val === 'SPC') {
        scratchpad.innerText += " ";
    } else {
        if (scratchpad.innerText === "DELETE") scratchpad.innerText = "";
        scratchpad.innerText += val;
    }
}

function lskClick(lskId) {
    if (!isPowerOn) return;
    const input = scratchpad.innerText;

    if (currentPage === 'CREW') {
        if (lskId === 'L1' && input !== "") flightData.pilot = input;
        if (lskId === 'L2' && input !== "") flightData.copilot = input;
        if (lskId === 'L3' && input !== "") flightData.airline = input;
        if (lskId === 'R1' && input !== "") flightData.pax = input;
    } else if (currentPage === 'SETTINGS') {
        if (lskId === 'L1') flightData.lights = flightData.lights === 'ALL ON' ? 'OFF' : 'ALL ON';
        if (lskId === 'L2') {
            currentLang = currentLang === 'TR' ? 'EN' : (currentLang === 'EN' ? 'DE' : 'TR');
        }
    }

    scratchpad.innerText = "";
    renderPage();
}

renderPage();
