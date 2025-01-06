class PixelEditor {
    constructor() {
        this.canvas = document.getElementById('pixelCanvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.currentTool = 'pencil';
        this.currentColor = '#000000';
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.recentColors = new Set(); // 存储最近使用的颜色
        this.tempCanvas = document.createElement('canvas'); // 用于线条预览
        this.tempCtx = this.tempCanvas.getContext('2d', { willReadFrequently: true });
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
        
        // 初始化为白色背景
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.tempCtx.fillStyle = '#ffffff';
        this.tempCtx.fillRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }

    [之前代码中的其他方法保持不变，只修改以下方法]

    pickColor(x, y) {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        // 如果是完全透明的像素，返回白色
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

    erase(x, y) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x, y, 1, 1);
    }

    clearCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.tempCtx.fillStyle = '#ffffff';
        this.tempCtx.fillRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }

    [其余方法保持不变]
}

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
    new PixelEditor();
});
