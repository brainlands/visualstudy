class DragElement {
    constructor(container) {
      this.container = container;
      if(!document.querySelector(container)) {
        this.container = document.createElement('div');
        this.container.className = container;
        document.body.appendChild(this.container);
      }
      this.draggables = [];
      this.isDragging = false;
      this.startX = 0;
      this.startY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.draggable = null;
      this.init();
    }
  
    init() {
      document.addEventListener('mousedown', this.startDrag);
    }
  
    add(element, onDragEnd) {
      const draggable = new DraggableElement(element, this.container, onDragEnd);
      this.draggables.push(draggable);
    }
  
    startDrag = (event) => {
      this.draggable = this.getDraggable(event.target);
      if (this.draggable) {
        this.isDragging = true;
        const { left, top } = this.draggable.element.getBoundingClientRect();
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.offsetX = this.startX - this.draggable.element.offsetLeft;
        this.offsetY = this.startY - this.draggable.element.offsetTop;
        this.draggable.element.style.zIndex = 100;
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.endDrag);
      }
    };
  
    drag = (event) => {
      if (this.isDragging) {
        const { clientX, clientY } = event;
        this.draggable.drag(event,this.offsetX, this.offsetY);
      }
    };
  
    endDrag = () => {
      if (this.isDragging) {
        const postion = this.draggable.getPosition();
        this.isDragging = false;
        this.draggable.endDrag(postion);
        this.draggable = null;
      }
    };
  
    getDraggable(element) {
      const draggable = this.draggables.find((draggable) => draggable.element === element);
      return draggable || null;
    }
  }
  
  class DraggableElement {
    constructor(element, container, onDragEnd) {
      this.element =document.createElement('div');
      this.element.classList.add('rect', element);
      container.appendChild(this.element);
      this.onDragEnd = onDragEnd;
      this.container = container;
      this.startX = 0;
      this.startY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      const {width, height} = this.element.getBoundingClientRect();
      this.width = width;
      this.height = height;
      this.maxX = this.container.getBoundingClientRect().width - width;
      this.maxY = this.container.getBoundingClientRect().height - height;
      this.init();
    }
  
    init() {
      this.element.addEventListener('mousedown', this.startDrag);
    }
  
    startDrag = (event) => {
      this.startX = event.clientX;
      this.startY = event.clientY;
      document.addEventListener('mousemove', this.drag);
      document.addEventListener('mouseup', this.endDrag);
    };
  
    drag = (event, offsetX, offsetY) => {
      const { clientX, clientY } = event;
      const left = Math.max(Math.min(clientX - offsetX, this.maxX),0);
      const top = Math.max(Math.min(clientY - offsetY, this.maxY),0);
      this.element.style.left = `${left}px`;
      this.element.style.top = `${top}px`;
    };
  
    endDrag = (postion) => {
      document.removeEventListener('mousemove', this.drag);
      document.removeEventListener('mouseup', this.endDrag);
      this.onDragEnd(postion);
    };
  
    getPosition() {
      return { left: this.element.style.left, top: this.element.style.top, width: this.width, height: this.height };
    }
  }