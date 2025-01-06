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
        this.clearCanvas();
    }

    initializeTools() {
        // 工具选择
        document.querySelectorAll('.tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                document.querySelector('.tool.active').classList.remove('active');
                e.target.closest('.tool').classList.add('active');
                this.currentTool = e.target.closest('.tool').id;
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
            
            if (this.currentTool === 'picker') {
                this.pickColor(x, y);
            } else {
                this.isDrawing = true;
                this.lastX = x;
                this.lastY = y;
                this.handleDraw(x, y);
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDrawing || this.currentTool === 'picker') return;
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) * (this.canvas.width / this.canvas.clientWidth));
            const y = Math.floor((e.clientY - rect.top) * (this.canvas.height / this.canvas.clientHeight));
            this.handleDraw(x, y);
        });

        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
    }

    handleDraw(x, y) {
        switch(this.currentTool) {
            case 'pencil':
                this.drawPixel(x, y);
                break;
            case 'line':
                this.drawPreviewLine(x, y);
                break;
            case 'fill':
                this.fillArea(x, y);
                break;
            case 'eraser':
                this.erase(x, y);
                break;
        }
    }

    drawPreviewLine(x, y) {
        if (!this.isDrawing) return;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.canvas, 0, 0);
        this.drawLine(this.lastX, this.lastY, x, y);
    }

    pickColor(x, y) {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        const color = '#' + [imageData[0], imageData[1], imageData[2]]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');
        this.currentColor = color;
