
class DirectionControllerRender2 {

	constructor(canvas) {
		// console.log(document.getElementById('streamParent').getBoundingClientRect())
		this.ctx = canvas.getContext('2d');
    	this.w = canvas.width;
    	this.h = canvas.height;
    	this.rIn = 50;
    	this.rOut = this.w / 2;
    	this.padding = 0;
    	this.overDistance = this.rIn + this.padding;
    	this.btnListeners = [];

    	// console.log(canvas.parentNode.parentNode.getBoundingClientRect())
    	this.offsetTop = 200;
    	this.offsetLeft = canvas.getBoundingClientRect().left;

		this.arrowImg = document.getElementById("upImg");

    	let render = this;
    	
    	let downMouseHandler = function(event) {
    		event.preventDefault();
	        render.isDragging = true;
            render.currentX = event.offsetX;
            render.currentY = event.offsetY;
    	};
    	let moveHandler = function(render) {
            if (render.currentX < 40) {
                render.currentX = 40;
            } else if (render.currentX > render.w - 40) {
                render.currentX = render.w - 40;
            }

			if (render.isDragging) {
				// 示例：圆心(0, 0)，半径 5，起始角度 0，终止角度 Math.PI / 2
				let button = render.onWhichButton(render.currentX, render.currentY,
					render.w / 2, render.h / 2, render.rIn, render.rOut);
				// console.log(result); 
				render.btnListeners.forEach(listener => listener(button));
				render.draw(render.currentX, render.currentY, button, render.isDragging);
			}
    	};
    	let upMouseHandler = function(event) {
	        event.preventDefault();
	        render.isDragging = false;
            render.btnListeners.forEach(listener => listener(0));
	        render.draw(render.w / 2, render.h / 2, false);
    	};
    	canvas.addEventListener('mousedown', downMouseHandler, false);

	    canvas.addEventListener('mousemove', function(event) {
            event.preventDefault();            
            render.currentX = event.offsetX;
            render.currentY = event.offsetY;
            moveHandler(render, event);
        }, false);

	    canvas.addEventListener('mouseup', upMouseHandler, false);

	    canvas.addEventListener('mouseout', function(event) {
	    	event.preventDefault();
	        render.isDragging = false;
            render.btnListeners.forEach(listener => listener(0));
	        render.draw(render.w / 2, render.h / 2, false);
	    })

        let getCurrentTouch = function(id, event) {
            let currentTouch = undefined;
            for (let i = 0; i < event.touches.length; i++) {
                const touch = event.touches[i];
                if (touch.target.id == id) {
                    currentTouch = touch;
                    break;;
                }
            }
            return currentTouch;
        }
	    canvas.addEventListener('touchstart', function(event) {
            event.preventDefault();
            let currentTouch = getCurrentTouch("car-controller-direction", event);
            if (currentTouch == undefined) {
                return;
            }
            render.isDragging = true;
	        render.currentX = currentTouch.clientX;
	        render.currentY = currentTouch.clientY - 70;
        }, false);
	    canvas.addEventListener('touchmove', function(event) {
            event.preventDefault();
            let currentTouch = getCurrentTouch("car-controller-direction", event);
            if (currentTouch == undefined) {
                return;
            }
            render.currentX = currentTouch.clientX;
	        render.currentY = currentTouch.clientY - 70;
            moveHandler(render);
        }, false);
	    canvas.addEventListener('touchend', function(event) {
            console.log('touchend');
            upMouseHandler(event);
        }, false);
	}

	getDistance(x1, y1, x2, y2) {
	    let dx = x2 - x1;
	    let dy = y2 - y1;
	    let distance = Math.sqrt(dx * dx + dy * dy);
	    return distance;
	}

	addButtonListener(listener) {
		this.btnListeners.push(listener);
	}

	onWhichButton(x, y, x0, y0, rIn, rOut) {
	    // 计算坐标与圆心的距离
	    const dx = x0 - x;
		return dx / (x0 - 40);
	}

	draw(x, y, button, dragging) {
		const ctx = this.ctx;
		const w = this.w;
		const h = this.h;
		ctx.clearRect(0, 0, w, h);
		ctx.strokeStyle = '#666666';
	    ctx.lineWidth = 2;
	    ctx.beginPath();
	    ctx.arc(40, h / 2, 39, Math.PI / 2, -Math.PI / 2);
	    ctx.stroke();
	    ctx.beginPath();
        ctx.moveTo(40, 1);
        ctx.lineTo(w - 40, 1);
        ctx.stroke();
        ctx.beginPath();
	    ctx.arc(w - 40 - 1, h / 2, 39, -Math.PI / 2, Math.PI / 2);
	    ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w - 40 -1, h - 1);
        ctx.lineTo(40, h - 1);
        ctx.stroke();

        if (dragging) {
            ctx.beginPath();
            ctx.arc(x, h / 2, 30, 0, Math.PI * 2);
            ctx.fillStyle = 'lightgray';
	        ctx.fill();
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 30, 0, Math.PI * 2);
            ctx.stroke();
        }
	}
}

class SpeedControllerRender2 {
	constructor(canvas) {
		this.ctx = canvas.getContext('2d');
    	this.w = canvas.width;
    	this.h = canvas.height;
    	this.btnListeners = [];

    	let render = this;
    	canvas.addEventListener('mousedown', function(event) {
				event.preventDefault();
	             render.isDragging = true;
	             render.currentX = event.offsetX;
	             render.curretnY = event.offsetY;
    	});
    	canvas.addEventListener('touchstart', function (event) {
	            // this.style.backgroundColor = 'red';
    		let currentTouch = undefined;
            for (let i = 0; i < event.touches.length; i++) {
	            const touch = event.touches[i];
	            if (touch.target.id == "car-controller-right") {
	            	currentTouch = touch;
	            	break;;
	            }
	        }
	        if (currentTouch == undefined) {
	        	return;
	        }
            console.log('touchstart');
            event.preventDefault();
            render.isDragging = true;
            render.currentX = currentTouch.clientX;
            render.curretnY = currentTouch.clientY - 75;
             // console.log(render.offsetX + "," + render.offsetY);

	    }, false);

    	canvas.addEventListener('mousemove', function(event) {
            render.currentX = event.offsetX;
            render.currentY = event.offsetY;
            if (render.currentY < 40) {
            	render.currentY = 40;
            } else if (render.currentY > render.h - 40) {
            	render.currentY = render.h - 40;
            }
            // console.log()

            // console.log('touchmove x=' + touch.clientY + " y=" + canvas.offsetTop);
            event.preventDefault();
            if (render.isDragging) {
            	let button = render.onWhichButton(render.currentX, render.currentY, render.w / 2, render.h / 2);
            	render.btnListeners.forEach(listener => listener(button));
            	render.draw(render.currentX, render.currentY, render.isDragging);
            }

    	});
	    canvas.addEventListener('touchmove', function (event) {
	            // this.style.backgroundColor = 'red';
	    	let currentTouch = undefined;
            for (let i = 0; i < event.touches.length; i++) {
	            const touch = event.touches[i];
	            if (touch.target.id == "car-controller-right") {
	            	currentTouch = touch;
	            	break;;
	            }
	        }
	        if (currentTouch == undefined) {
	        	return;
	        }
            render.currentX = currentTouch.clientX;
            render.currentY = currentTouch.clientY - 75;
            if (render.currentY < 40) {
            	render.currentY = 40;
            } else if (render.currentY > render.h - 40) {
            	render.currentY = render.h - 40;
            }

            // console.log('touchmove x=' + touch.clientY + " y=" + canvas.offsetTop);
            event.preventDefault();
            if (render.isDragging) {
                let button = render.onWhichButton(render.currentX, render.currentY, render.w / 2, render.h / 2);
            	render.btnListeners.forEach(listener => listener(button));
            	render.draw(render.currentX, render.currentY, render.isDragging);
            }

	    }, false);

	    canvas.addEventListener('mouseup', function(event) {
	    	event.preventDefault();
	        render.isDragging = false;
	        render.btnListeners.forEach(listener => listener(0));
	        render.draw(render.w / 2, render.h / 2, false);
	    });
	    canvas.addEventListener('touchend', function (event) {
	            // this.style.backgroundColor = 'red';
	        console.log('touchend');
	        event.preventDefault();
	        render.isDragging = false;
	        render.btnListeners.forEach(listener => listener(0));
	        render.draw(render.w / 2, render.h / 2, false);
	    }, false);

	    canvas.addEventListener('mouseout', function(event) {
	    	render.isDragging = false;
            render.btnListeners.forEach(listener => listener(0));
	    	render.draw(render.w / 2, render.h / 2, false);
	    });
	}

	addButtonListener(listener) {
		this.btnListeners.push(listener);
	}

	onWhichButton(x, y, x0, y0) {
		const dy = y0 - y;
		return dy / (y0 - 40);
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
        ctx.strokeStyle = '#777777';
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