
class DirectionControllerRender {

	constructor(canvas) {
		// console.log(document.getElementById('streamParent').getBoundingClientRect())
		this.ctx = canvas.getContext('2d');
    	this.w = canvas.width;
    	this.h = canvas.height;

    	// console.log(canvas.parentNode.parentNode.getBoundingClientRect())
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

	getDistance(x1, y1, x2, y2) {
	    let dx = x2 - x1;
	    let dy = y2 - y1;
	    let distance = Math.sqrt(dx * dx + dy * dy);
	    return distance;
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
	   
	   	if (x < 40) {
	   		x = 40;
	   	} else if (x > w - 40) {
	   		x = w - 40;
	   	}

	   	if (y < 40) {
	   		y = 40;
	   	} else if (y > h - 40) {
	   		y = h - 40;
	   	}

	   	const r = 30;
	   	const x0 = w / 2;
	   	const y0 = h / 2;
	   	let d = this.getDistance(x0, y0, x, y);
	   	const rd = w / 2 - 10 - r;
	   	if (d > rd) {
            let ratio = rd / d;
            x = x0 + (x - x0) * ratio;
            y = y0 + (y - y0) * ratio;
        }
	    
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

class SpeedControllerRender {
	constructor(canvas) {
		this.ctx = canvas.getContext('2d');
    	this.w = canvas.width;
    	this.h = canvas.height;

    	let render = this;
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
		const imgWidth = document.getElementById('circle').style.width;
    	const imgHeight = document.getElementById('circle').style.height;

          // 获取设备像素比
        var dpr = window.devicePixelRatio || 1;
        const canvas = document.getElementById('car-controller-right');
        
        const w = canvas.width;
        const h = canvas.height;

        const imageWidth = 25 * dpr;
        const imageHeight = 25 * dpr;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);

        const r = 40;
        ctx.beginPath();
        ctx.arc(w/2, r + 1, r, -Math.PI, 0);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w/2 - r, r + 1);
        ctx.lineTo(w/2 - r, r * 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w/2, r * 5 - 1, r, 0, Math.PI);
        ctx.moveTo(w/2 + r, r * 5);
        ctx.lineTo(w/2 + r, r);
        ctx.stroke();

 		if (y < 40) {
        	y = 40;
        } else if (y > h - 40) {
        	y = h - 40;
        }
        ctx.beginPath();
        if (dragging) {
			ctx.lineWidth = 2;
	        ctx.arc(w / 2, y, 30, 0, 2 * Math.PI);
	        ctx.fillStyle = 'lightgray';
	        ctx.fill();
        } else {
        	ctx.lineWidth = 1;
        	ctx.arc(w / 2, y, 30, 0, 2 * Math.PI);
        }
        
        ctx.stroke();
	}
}