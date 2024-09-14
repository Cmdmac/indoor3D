
class ControllerRender {

	constructor(canvas) {
		console.log(document.getElementById('streamParent').getBoundingClientRect())
		this.ctx = canvas.getContext('2d');
    	this.w = canvas.width;
    	this.h = canvas.height;

    	console.log(canvas.parentNode.parentNode.getBoundingClientRect())
    	this.offsetTop = 200;
    	this.offsetLeft = canvas.getBoundingClientRect().left;

    	let render = this;
    	canvas.addEventListener('mousedown', function (event) {
            // this.style.backgroundColor = 'red';
            console.log('down');
             event.preventDefault();
	    }, false);

	    canvas.addEventListener('mousemove', function (event) {
	            // this.style.backgroundColor = 'red';
	        event.preventDefault()
	            console.log('move');
	    }, false);

	    canvas.addEventListener('mouseup', function (event) {
	            // this.style.backgroundColor = 'red';
	            console.log('up');
	    }, false);

	    canvas.addEventListener('touchstart', function (event) {
	            // this.style.backgroundColor = 'red';
	            console.log('touchstart');
	             event.preventDefault();
	             render.isDragging = true;
	             let touch = event.touches[0];
	             render.currentX = touch.clientX  - render.offsetLeft;
	             render.curretnY = touch.clientY - render.offsetTop;
	             // console.log(render.offsetX + "," + render.offsetY);

	    }, false);

	    canvas.addEventListener('touchmove', function (event) {
	            // this.style.backgroundColor = 'red';
	    	let touch = event.touches[0];
            render.currentX = touch.clientX  - render.offsetLeft;
            render.currentY = touch.clientY - 75;
            // console.log()

            // console.log('touchmove x=' + touch.clientY + " y=" + canvas.offsetTop);
            event.preventDefault();
            if (render.isDragging) {
            	render.draw(render.currentX, render.currentY, render.isDragging);
            }
	    }, false);

	    canvas.addEventListener('touchend', function (event) {
	            // this.style.backgroundColor = 'red';
	        console.log('touchend');
	        event.preventDefault();
	        render.isDragging = false;
	        render.draw(render.w / 2, render.h / 2, false);
	    }, false);
	}

	draw(x, y, dragging) {
		const ctx = this.ctx;
		const w = this.w;
		const h = this.h;
		ctx.clearRect(0, 0, w, h);
		ctx.strokeStyle = 'gray';
	    ctx.lineWidth = 2;
	    ctx.beginPath();
	    ctx.arc(w / 2, h / 2, w / 2 - 5, 0, 2 * Math.PI);
	    ctx.stroke();

	    ctx.beginPath();
	   
	    
	    if (dragging) {
	    	ctx.lineWidth = 2;
	    	ctx.arc(x, y, 30, 0, 2 * Math.PI);
	    	ctx.fillStyle = 'lightgray';
			ctx.fill();
	    } else {
	    	ctx.lineWidth = 1;
	    	ctx.arc(x, y, 30, 0, 2 * Math.PI);
	    }
	  	ctx.stroke();
	    
	}


}