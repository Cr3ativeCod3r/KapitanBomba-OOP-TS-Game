function soundPlay(sound) {
    sound.currentTime = 0;
    sound.play();
}

function renderHearts(num) {
    lives.innerHTML = "";
    for (let i = 0; i < num; i++) {
        let heartClone = heart.cloneNode(true);
        heartClone.style.display = "inline";
        lives.appendChild(heartClone);
    }
}

let createRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

function clearCanvas() {
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let startButton = () => {    
    const canvasRect = canvas.getBoundingClientRect();
    
    const levelContainer = document.createElement('div');
    levelContainer.style.position = 'absolute';
    levelContainer.style.left = `${canvasRect.left + canvasRect.width / 2 - 200}px`;
    levelContainer.style.top = `${canvasRect.top + canvasRect.height / 2 - 100}px`;
    levelContainer.style.width = '400px';
    levelContainer.style.textAlign = 'center';
    levelContainer.style.zIndex = '1000';
    levelContainer.id = 'levelContainer';
    
    // Rest of the code remains the same...
    const title = document.createElement('h2');
    title.style.color = 'white';
    title.style.fontFamily = 'Arial, sans-serif';
    title.style.marginBottom = '20px';
    title.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    levelContainer.appendChild(title);
    
    const levels = [
        { 
            key: 'easy', 
            text: 'EASY', 
            color: '#4CAF50',
        },
        { 
            key: 'medium', 
            text: 'MEDIUM', 
            color: '#FF9800',
        },
        { 
            key: 'impossible', 
            text: 'IMPOSSIBLE', 
            color: '#F44336',
        }
    ];
    
    levels.forEach((level, index) => {
        const btn = document.createElement('button');
        btn.textContent = level.text;
        btn.style.display = 'block';
        btn.style.width = '200px';
        btn.style.height = '50px';
        btn.style.margin = '10px auto';
        btn.style.fontSize = '18px';
        btn.style.fontWeight = 'bold';
        btn.style.fontFamily = 'Arial, sans-serif';
        btn.style.backgroundColor = level.color;
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.3s ease';
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        });
        
        btn.addEventListener('click', () => {
            currentLevel = level.key;
            levelContainer.remove();
            play();
        });
        
        levelContainer.appendChild(btn);
    });
    
    document.body.appendChild(levelContainer);
};
