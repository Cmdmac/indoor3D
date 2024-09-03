function onBodyLoad() {
        var params = {
            mapDiv:"mapDiv",
            dim:"2d",
            // size: [window.innerWidth,window.innerHeight-200]
        }
        var map = IndoorMap(params);
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

        function increaseFrameSize() {
            console.log('increaseFrameSize');
            window.socket.send(JSON.stringify({command: 0}));
        }

        function decreaseFrameSize() {
            console.log('decreaseFrameSize');
            window.socket.send(JSON.stringify({command: 1}));
        }

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
    }