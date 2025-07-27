const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// --- standard controls ---
const imageUpload = document.getElementById('image-upload');
const presetSelect = document.getElementById('preset-select');
const avatarSize = document.getElementById('avatar-size');
const rotateLeftBtn = document.getElementById('rotate-left-btn');
const rotateRightBtn = document.getElementById('rotate-right-btn');
const downloadBtn = document.getElementById('download-btn');
const modeSwitchBtn = document.getElementById('mode-switch-btn');

// --- custom controls ---
const standardControls = document.getElementById('standard-controls');
const customControls = document.getElementById('custom-controls');
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');

let avatarImage = null;
let presetImage = null;
let avatarScale = 1;
let avatarAngle = 0;
let avatarX = canvas.width / 2;
let avatarY = canvas.height / 2;

let isDragging = false;
let startX, startY;
let isCustomMode = false;

// --- Custom Mode Assets ---
let customFrame = new Image();
customFrame.src = 'assets/frame.png';
let sticker1Image = new Image();
let sticker2Image = new Image();
let customColor1 = color1Input.value;
let customColor2 = color2Input.value;

const stickerData = {
    "airi": ["Airi_03.png", "Airi_04.png", "Airi_06.png", "Airi_07.png", "Airi_08.png", "Airi_09.png", "Airi_11.png", "Airi_12.png", "Airi_13.png", "Airi_14.png", "Airi_16.png", "Airi_17.png", "Airi_18.png"],
    "akito": ["Akito_01.png", "Akito_02.png", "Akito_03.png", "Akito_04.png", "Akito_06.png", "Akito_07.png", "Akito_08.png", "Akito_09.png", "Akito_11.png", "Akito_12.png", "Akito_13.png", "Akito_14.png", "Akito_16.png"],
    "an": ["An_01.png", "An_02.png", "An_03.png", "An_04.png", "An_06.png", "An_07.png", "An_08.png", "An_09.png", "An_11.png", "An_12.png", "An_13.png", "An_14.png", "An_16.png"],
    "emu": ["Emu_01.png", "Emu_02.png", "Emu_03.png", "Emu_04.png", "Emu_06.png", "Emu_07.png", "Emu_08.png", "Emu_09.png", "Emu_11.png", "Emu_12.png", "Emu_13.png", "Emu_14.png", "Emu_16.png"],
    "ena": ["Ena_01.png", "Ena_02.png", "Ena_03.png", "Ena_04.png", "Ena_06.png", "Ena_07.png", "Ena_08.png", "Ena_09.png", "Ena_11.png", "Ena_12.png", "Ena_13.png", "Ena_14.png", "Ena_16.png", "Ena_17.png", "Ena_18.png", "Ena_19.png"],
    "Haruka": ["Haruka_01.png", "Haruka_02.png", "Haruka_03.png", "Haruka_04.png", "Haruka_06.png", "Haruka_07.png", "Haruka_08.png", "Haruka_09.png", "Haruka_11.png", "Haruka_12.png", "Haruka_13.png", "Haruka_14.png", "Haruka_16.png"],
    "Honami": ["Honami_01.png", "Honami_02.png", "Honami_03.png", "Honami_04.png", "Honami_06.png", "Honami_07.png", "Honami_08.png", "Honami_09.png", "Honami_11.png", "Honami_12.png", "Honami_13.png", "Honami_14.png", "Honami_16.png", "Honami_17.png", "Honami_18.png"],
    "Ichika": ["Ichika_01.png", "Ichika_02.png", "Ichika_03.png", "Ichika_04.png", "Ichika_06.png", "Ichika_07.png", "Ichika_08.png", "Ichika_09.png", "Ichika_11.png", "Ichika_12.png", "Ichika_13.png", "Ichika_14.png", "Ichika_16.png", "Ichika_17.png", "Ichika_18.png"],
    "KAITO": ["KAITO_01.png", "KAITO_02.png", "KAITO_03.png", "KAITO_04.png", "KAITO_06.png", "KAITO_07.png", "KAITO_08.png", "KAITO_09.png", "KAITO_11.png", "KAITO_12.png", "KAITO_13.png", "KAITO_14.png", "KAITO_16.png"],
    "Kanade": ["Kanade_01.png", "Kanade_02.png", "Kanade_03.png", "Kanade_04.png", "Kanade_06.png", "Kanade_07.png", "Kanade_08.png", "Kanade_09.png", "Kanade_11.png", "Kanade_12.png", "Kanade_13.png", "Kanade_14.png", "Kanade_16.png", "Kanade_17.png"],
    "Kohane": ["Kohane_01.png", "Kohane_02.png", "Kohane_03.png", "Kohane_04.png", "Kohane_06.png", "Kohane_07.png", "Kohane_08.png", "Kohane_09.png", "Kohane_11.png", "Kohane_12.png", "Kohane_13.png", "Kohane_14.png", "Kohane_16.png", "Kohane_17.png"],
    "Len": ["Len_01.png", "Len_02.png", "Len_03.png", "Len_04.png", "Len_06.png", "Len_07.png", "Len_08.png", "Len_09.png", "Len_11.png", "Len_12.png", "Len_13.png", "Len_14.png", "Len_16.png", "Len_17.png"],
    "Luka": ["Luka_01.png", "Luka_02.png", "Luka_03.png", "Luka_04.png", "Luka_06.png", "Luka_07.png", "Luka_08.png", "Luka_09.png", "Luka_11.png", "Luka_12.png", "Luka_13.png", "Luka_14.png", "Luka_16.png"],
    "Mafuyu": ["Mafuyu_01.png", "Mafuyu_02.png", "Mafuyu_03.png", "Mafuyu_04.png", "Mafuyu_06.png", "Mafuyu_07.png", "Mafuyu_08.png", "Mafuyu_09.png", "Mafuyu_11.png", "Mafuyu_12.png", "Mafuyu_13.png", "Mafuyu_14.png", "Mafuyu_16.png", "Mafuyu_17.png"],
    "Meiko": ["Meiko_01.png", "Meiko_02.png", "Meiko_03.png", "Meiko_04.png", "Meiko_06.png", "Meiko_07.png", "Meiko_08.png", "Meiko_09.png", "Meiko_11.png", "Meiko_12.png", "Meiko_13.png", "Meiko_14.png", "Meiko_16.png"], 
    "Miku": ["Miku_01.png", "Miku_02.png", "Miku_03.png", "Miku_04.png", "Miku_06.png", "Miku_07.png", "Miku_08.png", "Miku_09.png", "Miku_11.png", "Miku_12.png", "Miku_13.png", "Miku_14.png", "Miku_16.png"], 
    "Minori": ["Minori_01.png", "Minori_02.png", "Minori_03.png", "Minori_04.png", "Minori_06.png", "Minori_07.png", "Minori_08.png", "Minori_09.png", "Minori_11.png", "Minori_12.png", "Minori_13.png", "Minori_14.png", "Minori_16.png", "Minori_17.png"],
    "Mizuki": ["Mizuki_01.png", "Mizuki_02.png", "Mizuki_03.png", "Mizuki_04.png", "Mizuki_06.png", "Mizuki_07.png", "Mizuki_08.png", "Mizuki_09.png", "Mizuki_11.png", "Mizuki_12.png", "Mizuki_13.png", "Mizuki_14.png", "Mizuki_16.png", "Mizuki_17.png"], 
    "Nene": ["Nene_01.png", "Nene_02.png", "Nene_03.png", "Nene_04.png", "Nene_06.png", "Nene_07.png", "Nene_08.png", "Nene_09.png", "Nene_11.png", "Nene_12.png", "Nene_13.png", "Nene_14.png", "Nene_16.png"], 
    "Rin": ["Rin_01.png", "Rin_02.png", "Rin_03.png", "Rin_04.png", "Rin_06.png", "Rin_07.png", "Rin_08.png", "Rin_09.png", "Rin_11.png", "Rin_12.png", "Rin_13.png", "Rin_14.png", "Rin_16.png"], 
    "Rui": ["Rui_01.png", "Rui_02.png", "Rui_03.png", "Rui_04.png", "Rui_06.png", "Rui_07.png", "Rui_08.png", "Rui_09.png", "Rui_11.png", "Rui_12.png", "Rui_13.png", "Rui_14.png", "Rui_16.png", "Rui_17.png", "Rui_18.png", "Rui_19.png"], 
    "Saki": ["Saki_01.png", "Saki_02.png", "Saki_03.png", "Saki_04.png", "Saki_06.png", "Saki_07.png", "Saki_08.png", "Saki_09.png", "Saki_11.png", "Saki_12.png", "Saki_13.png", "Saki_14.png", "Saki_16.png", "Saki_17.png", "Saki_18.png"], 
    "Shiho": ["Shiho_01.png", "Shiho_02.png", "Shiho_03.png", "Shiho_04.png", "Shiho_06.png", "Shiho_07.png", "Shiho_08.png", "Shiho_09.png", "Shiho_11.png", "Shiho_12.png", "Shiho_13.png", "Shiho_14.png", "Shiho_16.png", "Shiho_17.png", "Shiho_18.png"], 
    "Shizuku": ["Shizuku_01.png", "Shizuku_02.png", "Shizuku_03.png", "Shizuku_04.png", "Shizuku_06.png", "Shizuku_07.png", "Shizuku_08.png", "Shizuku_09.png", "Shizuku_11.png", "Shizuku_12.png", "Shizuku_13.png", "Shizuku_14.png", "Shizuku_16.png"], 
    "Touya": ["Touya_01.png", "Touya_02.png", "Touya_03.png", "Touya_04.png", "Touya_06.png", "Touya_07.png", "Touya_08.png", "Touya_09.png", "Touya_11.png", "Touya_12.png", "Touya_13.png", "Touya_14.png", "Touya_16.png", "Touya_17.png", "Touya_18.png"], 
    "Tsukasa": ["Tsukasa_01.png", "Tsukasa_02.png", "Tsukasa_03.png", "Tsukasa_04.png", "Tsukasa_06.png", "Tsukasa_07.png", "Tsukasa_08.png", "Tsukasa_09.png", "Tsukasa_11.png", "Tsukasa_12.png", "Tsukasa_13.png", "Tsukasa_14.png", "Tsukasa_16.png", "Tsukasa_17.png", "Tsukasa_18.png"],
};

const characters = [
    { name: 'Hatsune Miku', value: 'miku', id: 21 },
    { name: 'Kagamine Rin', value: 'rin', id: 22 },
    { name: 'Kagamine Len', value: 'len', id: 23},
    { name: 'Megurine Luka', value: 'luka', id: 24 },
    { name: 'MEIKO', value: 'meiko', id: 25 },
    { name: 'KAITO', value: 'kaito', id: 26 },
    { name: 'Hoshino Ichika', value: 'ichika', id: 1},
    { name: 'Tenma Saki', value: 'saki', id: 2 },
    { name: 'Mochizuki Honami', value: 'honami', id: 3 },
    { name: 'Hinomori Shiho', value: 'shiho', id: 4 },
    { name: 'Hanasato Minori', value: 'minori', id: 5},
    { name: 'Kiritani Haruka', value: 'haruka', id: 6 },
    { name: 'Momoi Airi', value: 'airi', id: 7 },
    { name: 'Hinomori Shizuku', value: 'shizuku', id: 8 },
    { name: 'Azusawa Kohane', value: 'kohane', id: 9},
    { name: 'Shiraishi An', value: 'an', id: 10 },
    { name: 'Shinonome Akito', value: 'akito', id: 11 },
    { name: 'Aoyagi Toya', value: 'toya', id: 12 },
    { name: 'Tenma Tsukasa', value: 'tsukasa', id: 13},
    { name: 'Otori Emu', value: 'emu', id: 14 },
    { name: 'Kusanagi Nene', value: 'nene', id: 15 },
    { name: 'Kamishiro Rui', value: 'rui', id: 16 },
    { name: 'Yoisaki Kanade', value: 'kanade', id: 17},
    { name: 'Asahina Mafuyu', value: 'mafuyu', id: 18 },
    { name: 'Shinonome Ena', value: 'ena', id: 19 },
    { name: 'Akiyama Mizuki', value: 'mizuki', id: 20 }
];

const color = [
  "#33aaee",
  "#ffdd44",
  "#ee6666",
  "#bbdd22",
  "#ffccaa",
  "#99ccff",
  "#ffaacc",
  "#99eedd",
  "#ff6699",
  "#00bbdd",
  "#ff7722",
  "#0077dd",
  "#ffbb00",
  "#ff66bb",
  "#33dd99",
  "#bb88ee",
  "#bb6688",
  "#8888cc",
  "#ccaa88",
  "#ddaacc",
  "#33ccbb",
  "#ffcc11",
  "#ffee11",
  "#ffbbcc",
  "#dd4444",
  "#3366cc"
]

function populateImageDropdown(dropdownMenuElement) {
    for (const character in stickerData) {
        if (stickerData[character].length === 0) continue;

        const groupDiv = document.createElement('div');
        groupDiv.className = 'character-group';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'character-name';
        nameDiv.textContent = character;
        groupDiv.appendChild(nameDiv);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'sticker-grid';

        stickerData[character].forEach(stickerFile => {
            const img = document.createElement('img');
            const imgPath = `img/${character}/${stickerFile}`;
            img.src = imgPath;
            img.className = 'sticker-option';
            img.dataset.path = imgPath;
            img.setAttribute('draggable', 'false');

            img.addEventListener('click', () => {
                const dropdown = dropdownMenuElement.closest('.custom-dropdown');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                const previewImg = toggle.querySelector('.selected-preview-img');
                const placeholderSpan = toggle.querySelector('.placeholder-text');
                const stickerNum = toggle.dataset.stickerNum;

                if (stickerNum === '1') {
                    sticker1Image.src = imgPath;
                    const color1 = updateGradientColors(imgPath);
                    if (color1) {
                        color1Input.value = color1;
                        customColor1 = color1;
                    }
                } else {
                    sticker2Image.src = imgPath;
                    const color2 = updateGradientColors(imgPath);
                    if (color2) {
                        color2Input.value = color2;
                        customColor2 = color2;
                    }
                }

                previewImg.src = imgPath;
                previewImg.classList.remove('hidden');
                placeholderSpan.classList.add('hidden');
                
                dropdownMenuElement.classList.remove('visible');
                drawCanvas();
            });
            gridDiv.appendChild(img);
        });

        groupDiv.appendChild(gridDiv);
        dropdownMenuElement.appendChild(groupDiv);
    }
}


function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.offsetWidth;
    const size = Math.min(containerWidth * 0.9, 400);
    
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    
    if (canvas.width !== 600) {
        canvas.width = 600;
        canvas.height = 600;
    }
    
    drawCanvas();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
    const sticker1Menu = document.querySelector('#sticker1-dropdown .dropdown-menu');
    const sticker2Menu = document.querySelector('#sticker2-dropdown .dropdown-menu');
    populateImageDropdown(sticker1Menu);
    populateImageDropdown(sticker2Menu);

    resizeCanvas();
    customFrame.onload = () => drawCanvas();
    sticker1Image.onload = () => drawCanvas();
    sticker2Image.onload = () => drawCanvas();
    avatarImage = new Image();
    avatarImage.onload = () => drawCanvas();
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        avatarScale = 1;
        avatarAngle = 0;
        avatarSize.value = 1;
        avatarX = canvas.width / 2;
        avatarY = canvas.height / 2;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            avatarImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

presetSelect.addEventListener('change', () => {
    const selectedPreset = presetSelect.value;
    if (selectedPreset) {
        presetImage = new Image();
        presetImage.onload = () => drawCanvas();
        presetImage.src = `images/${selectedPreset}`;
    } else {
        presetImage = null;
        drawCanvas();
    }
});

avatarSize.addEventListener('input', (e) => {
    avatarScale = parseFloat(e.target.value);
    drawCanvas();
});

rotateLeftBtn.addEventListener('click', () => {
    avatarAngle -= 15;
    drawCanvas();
});

rotateRightBtn.addEventListener('click', () => {
    avatarAngle += 15;
    drawCanvas();
});

modeSwitchBtn.addEventListener('change', () => {
    isCustomMode = modeSwitchBtn.checked;
    if (isCustomMode) {
        standardControls.classList.add('hidden');
        customControls.classList.remove('hidden');
    } else {
        standardControls.classList.remove('hidden');
        customControls.classList.add('hidden');
    }
    drawCanvas();
});

color1Input.addEventListener('input', (e) => {
    customColor1 = e.target.value;
    drawCanvas();
});
color2Input.addEventListener('input', (e) => {
    customColor2 = e.target.value;
    drawCanvas();
});

document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (event) => {
        const currentMenu = toggle.nextElementSibling;
        document.querySelectorAll('.custom-dropdown .dropdown-menu').forEach(menu => {
            if (menu !== currentMenu) {
                menu.classList.remove('visible');
            }
        });
        currentMenu.classList.toggle('visible');
        event.stopPropagation();
    });
});

window.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown .dropdown-menu').forEach(menu => {
        menu.classList.remove('visible');
    });
});


downloadBtn.addEventListener('click', () => {
    drawCircle();
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    drawCanvas();
});

function getEventCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if (e.type.startsWith('touch')) {
        clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
        clientY = e.touches[0]?.clientY || e.changedTouches[0]?.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

canvas.addEventListener('mousedown', (e) => {
    if (avatarImage && avatarImage.src) {
        isDragging = true;
        const coords = getEventCoordinates(e);
        startX = coords.x - avatarX;
        startY = coords.y - avatarY;
        e.preventDefault();
    }
});
canvas.addEventListener('mouseup', () => { isDragging = false; });
canvas.addEventListener('mouseout', () => { isDragging = false; });
canvas.addEventListener('mousemove', (e) => {
    if (isDragging && avatarImage && avatarImage.src) {
        const coords = getEventCoordinates(e);
        avatarX = coords.x - startX;
        avatarY = coords.y - startY;
        drawCanvas();
        e.preventDefault();
    }
});
canvas.addEventListener('touchstart', (e) => {
    if (avatarImage && avatarImage.src) {
        isDragging = true;
        const coords = getEventCoordinates(e);
        startX = coords.x - avatarX;
        startY = coords.y - avatarY;
        e.preventDefault();
    }
});
canvas.addEventListener('touchend', (e) => { isDragging = false; e.preventDefault(); });
canvas.addEventListener('touchcancel', (e) => { isDragging = false; e.preventDefault(); });
canvas.addEventListener('touchmove', (e) => {
    if (isDragging && avatarImage && avatarImage.src) {
        const coords = getEventCoordinates(e);
        avatarX = coords.x - startX;
        avatarY = coords.y - startY;
        drawCanvas();
        e.preventDefault();
    }
});

function drawAvatar() {
    if (avatarImage && avatarImage.src) {
        ctx.save();
        ctx.translate(avatarX, avatarY);
        ctx.rotate(avatarAngle * Math.PI / 180);
        ctx.scale(avatarScale, avatarScale);
        ctx.drawImage(avatarImage, -avatarImage.width / 2, -avatarImage.height / 2);
        ctx.restore();
    }
}

function drawStandardMode() {
    drawAvatar();
    if (presetImage && presetImage.src) {
        ctx.drawImage(presetImage, 0, 0, canvas.width, canvas.height);
    }
}

function drawCustomMode() {
     // end color

    // white background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw gradient circle (outer circle)
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, customColor1);
    grad.addColorStop(1, customColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw frame image over the gradient
    if (customFrame.complete && customFrame.naturalHeight !== 0) {
        ctx.drawImage(customFrame, 0, 0, canvas.width, canvas.height);
    }
    ctx.restore();

    // clip that cannot be exported
    const innerRadius = canvas.width / 2 - 41; // adjust as needed
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, innerRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    drawAvatar();

    ctx.restore();

    // draw inner circle (white circle)
    ctx.save(); 
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, innerRadius, 0, Math.PI * 2);
    ctx.lineWidth = 6; // the same as the frame image
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.restore();

    const textRadius = canvas.width * 0.4; // 40% of canvas width

    let text = document.getElementById('textInput').value || "Project SEKAI";

    drawLayeredCircularText(
        ctx, 
        text, // text input
        canvas.width / 2, // center X
        canvas.height / 2.08, // center Y
        textRadius,
        Math.PI * 1.5  // starting angle (top)
    );

    const scale = 0.65; // scale for stickers
    const yPadding = 0; 
    const gap = -30; // gap between stickers
    const degree = 8; // rotation degree for stickers

    let sticker1Loaded = sticker1Image.complete && sticker1Image.naturalHeight !== 0;
    let sticker2Loaded = sticker2Image.complete && sticker2Image.naturalHeight !== 0;

    let s1_width = sticker1Loaded ? sticker1Image.naturalWidth * scale : 0;
    let s2_width = sticker2Loaded ? sticker2Image.naturalWidth * scale : 0;

    const totalStickerWidth = s1_width + s2_width + (sticker1Loaded && sticker2Loaded ? gap : 0);
    let startX = (canvas.width - totalStickerWidth) / 2;

    if (sticker1Loaded) {
        const yPos1 = canvas.height - sticker1Image.naturalHeight * scale - yPadding;
        const centerX1 = startX + (sticker1Image.naturalWidth * scale) / 2;
        const centerY1 = yPos1 + (sticker1Image.naturalHeight * scale) / 2;
        ctx.save();
        ctx.translate(centerX1, centerY1);
        ctx.rotate(degree * Math.PI / 180); // deg should be negative for left rotation
        ctx.drawImage(
            sticker1Image,
            -(sticker1Image.naturalWidth * scale) / 2,
            -(sticker1Image.naturalHeight * scale) / 2,
            sticker1Image.naturalWidth * scale,
            sticker1Image.naturalHeight * scale
        );
        ctx.restore();
    }

    if (sticker2Loaded) {
        const yPos2 = canvas.height - sticker2Image.naturalHeight * scale - yPadding;
        const xPos2 = startX + s1_width + (sticker1Loaded ? gap : 0);
        const centerX2 = xPos2 + (sticker2Image.naturalWidth * scale) / 2;
        const centerY2 = yPos2 + (sticker2Image.naturalHeight * scale) / 2;
        ctx.save();
        ctx.translate(centerX2, centerY2);
        ctx.rotate(-1 * degree * Math.PI / 180); // vice versa for right rotation
        ctx.drawImage(
            sticker2Image,
            -(sticker2Image.naturalWidth * scale) / 2,
            -(sticker2Image.naturalHeight * scale) / 2,
            sticker2Image.naturalWidth * scale,
            sticker2Image.naturalHeight * scale
        );
        ctx.restore();
    }

    ctx.save(); 
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 300, 0, Math.PI * 2);
    ctx.lineWidth = 6; // the same as the frame image
    ctx.strokeStyle = "#666688";
    ctx.stroke();
    ctx.restore();

}

function drawCanvas(forceClear = false) {
    if(forceClear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isCustomMode) {
        drawCustomMode();
    } else {
        drawStandardMode();
    }
}

const FONT_FAMILY = 'Rodin'; // defined font
        
function drawLayeredCircularText(ctx, text, centerX, centerY, radius, startAngle) {
    let gradientColors = [];
    gradientColors.push(document.getElementById('color1').value); // start color
    gradientColors.push(document.getElementById('color2').value); // end color

    const fontSize = 40; // adjust font size as needed
    const font = `${fontSize}px ${FONT_FAMILY}`;

    const topTextColor = 'white';
    const backOutlineColor = 'white';
    const shadowColor = 'rgba(40, 40, 40, 0.75)';

    // thicky dude
    const backOutlineWidth = 20; 
    const gradientOutlineWidth = 10;
            
    // shadoos
    const shadowOffsetX = 0;
    const shadowOffsetY = 5;
    const shadowBlur = 8;

    drawTextArc(ctx, text, centerX, centerY, radius, startAngle, font, {
        isShadow: true,
        shadowColor: shadowColor,
        shadowOffsetX: shadowOffsetX,
        shadowOffsetY: shadowOffsetY,
        shadowBlur: shadowBlur,
        lineWidth: backOutlineWidth,
    });

    // 2. white back outl
    drawTextArc(ctx, text, centerX, centerY, radius, startAngle, font, {
        isStroke: true,
        strokeStyle: backOutlineColor,
        lineWidth: backOutlineWidth
    });

    // 3. grad outl
    drawTextArc(ctx, text, centerX, centerY, radius, startAngle, font, {
        isStroke: true,
        strokeStyle: createArcGradient(ctx, centerX, centerY, radius, startAngle, text, font, gradientColors),
        lineWidth: gradientOutlineWidth
    });

    // 4. top white txt
    drawTextArc(ctx, text, centerX, centerY, radius, startAngle, font, {
        isFill: true,
        fillStyle: topTextColor
    });
}

function drawTextArc(ctx, text, centerX, centerY, radius, startAngle, font, options = {}) {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (options.isFill) {
        ctx.fillStyle = options.fillStyle;
    }
    if (options.isStroke) {
        ctx.strokeStyle = options.strokeStyle;
        ctx.lineWidth = options.lineWidth;
        ctx.lineJoin = 'round'; // roundy blud
    }
    if (options.isShadow) {
        ctx.shadowColor = options.shadowColor;
        ctx.shadowOffsetX = options.shadowOffsetX;
        ctx.shadowOffsetY = options.shadowOffsetY;
        ctx.shadowBlur = options.shadowBlur;
        ctx.strokeStyle = 'rgba(0,0,0,0)'; 
        ctx.lineWidth = options.lineWidth;
    }
    const totalWidth = ctx.measureText(text).width;
    const circumference = 2 * Math.PI * radius;
    const totalAngle = (totalWidth / circumference) * (2 * Math.PI) * 0.95;
    
    let currentAngle = startAngle - totalAngle / 2;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charWidth = ctx.measureText(char).width;
        const charAngle = (charWidth / totalWidth) * totalAngle;
        const angleForChar = currentAngle + charAngle / 2;
        
        const x = centerX + Math.cos(angleForChar) * radius;
        const y = centerY + Math.sin(angleForChar) * radius;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angleForChar + Math.PI / 2);
        
        if (options.isStroke && options.strokeStyle.colors) {
            const progress = i / (text.length - 1);
            const color = interpolateColors(options.strokeStyle.colors[0], options.strokeStyle.colors[1], progress);
            ctx.strokeStyle = color;
        }
        
        if (options.isFill) {
            ctx.fillText(char, 0, 0);
        }
        if (options.isStroke || options.isShadow) {
            ctx.strokeText(char, 0, 0);
        }
        
        ctx.restore();
        currentAngle += charAngle;
    }
    ctx.restore();
}

function createArcGradient(ctx, centerX, centerY, radius, startAngle, text, font, colors) {
    return { colors: colors };
}

function interpolateColors(color1, color2, progress) {
    // hex to rgb conversion
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    // interpolate each channel
    const r = Math.round(c1.r + (c2.r - c1.r) * progress);
    const g = Math.round(c1.g + (c2.g - c1.g) * progress);
    const b = Math.round(c1.b + (c2.b - c1.b) * progress);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// conversion helper
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

document.getElementById('textInput').addEventListener('input', drawCustomMode);


function drawCircle() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
    ctx.clip();
    
    ctx.fillStyle = '#ffffff00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isCustomMode) {
        drawCustomMode();
    } else {
        drawStandardMode();
    }
    ctx.restore();
}

drawCanvas(true);

function findCharacterColorById(characterId) {
    return color[characterId - 1] || '#ffffff';
}

function updateGradientColors(stickerPath) {
    const characterName = stickerPath.split('/')[1];
    
    // Find character in characters array
    const character = characters.find(c => 
        c.value.toLowerCase() === characterName.toLowerCase() ||
        c.name.split(' ')[1]?.toLowerCase() === characterName.toLowerCase()
    );
    
    if (character) {
        return findCharacterColorById(character.id);
    }
    return null;
}