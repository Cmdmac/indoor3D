
const DIRECTION = 100;
const POSITION = 101;

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

        const socket = new WebSocket('ws://192.168.2.153:3000/web');                
        socket.addEventListener('open', (event) => {
          console.log('连接已打开');
        });

        socket.addEventListener('message', (event) => {
            // console.log(`收到消息: ${event.data}`);
            let o = JSON.parse(event.data);
            switch(o.code) {
            case DIRECTION:
                const direction = o.data;
                let ang = 360 - (direction + 90);
                console.log("ang=" + ang);
                map.updateDirection(ang);
                map.refresh();
                break;
            case POSITION:
                const location = o.data;            
                map.updateCurrentLocation(location);
                map.refresh();
                break;
            }
        });
        window.socket = socket;

        // const socket2 = new WebSocket('ws://192.168.2.153:3000/mobile/hub?client=esp32s3');                
        // socket2.addEventListener('open', (event) => {
        //   console.log('连接到mobile/hub已成功');
        // });

        // socket2.addEventListener('message', (event) => {
        //     console.log(`收到消息: ${event.data}`);
            
        // });
        // socket2.addEventListener('close', (event) => {
        //     console.log('连接1已关闭');
        // });
        // window.socket = socket;

    });
        // init tabs
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // 移除所有 tab 和内容的激活状态
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // 设置点击的 tab 和对应的内容为激活状态
            const targetTab = tab.dataset.tab;
            document.getElementById(targetTab).classList.add('active');
            tab.classList.add('active');
            });

            if (tab.isInit === undefined) {
                initController();
                drawLeftController();
                drawRightControler();
                tab.isInit = true;
            }

    });

    document.addEventListener('wheel', function (event) {
            event.preventDefault();
        }, { passive: false });

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

directionControllerRender = undefined;
speedControllerRender = undefined;
function initController() {
    const directionCanvas = document.getElementById('car-controller-direction');
    const speedCanvas = document.getElementById('car-controller-right');
    directionControllerRender = new DirectionControllerRender(directionCanvas);
    directionControllerRender.addButtonListener(function(button) {
        if (this.lastState === button) {
            return;
        }
        this.lastState = button;
        
        console.log(button);
        let cmd = {command: -1};
        switch(button) {
        case 2:
            cmd.command = 2;
            window.socket.send(JSON.stringify(cmd));
            break;
        case 6:
            cmd.command = 1;
            window.socket.send(JSON.stringify(cmd));
            break;
        case 8:
            cmd.command = 4;
            window.socket.send(JSON.stringify(cmd));
            break;
        case 4:
            cmd.command = 3;
            window.socket.send(JSON.stringify(cmd));
            break;
        }

    });
    speedControllerRender = new SpeedControllerRender(speedCanvas);
    speedControllerRender.addButtonListener(function(button) {
        
        if (Math.abs(this.lastState - button) < 0.1) {
            return;
        }
        console.log(button);
        this.lastState = button;
        window.socket.send(JSON.stringify({command: 101, data: button}));
    });
}

function drawLeftController() {
    const canvas = document.getElementById('car-controller-direction');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    if (directionControllerRender != undefined) {
        directionControllerRender.draw(w / 2, h / 2, false);
    }
}

function drawRightControler() {

    const canvas = document.getElementById('car-controller-right');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    if (speedControllerRender != undefined) {
        speedControllerRender.draw(w / 2, h / 2, false);
    }
    
}