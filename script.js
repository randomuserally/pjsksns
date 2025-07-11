const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const imageUpload = document.getElementById('image-upload');
const presetSelect = document.getElementById('preset-select');
const avatarSize = document.getElementById('avatar-size');
const rotateLeftBtn = document.getElementById('rotate-left-btn');
const rotateRightBtn = document.getElementById('rotate-right-btn');
const downloadBtn = document.getElementById('download-btn');

let avatarImage = null;
let presetImage = null;
let avatarScale = 1;
let avatarAngle = 0;
let avatarX = canvas.width / 2;
let avatarY = canvas.height / 2;

let isDragging = false;
let startX, startY;

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.offsetWidth;
    const size = Math.min(containerWidth * 0.9, 400);
    
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    
    const ratio = canvas.width / canvas.height;
    if (ratio !== 1) {
        canvas.width = 400;
        canvas.height = 400;
    }
    
    drawCanvas();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        avatarImage = null;
        avatarScale = 1;
        avatarAngle = 0;
        avatarSize.value = 1;
        avatarX = canvas.width / 2;
        avatarY = canvas.height / 2;
        drawCanvas();

        const reader = new FileReader();
        reader.onload = (event) => {
            avatarImage = new Image();
            avatarImage.onload = () => {
                drawCanvas();
            };
            avatarImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

presetSelect.addEventListener('change', () => {
    const selectedPreset = presetSelect.value;
    if (selectedPreset) {
        presetImage = new Image();
        presetImage.onload = () => {
            drawCanvas();
        };
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
    
    if (e.type.includes('touch')) {
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
    if (avatarImage) {
        isDragging = true;
        const coords = getEventCoordinates(e);
        startX = coords.x - avatarX;
        startY = coords.y - avatarY;
        e.preventDefault();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseout', () => {
    isDragging = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && avatarImage) {
        const coords = getEventCoordinates(e);
        avatarX = coords.x - startX;
        avatarY = coords.y - startY;
        drawCanvas();
        e.preventDefault();
    }
});

canvas.addEventListener('touchstart', (e) => {
    if (avatarImage) {
        isDragging = true;
        const coords = getEventCoordinates(e);
        startX = coords.x - avatarX;
        startY = coords.y - avatarY;
        e.preventDefault();
    }
});

canvas.addEventListener('touchend', (e) => {
    isDragging = false;
    e.preventDefault();
});

canvas.addEventListener('touchcancel', (e) => {
    isDragging = false;
    e.preventDefault();
});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging && avatarImage) {
        const coords = getEventCoordinates(e);
        avatarX = coords.x - startX;
        avatarY = coords.y - startY;
        drawCanvas();
        e.preventDefault();
    }
});

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (avatarImage) {
        ctx.save();
        
        ctx.translate(avatarX, avatarY);
        ctx.rotate(avatarAngle * Math.PI / 180);
        ctx.scale(avatarScale, avatarScale);

        ctx.drawImage(avatarImage, -avatarImage.width / 2, -avatarImage.height / 2);

        ctx.restore();
    }

    if (presetImage) {
        ctx.drawImage(presetImage, 0, 0, canvas.width, canvas.height);
    }
}

function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (avatarImage) {
        ctx.save();
        ctx.translate(avatarX, avatarY);
        ctx.rotate(avatarAngle * Math.PI / 180);
        ctx.scale(avatarScale, avatarScale);
        ctx.drawImage(avatarImage, -avatarImage.width / 2, -avatarImage.height / 2);
        ctx.restore();
    }

    if (presetImage) {
        ctx.drawImage(presetImage, 0, 0, canvas.width, canvas.height);
    }

    ctx.restore();
}
drawCanvas();
