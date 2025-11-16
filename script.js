const aquarium = document.getElementById('aquarium');
let currentSpeed = 1.0;
let isPlaying = false;
let audio = null;

// Biến cho chức năng điều khiển cá mập
let sharkElement = null;
let isSharkControlled = false;
let lastMouseX = 0;

// Danh sách nhạc nền
const musicList = [
    "sound1.mp3"
];

// Tạo bọt nước
function createBubbles() {
    for (let i = 0; i < 30; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 20 + 10;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 5 + 5) + 's';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        aquarium.appendChild(bubble);
    }
}

// Tạo thảm thực vật
function createSeaweed() {
    for (let i = 0; i < 15; i++) {
        const seaweed = document.createElement('div');
        seaweed.className = 'seaweed';
        const height = Math.random() * 150 + 100;
        seaweed.style.height = height + 'px';
        seaweed.style.left = (i * 7 + Math.random() * 3) + '%';
        seaweed.style.animationDuration = (Math.random() * 2 + 2) + 's';
        aquarium.appendChild(seaweed);
    }
}

// Tạo đàn cá
function createFish() {
    const colors = [
        ['#ff6b6b', '#ff8e8e'],
        ['#4ecdc4', '#7ee8e0'],
        ['#ffd93d', '#ffe66d'],
        ['#6c5ce7', '#a29bfe'],
        ['#fd79a8', '#fdcb6e']
    ];

    for (let i = 0; i < 12; i++) {
        const fish = document.createElement('div');
        fish.className = 'fish';
        
        const colorPair = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 0.5 + 0.7;
        
        fish.innerHTML = `
            <div class="fish-body" style="background: linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]}); transform: scale(${size});">
                <div class="fish-eye"></div>
                <div class="fish-tail" style="border-left-color: ${colorPair[0]};"></div>
            </div>
        `;
        
        fish.style.top = Math.random() * 70 + 10 + '%';
        fish.style.animationDuration = (Math.random() * 10 + 15) + 's';
        fish.style.animationDelay = Math.random() * 5 + 's';
        
        aquarium.appendChild(fish);
    }
}

// Tạo cá mập
function createShark() {
    sharkElement = document.createElement('div'); // Gán vào biến toàn cục
    sharkElement.className = 'shark';
    sharkElement.innerHTML = `
        <div class="shark-body">
            <div class="shark-fin"></div>
            <div class="shark-eye"></div>
            <div class="shark-tail"></div>
        </div>
    `;
    sharkElement.style.top = '25%';
    sharkElement.style.animationDuration = '25s';
    aquarium.appendChild(sharkElement);
}

// Tạo rùa
function createTurtle() {
    const turtle = document.createElement('div');
    turtle.className = 'turtle';
    turtle.innerHTML = `
        <div class="turtle-shell">
            <div class="turtle-head"></div>
            <div class="turtle-flipper front-left"></div>
            <div class="turtle-flipper back-left"></div>
            <div class="turtle-flipper front-right"></div>
            <div class="turtle-flipper back-right"></div>
        </div>
    `;
    turtle.style.top = '50%';
    turtle.style.animationDuration = '30s';
    aquarium.appendChild(turtle);
}

// Tạo thợ lặn
function createDivers() {
    const positions = ['20%', '50%', '75%'];
    positions.forEach((pos, index) => {
        const diver = document.createElement('div');
        diver.className = 'diver';
        diver.innerHTML = `
            <div class="diver-head"></div>
            <div class="diver-body">
                <div class="diver-tank"></div>
            </div>
            <div class="diver-flipper left"></div>
            <div class="diver-flipper right"></div>
        `;
        diver.style.left = pos;
        diver.style.top = '30%';
        diver.style.animationDuration = (Math.random() * 3 + 4) + 's';
        diver.style.animationDelay = (index * 1.5) + 's';
        aquarium.appendChild(diver);
    });
}

// Cập nhật tốc độ
function updateSpeed(newSpeed) {
    // Giới hạn tốc độ trong khoảng từ 0.5x đến 2.0x
    currentSpeed = Math.max(0.5, Math.min(2.0, newSpeed));
    document.getElementById('speedDisplay').textContent = currentSpeed.toFixed(1) + 'x';
    
    const allAnimated = document.querySelectorAll('.bubble, .seaweed, .fish, .shark, .turtle, .diver');
    allAnimated.forEach(el => {
        // Lấy duration gốc đã lưu, nếu chưa có thì lấy từ style ban đầu và lưu lại
        if (!el.dataset.originalDuration) {
            el.dataset.originalDuration = parseFloat(window.getComputedStyle(el).animationDuration);
        }
        const originalDuration = parseFloat(el.dataset.originalDuration);
        el.style.animationDuration = (originalDuration / currentSpeed) + 's';
    });
}

// Xử lý âm thanh
function toggleMusic() {
    const btn = document.getElementById('musicBtn');
    
    if (!isPlaying) {
        if (!audio) {
            const randomIndex = Math.floor(Math.random() * musicList.length);
            audio = new Audio(musicList[randomIndex]);
            audio.loop = true;
        }
        audio.play();
        btn.textContent = '🔇 Tắt Nhạc';
        btn.classList.add('playing');
        isPlaying = true;
    } else {
        audio.pause();
        btn.textContent = '🎵 Phát Nhạc';
        btn.classList.remove('playing');
        isPlaying = false;
    }
}

// --- Chức năng điều khiển cá mập ---

// Hàm di chuyển cá mập theo chuột
function moveSharkWithMouse(event) {
    if (!isSharkControlled || !sharkElement) return;

    // Lấy tọa độ chuột so với hồ cá
    const rect = aquarium.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Lật cá mập theo hướng di chuyển của chuột
    if (x > lastMouseX) {
        sharkElement.style.transform = 'scaleX(0.5)'; // Quay sang phải
    } else if (x < lastMouseX) {
        sharkElement.style.transform = 'scaleX(-0.5)'; // Quay sang trái
    }
    lastMouseX = x;

    // Cập nhật vị trí của cá mập (trừ đi một nửa kích thước để con trỏ ở giữa)
    sharkElement.style.left = (x - sharkElement.offsetWidth / 2) + 'px';
    sharkElement.style.top = (y - sharkElement.offsetHeight / 2) + 'px';
}

// Hàm bật/tắt chế độ điều khiển
function toggleSharkControl() {
    isSharkControlled = !isSharkControlled;
    const btn = document.getElementById('controlSharkBtn');

    if (isSharkControlled) {
        sharkElement.classList.add('controlled');
        btn.textContent = '✅ Đang Điều Khiển';
        btn.classList.add('playing'); // Tái sử dụng style của nút nhạc cho nổi bật
        aquarium.addEventListener('mousemove', moveSharkWithMouse);
    } else {
        sharkElement.classList.remove('controlled');
        // Đặt lại animation duration để đồng bộ với tốc độ hiện tại
        updateSpeed(currentSpeed);
        btn.textContent = '🕹️ Điều Khiển Cá Mập';
        btn.classList.remove('playing');
        aquarium.removeEventListener('mousemove', moveSharkWithMouse);
    }
}

// Khởi tạo
createBubbles();
createSeaweed();
createFish();
createShark();
createTurtle();
createDivers();

// Event listeners
document.getElementById('decreaseSpeed').addEventListener('click', () => {
    updateSpeed(currentSpeed - 0.1);
});

document.getElementById('increaseSpeed').addEventListener('click', () => {
    updateSpeed(currentSpeed + 0.1);
});

document.getElementById('musicBtn').addEventListener('click', toggleMusic);

document.getElementById('controlSharkBtn').addEventListener('click', () => {
    if (sharkElement) toggleSharkControl();
});

// Cập nhật tốc độ ban đầu
updateSpeed(1.0);