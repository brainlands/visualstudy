class DragElement {
    constructor(ele, parEle) {
        this.dragDom = document.querySelector(ele);
        this.parEle = document.querySelector(parEle);
        this.isDragging = false;
        this.startDrag.bind(this);
        this.init();
        const {width, height} = this.dragDom.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.maxX = this.parEle.getBoundingClientRect().width - width;
        this.maxY = this.parEle.getBoundingClientRect().height - height
    }
    init() {
        if (this.dragDom) {
            this.dragDom.addEventListener('mousedown', this.startDrag);
        }
    }
    startDrag = (event) => {
        this.isDragging = true;
        this.dragDom.style.position = 'absolute';
        this.dragDom.style.zIndex = 100;
        const offsetX = event.clientX - this.dragDom.offsetLeft;
        const offsetY = event.clientY - this.dragDom.offsetTop;
        document.addEventListener('mousemove', this.dragStart(offsetX, offsetY))
        document.addEventListener('mouseup', this.dragEnd)
    }
    dragStart = (offsetX, offsetY) => (event) => {
        if (this.isDragging) {
            const left = Math.max(Math.min(event.clientX - offsetX, this.maxX),0)
            const top = Math.max(Math.min(event.clientY - offsetY, this.maxY),0)
            this.dragDom.style.left = `${left}px`;
            this.dragDom.style.top = `${top}px`;
        }
    }
    dragEnd = (event) => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.dragStart);
        document.removeEventListener('mouseup', this.dragEnd);
    }
}