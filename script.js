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
let stickers = []; // array to store multiple stickers
let stickerNumber = 2; // track the number of stickers
let customColor1 = color1Input.value;
let customColor2 = color2Input.value;
let stickerData;

// init stickers array with 2 stickers
function initializeStickers() {
    stickers = [];
    for (let i = 1; i <= 2; i++) {
        let img = new Image();
        stickers.push({ image: img, number: i });
    }
    stickerNumber = 2;
}

async function loadAssets() {
    stickerData = await fetch('data/stickerAssets.json').then(response => response.json());
}

const gradDirInput = document.getElementById('grad-dir');

// --- gradient listener ---
gradDirInput.addEventListener('input', () => {
    drawCanvas();
});

loadAssets();

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
                const stickerNum = parseInt(toggle.dataset.stickerNum);

                // Find the sticker in the array
                const stickerObj = stickers.find(s => s.number === stickerNum);
                if (stickerObj) {
                    stickerObj.image.src = imgPath;
                    const color = updateGradientColors(imgPath);
                    if (color && stickerNum === 1) {
                        color1Input.value = color;
                        customColor1 = color;
                    } else if (color && stickerNum === 2) {
                        color2Input.value = color;
                        customColor2 = color;
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
    initializeStickers();
    const sticker1Menu = document.querySelector('#sticker1-dropdown .dropdown-menu');
    const sticker2Menu = document.querySelector('#sticker2-dropdown .dropdown-menu');
    populateImageDropdown(sticker1Menu);
    populateImageDropdown(sticker2Menu);

    resizeCanvas();
    customFrame.onload = () => drawCanvas();
    stickers.forEach(sticker => {
        sticker.image.onload = () => drawCanvas();
    });
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

// sticker button
const addStickerBtn = document.getElementById('add-sticker-btn');
addStickerBtn.addEventListener('click', () => {
    addNewSticker();
});

// reset stickers button
const resetStickersBtn = document.getElementById('reset-stickers-btn');
resetStickersBtn.addEventListener('click', () => {
    resetStickers();
});

function addNewSticker() {
    stickerNumber++;
    const currentStickerNum = stickerNumber; 
    
    const newSticker = { image: new Image(), number: currentStickerNum };
    stickers.push(newSticker);
    
    const container = document.getElementById('stickers-container');
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    controlGroup.id = `sticker${currentStickerNum}-group`;
    
    if (currentStickerNum > 2) {
        const removeX = document.createElement('div');
        removeX.className = 'remove-sticker-x';
        removeX.textContent = '✕';
        removeX.title = 'Remove';
        
        removeX.addEventListener('click', (e) => {
            e.stopPropagation();
            removeSticker(currentStickerNum);
        });
        controlGroup.appendChild(removeX);
    }

    const label = document.createElement('label');
    label.textContent = `Sticker ${currentStickerNum}`;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-dropdown';
    dropdown.id = `sticker${currentStickerNum}-dropdown`;
    
    const toggle = document.createElement('div');
    toggle.className = 'dropdown-toggle';
    toggle.dataset.stickerNum = currentStickerNum;
    
    const placeholderSpan = document.createElement('span');
    placeholderSpan.className = 'placeholder-text';
    placeholderSpan.textContent = 'Select a Sticker';
    
    const previewImg = document.createElement('img');
    previewImg.className = 'selected-preview-img hidden';
    
    toggle.appendChild(placeholderSpan);
    toggle.appendChild(previewImg);
    
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    
    dropdown.appendChild(toggle);
    dropdown.appendChild(dropdownMenu);
    
    controlGroup.appendChild(label);
    controlGroup.appendChild(dropdown);
    
    container.appendChild(controlGroup);
    
    populateImageDropdown(dropdownMenu);
    
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
    
    newSticker.image.onload = () => drawCanvas();
    
    drawCanvas();
}


// remove sticker function
function removeSticker(stickerNum) {
    stickers = stickers.filter(s => s.number !== stickerNum);
    
    const group = document.getElementById(`sticker${stickerNum}-group`);
    if (group) {
        group.remove();
    }
    
    drawCanvas();
}


// reset stickers function
function resetStickers() {
    // clear img
    stickers.forEach(sticker => {
        sticker.image.src = '';
    });
    
    // remove other sticker controls
    for (let i = 3; i <= stickerNumber + 100; i++) {
        const group = document.getElementById(`sticker${i}-group`);
        if (group) {
            group.remove();
        } else {
            break;
        }
    }
    
    // initialize stickers array back to 2
    initializeStickers();
    
    // reset preview images and placeholders
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        const previewImg = toggle.querySelector('.selected-preview-img');
        const placeholderSpan = toggle.querySelector('.placeholder-text');
        
        if (previewImg) {
            previewImg.src = '';
            previewImg.classList.add('hidden');
        }
        if (placeholderSpan) {
            placeholderSpan.textContent = 'Select a Sticker';
        }
    });
    
    drawCanvas();
}

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


// idk how this shit work but while im watching umamusume ss1 ep12 and refactor it, it works somehow
// dont touch it or idk anything broke
// hour = 57
// ^ increase this if it broken, to warn another dev
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

    const angle = parseInt(gradDirInput.value) || 0;
    
    // draw gradients with direction
    const rad = (angle - 90) * (Math.PI / 180);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = canvas.height / 2; // radius of grad line

    // determine the start-end pos
    const x1 = cx + r * Math.cos(rad);
    const y1 = cy + r * Math.sin(rad);
    const x2 = cx - r * Math.cos(rad);
    const y2 = cy - r * Math.sin(rad);

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);

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
    
    const scale = 0.65; // scale for stickers
    
    // check loaded stickers
    const loadedStickers = stickers.filter(s => s.image.complete && s.image.naturalHeight !== 0);

    if (loadedStickers.length > 0) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        const radius = 235; 
        
        const angleStep = 25 * (Math.PI / 180); 
        
        const totalSpan = (loadedStickers.length - 1) * angleStep;
        const startAngle = (Math.PI / 2) - (totalSpan / 2);

        loadedStickers.forEach((sticker, index) => {
            const angle = startAngle + (index * angleStep);

            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);

            const rotation = angle - (Math.PI / 2);

            ctx.save();

            ctx.translate(x, y);

            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            

            ctx.drawImage(
                sticker.image,
                -sticker.image.naturalWidth / 2,
                -sticker.image.naturalHeight / 2
            );
            ctx.restore();
        });
    }


    ctx.save(); 
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 300, 0, Math.PI * 2);
    ctx.lineWidth = 6; // the same as the frame image
    ctx.strokeStyle = "#666688";
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
    
    // find character in characters array
    const character = characters.find(c => 
        c.value.toLowerCase() === characterName.toLowerCase() ||
        c.name.split(' ')[1]?.toLowerCase() === characterName.toLowerCase()
    );
    
    if (character) {
        return findCharacterColorById(character.id);
    }
    return null;
}