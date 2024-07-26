const express = require('express');
const path = require('path');

// 创建 Express 应用
const app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '')));

// 定义路由，当访问根路径时，返回指定的静态网页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

// 启动服务器，监听 3000 端口
app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});