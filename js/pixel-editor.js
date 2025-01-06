class PixelEditor {
    constructor() {
        this.canvas = document.getElementById('pixelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentTool = 'pencil';
        this.currentColor = '#000000';
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.recentColors = new Set(); // 存储最近使用的颜色
        this.tempCanvas = document.createElement('canvas'); // 用于线条预览
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.undoStack = []; // 用于存储操作历史
        this.maxUndoSteps = 10; // 限制历史记录数量
        
        this.initializeCanvas();
        this.initializeTools();
        this.initializeEvents();
    }

    initializeCanvas() {
        const size = document.getElementById('canvasSize').value;
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.width = '512px';
        this.canvas.style.height = '512px';
        this.ctx.imageSmoothingEnabled = false;
        
        this.tempCanvas.width = size;
        this.tempCanvas.height = size;
        this.tempCtx.imageSmoothingEnabled = false;
        
        this.clearCanvas();
        this.saveState(); // 保存初始状态
    }

    saveState() {
        // 限制历史记录数量
        if (this.undoStack.length >= this.maxUndoSteps) {
            this.undoStack.shift(); // 移除最旧的状态
        }
        this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }

    restoreState() {
        if (this.undoStack.length > 0) {
            const imageData = this.undoStack[this.undoStack.length - 1];
            this.ctx.putImageData(imageData, 0, 0);
            this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            this.tempCtx.drawImage(this.canvas, 0, 0);
        }
    }

    initializeTools() {
        // 工具选择
        document.querySelectorAll('.tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                let toolButton = e.target.closest('.tool');
                if (toolButton) {
                    document.querySelector('.tool.active')?.classList.remove('active');
                    toolButton.classList.add('active');
                    this.currentTool = toolButton.id;
                }
            });
        });

        // 颜色选择
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.addEventListener('input', (e) => {
            this.currentColor = e.target.value;
            this.updateRecentColors(this.currentColor);
        });

        // 最近使用的颜色
        document.querySelectorAll('.recent-color').forEach(recent => {
            recent.addEventListener('click', (e) => {
                if (e.target.style.backgroundColor) {
                    this.currentColor = this.rgbToHex(e.target.style.backgroundColor);
                    colorPicker.value = this.currentColor;
                }
            });
        });

        // 画布大小
        document.getElementById('canvasSize').addEventListener('change', () => {
            this.initializeCanvas();
        });

        // 清除按钮
        document.getElementById('clear').addEventListener('click', () => {
            this.clearCanvas();
            this.saveState();
        });

        // 保存按钮
        document.getElementById('save').addEventListener('click', () => {
            this.saveCanvas();
        });
    }

    initializeEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) * (this.canvas.width / this.canvas.clientWidth));
            const y = Math.floor((e.clientY - rect.top) * (this.canvas.height / this.canvas.clientHeight));
            
            this.isDrawing = true;
            this.lastX = x;
            this.lastY = y;

            if (this.currentTool === 'picker') {
                this.pickColor(x, y);
            } else if (this.currentTool !== 'line') {
                this.handleDraw(x, y);
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDrawing) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) * (this.canvas.width / this.canvas.clientWidth));
            const y = Math.floor((e.clientY - rect.top) * (this.canvas.height / this.canvas.clientHeight));
            
            if (this.currentTool === 'line') {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(this.tempCanvas, 0, 0);
                this.drawLine(this.lastX, this.lastY, x, y);
            } else if (this.currentTool !== 'picker') {
                this.handleDraw(x, y);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            if (this.isDrawing) {
                this.saveState();
            }
            this.isDrawing = false;
        });

        this.canvas.addEventListener('mouseout', () => {
            if (this.currentTool === 'line' && this.isDrawing) {
                this.restoreState();
            }
            this.isDrawing = false;
        });
    }

    handleDraw(x, y) {
        switch(this.currentTool) {
            case 'pencil':
                this.drawPixel(x, y);
                break;
            case 'line':
                // 线条工具在mousemove中处理
                break;
            case 'fill':
                this.fillArea(x, y);
                break;
            case 'eraser':
                this.erase(x, y);
                break;
        }
    }

    pickColor(x, y) {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        // 如果是完全透明的像素（alpha = 0），返回白色
        if (imageData[3] === 0) {
            this.currentColor = '#ffffff';
        } else {
            this.currentColor = '#' + [imageData[0], imageData[1], imageData[2]]
                .map(x => x.toString(16).padStart(2, '0'))
                .join('');
        }
        document.getElementById('colorPicker').value = this.currentColor;
        this.updateRecentColors(this.currentColor);
    }

    updateRecentColors(color) {
        if (!color.startsWith('#')) return;
        this.recentColors.add(color);
        const recentColorElements = document.querySelectorAll('.recent-color');
        const colors = Array.from(this.recentColors).slice(-5);
        recentColorElements.forEach((element, index) => {
            if (colors[index]) {
                element.style.backgroundColor = colors[index];
            }
        });
    }

    drawPixel(x, y) {
        this.ctx.fillStyle = this.currentColor;
        this.ctx.fillRect(x, y, 1, 1);
    }

    drawLine(x1, y1, x2, y2) {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        this.ctx.fillStyle = this.currentColor;
        while(true) {
            this.ctx.fillRect(x1, y1, 1, 1);
            if (x1 === x2 && y1 === y2) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x1 += sx; }
            if (e2 < dx) { err += dx; y1 += sy; }
        }
    }

    fillArea(x, y) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        const targetColor = this.getPixel(imageData, x, y);
        const fillColor = this.hexToRgb(this.currentColor);

        if (!fillColor) return;

        const stack = [[x, y]];
        while(stack.length) {
            const [x, y] = stack.pop();
            const pos = (y * this.canvas.width + x) * 4;

            if (this.compareColors(pixels, pos, targetColor)) {
                this.setPixel(pixels, pos, fillColor);
                if (x > 0) stack.push([x - 1, y]);
                if (x < this.canvas.width - 1) stack.push([x + 1, y]);
                if (y > 0) stack.push([x, y - 1]);
                if (y < this.canvas.height - 1) stack.push([x, y + 1]);
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
        // 更新临时画布
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.tempCtx.drawImage(this.canvas, 0, 0);
    }

    erase(x, y) {
        this.ctx.clearRect(x, y, 1, 1);
        // 在擦除的地方填充白色
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x, y, 1, 1);
    }

    clearCanvas() {
        // 用白色填充画布
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.tempCtx.fillStyle = '#ffffff';
        this.tempCtx.fillRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }

    saveCanvas() {
        const link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    getPixel(imageData, x, y) {
        const pos = (y * imageData.width + x) * 4;
        return [
            imageData.data[pos],
            imageData.data[pos + 1],
            imageData.data[pos + 2],
            imageData.data[pos + 3]
        ];
    }

    compareColors(pixels, pos, targetColor) {
        return pixels[pos] === targetColor[0] &&
               pixels[pos + 1] === targetColor[1] &&
               pixels[pos + 2] === targetColor[2] &&
               pixels[pos + 3] === targetColor[3];
    }

    setPixel(pixels, pos, color) {
        pixels[pos] = color.r;
        pixels[pos + 1] = color.g;
        pixels[pos + 2] = color.b;
        pixels[pos + 3] = 255;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3
