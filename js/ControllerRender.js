
class DirectionControllerRender {

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
    	let moveMouseHandler = function(event) {
            render.currentX = event.offsetX;
            render.currentY = event.offsetY;
            event.preventDefault();            

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
	        render.draw(render.w / 2, render.h / 2, false);
    	};
    	canvas.addEventListener('mousedown', downMouseHandler, false);

	    canvas.addEventListener('mousemove', moveMouseHandler, false);

	    canvas.addEventListener('mouseup', upMouseHandler, false);

	    canvas.addEventListener('mouseout', function(event) {
	    	event.preventDefault();
	        render.isDragging = false;
	        render.draw(render.w / 2, render.h / 2, false);
	    })

	    let downTouchHandler = function (event) {
	            // this.style.backgroundColor = 'red';
            console.log('touchstart');
            event.preventDefault();
            render.isDragging = true;
            let touch = event.touches[0];
	        render.currentX = touch.clientX;
	        render.currentY = touch.clientY - 70;
             // console.log(render.offsetX + "," + render.offsetY);

	    };
    	let moveTouchHandler = function (event) {
	            // this.style.backgroundColor = 'red';
	    	let touch = event.touches[0];
	        render.currentX = touch.clientX;
	        render.currentY = touch.clientY - 70;
            event.preventDefault();

            // 示例：圆心(0, 0)，半径 5，起始角度 0，终止角度 Math.PI / 2
			let button = render.onWhichButton(render.currentX, render.currentY,
				render.w / 2, render.h / 2, render.rIn, render.rOut);
			render.btnListeners.forEach(listener => listener(button));
			// if (render.isDragging) {
				render.draw(render.currentX, render.currentY, button, render.isDragging);
			// }
	    };
	    let upTouchHandler = function (event) {
	            // this.style.backgroundColor = 'red';
	        console.log('touchend');
	        event.preventDefault();
	        render.isDragging = false;
	        render.draw(render.w / 2, render.h / 2, false);
	    };
	    canvas.addEventListener('touchstart', downTouchHandler, false);
	    canvas.addEventListener('touchmove', moveTouchHandler, false);
	    canvas.addEventListener('touchend', upTouchHandler, false);
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
	    let distance = this.getDistance(x, y, x0, y0);
	    let dx = x - x0;
	    let dy = y - y0;
	    let angle;
	    if (dx > 0 && dy >= 0) {
	        angle = Math.atan(dy / dx);
	    } else if (dx === 0 && dy > 0) {
	        angle = Math.PI / 2;
	    } else if (dx < 0) {
	        angle = Math.atan(dy / dx) + Math.PI;
	    } else {
	        angle = Math.atan(dy / dx) + 2 * Math.PI;
	    }

	    // 将弧度转换为角度
	    let degree = (angle * 180) / Math.PI;

	    // 判断是否在扇形内
	    if (distance >= rIn && distance <= rOut) {
	    	if (degree > 0.5 * 45 && degree <= 1.5 * 45) {
	    		return 1;
	    	} else if (degree > 1.5 * 45 && degree <= 2.5 * 45) {
	    		return 2;
	    	} else if (degree > 2.5 * 45 && degree <= 3.5 * 45) {
	    		return 3;
	    	} else if (degree > 3.5 * 45 && degree <= 4.5 * 45) {
	    		return 4;
	    	} else if (degree > 4.5 * 45 && degree <= 5.5 * 45) {
	    		return 5;
	    	} else if (degree > 5.5 * 45 && degree <= 6.5 * 45) {
	    		return 6;
	    	} else if (degree > 6.5 * 45 && degree <= 7.5 * 45) {
	    		return 7;
	    	} else if ((degree > 7.5 * 45 && degree < 360) || (degree > 0 && degree <= 0.5 * 45)) {
	    		return 8;
	    	}
	    	return degree;
	    } else if (distance > rOut) {
			// console.log('out')
			// this.isDragging = false;
		}

	    return -1;
	}

	draw(x, y, button, dragging) {
		const ctx = this.ctx;
		const w = this.w;
		const h = this.h;
		ctx.clearRect(0, 0, w, h);
		ctx.strokeStyle = '#777777';
	    ctx.lineWidth = 2;
	    ctx.beginPath();
	    ctx.arc(w / 2, h / 2, w / 2 - 5, 0, 2 * Math.PI);
	    ctx.stroke();
	    // ctx.beginPath();
	    // ctx.arc(w / 2, h / 2, this.rIn, 0, 2 * Math.PI);
	    // ctx.stroke();

	   	const r = this.rIn;
	   	const x0 = w / 2;
	   	const y0 = h / 2;
	   	let d = this.getDistance(x0, y0, x, y);
	   	const rd = w / 2 - 10 - r;
	   	if (d > rd) {
            let ratio = rd / d;
            // x = x0 + (x - x0) * ratio;
            // y = y0 + (y - y0) * ratio;
            x = x0;
            y = y0;
        }
	    
	    if (d > this.rIn && dragging && button > 0) {
	    	// ctx.lineWidth = 2;
	    	// ctx.arc(x, y, this.rIn, 0, 2 * Math.PI);
	    	// ctx.fillStyle = 'lightgray';
			// ctx.fill();

			let startArc = button * Math.PI / 4 - Math.PI / 8;
			let endArc = startArc + Math.PI / 4;

			let xInStartArc = x0 + this.rIn * Math.cos(startArc);
			let yInStartArc = y0 + this.rIn * Math.sin(startArc);
			let xOutStartArc = x0 + (this.rOut - 5) * Math.cos(startArc);
			let yOutStartArc = y0 + (this.rOut - 5) * Math.sin(startArc);

			let xInEndArc = x0 + this.rIn * Math.cos(endArc);
			let yInEndArc = y0 + this.rIn * Math.sin(endArc);
			let xOutEndArc = x0 + (this.rOut - 5) * Math.cos(endArc);
			let yOutEndArc = y0 + (this.rOut - 5) * Math.sin(endArc);

			ctx.beginPath();
			ctx.arc(x0, y0, this.rIn, startArc, endArc);
			ctx.arc(x0, y0, this.rOut - 5, endArc, startArc, true);
			// ctx.stroke();
			// ctx.beginPath();
			// ctx.moveTo(xInEndArc, yInEndArc);
			// ctx.lineTo(xOutEndArc, yOutEndArc);
			// ctx.stroke();
			// ctx.beginPath();

			// ctx.stroke();
			// ctx.beginPath();
			ctx.lineTo(xOutStartArc, yOutStartArc);
			ctx.lineTo(xInStartArc, yInStartArc);
			ctx.closePath();
			ctx.fillStyle = 'gray';
			ctx.fill();

			let arrowR = this.rIn + (this.rOut - this.rIn - 10) / 2;
			let arrowArc = startArc + (endArc - startArc) / 2;
			let arrowX = x0 + arrowR * Math.cos(arrowArc);
			let arrowY = y0 + arrowR * Math.sin(arrowArc);
			// ctx.beginPath();
			// ctx.arc(arrowX, arrowY, 10, 0, 2 * Math.PI);
			// ctx.lineWidth = 1;
			// ctx.strokeStyle = "black";
			// ctx.stroke();
			ctx.save();
			ctx.translate(arrowX, arrowY);
			ctx.rotate(arrowArc + Math.PI / 2);
			ctx.drawImage(this.arrowImg, - 17.5, - 17.5, 35, 35);
			ctx.restore();
	    } else {
	    	ctx.beginPath();
	    	ctx.lineWidth = 1;
	    	ctx.arc(x, y, this.rIn, 0, 2 * Math.PI);
			if (dragging) {
				ctx.fillStyle = "gray";
				ctx.fill();
			}

			ctx.stroke();
	    	// ctx.fillStyle = 'lightgray';
			// ctx.fill();
	    }

	    
	}
}

class SpeedControllerRender {
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
	            console.log('touchstart');
	             event.preventDefault();
	             render.isDragging = true;
	             let touch = event.touches[0];
	             render.currentX = touch.clientX;
	             render.curretnY = touch.clientY - 70;
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
	    	let touch = event.touches[0];
            render.currentX = touch.clientX;
            render.currentY = touch.clientY - 70;
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