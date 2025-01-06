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

    [其余方法保持不变...]
}

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
    new PixelEditor();
});
