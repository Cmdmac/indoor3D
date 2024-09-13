
var map = undefined;
function onBodyLoad() {
    var params = {
        mapDiv:"mapDiv",
        dim:"2d",
    // size: [window.innerWidth,window.innerHeight-200]
    }
        
    map = IndoorMap(params);
    map.load('data/indoorMap.json', function(){
        //map.setTheme(testTheme);
        map.showAreaNames(true).setSelectable(true);
        let floorList = document.getElementById("floor");
        var ul = IndoorMap.getUI(map);
        // document.body.appendChild(ul);
        floorList.appendChild(ul);

        const socket = new WebSocket('ws://localhost:3000/web');                
        socket.addEventListener('open', (event) => {
          console.log('连接已打开');
        });

        socket.addEventListener('message', (event) => {
            console.log(`收到消息: ${event.data}`);
            const location = JSON.parse(event.data).data;            
            map.updateCurrentLocation(location, 50);
            map.refresh();
        });
        window.socket = socket;

        map.updateCurrentLocation([100, 100], 80);
    });
        // init tabs
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
        // 移除所有 tab 和内容的激活状态
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // 设置点击的 tab 和对应的内容为激活状态
        const targetTab = tab.dataset.tab;
        document.getElementById(targetTab).classList.add('active');
        tab.classList.add('active');
        });
    });

    drawLeftController();
    drawRightControler();


}

function zoomIn() {
    map.zoomIn(1.2);
}

function zoomOut() {
    map.zoomOut(0.8);
}

function setDefaultView() {
    map.setDefaultView();
}

function increaseFrameSize() {
    console.log('increaseFrameSize');
    window.socket.send(JSON.stringify({command: 0}));
}

function decreaseFrameSize() {
    console.log('decreaseFrameSize');
    window.socket.send(JSON.stringify({command: 1}));
}

function onRequestStream() {
    let img = document.getElementById('stream');
    let play = document.getElementById('play');
    let stream_loading_state = document.getElementById('stream_loading_state');
    let state = stream_loading_state.loadingState;
    if (state == undefined) {
        play.style.display = 'none';
        img.style.display = 'block';
        stream_loading_state.style.display = 'block';
        img.src = "http://192.168.2.50:81/stream";
        img.onload = function() {
            stream_loading_state.style.display = 'none';
        }
        img.onerror = function() {
            // this.src = 'img/play.png';
            img.style.display = 'none';
            stream_loading_state.innerText = "load failure, click to retry";
            stream_loading_state.loadingState = 'failure';
            stream_loading_state.style.display = 'block';
        }
    } else if (state == 'failure') {
        // retry
        img.src = "";
        img.src = "http://192.168.2.50:81/stream";
        stream_loading_state.innerText = "loading...";
        stream_loading_state.loadingState = "loading";
    }
        
    
    
}

function onClickAdjustPosition() {
    let div = document.getElementById('control-panel');
    if (div.style.display == 'none') {
        div.style.display = 'flex';
    } else {
        div.style.display = 'none';
    }
}

var voiceState = false;
function onClickVoiceSwitch() {
    if (voiceState == true) {
        document.getElementById('voiceSwitch').src = "img/voice-off.png";
        voiceState = false;
    } else {
        document.getElementById('voiceSwitch').src = "img/voice-on.png";
        voiceState = true;
    }
}

function drawLeftController() {
    const canvas = document.getElementById('car-controller-direction');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(w / 2, h / 2, 30, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawRightControler() {

    const imgWidth = document.getElementById('circle').style.width;
    const imgHeight = document.getElementById('circle').style.height;
    let image = null;
    let loader = new THREE.ImageLoader();
    loader.load("../img/circle.png", function(img){
        // console.log("load image")
        image = img;
          // 获取设备像素比
        var dpr = window.devicePixelRatio || 1;
        const canvas2 = document.getElementById('car-controller-right');
        const w = canvas2.width;
        const h = canvas2.height;
        const imageWidth = 25 * dpr;
        const imageHeight = 25 * dpr;
        const ctx2 = canvas2.getContext('2d');

        const r = 40;
        ctx2.beginPath();
        ctx2.arc(w/2, r + 1, r, -Math.PI, 0);
        ctx2.strokeStyle = 'gray';
        ctx2.lineWidth = 2;
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(w/2 - r, r + 2);
        ctx2.lineTo(w/2 - r, r * 5);
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.arc(w/2, r * 5 - 1, r, 0, Math.PI);
        ctx2.moveTo(w/2 + r, r * 5);
        ctx2.lineTo(w/2 + r, r);
        ctx2.stroke();

        ctx2.drawImage(img, w / 2 - 20, h / 2 - 20, 40, 40);

    })
    
}