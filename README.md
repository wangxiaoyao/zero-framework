# Zero-web

各类前端项目demo：从零搭建并运行的前端代码。每一个独立文件夹即独立的项目。

##  一 SSR-Echarts

##### 1 SSR与CSR

- 工作流的不同
- SEO优化
- 开屏速度
- 服务器负载
- SSR缓存和持久化
- SSR的状态管理与数据预取
- 静态资源的处理以及路径问题
- Next：增量静态生成 ISR（Incremental Static Regeneration） = SSR + 静态生成 static generation，优势。 （use client与SSR冲突的解决）
- 什么是静态网站和动态网站

##### 2 使用SSR对Echarts的优化：

- 方案1:转图片
- 方案2:架构 + 动态数据



## 二 数据分块上传(upload-chunk)

1 技术栈

- 前端：HTML, JavaScript (原生或配合框架如 React)
- 后端：Node.js (可以使用 Express 框架)
- 通信协议：HTTP



##  三 webpack

1 什么是Webpack 以及工作原理(Dependency Graph生成)

2 Webpack基础配置以及分析bundle.js

3 webpack配置： 加载器处理非JavaScript文件，插件用于扩展Webpack功能。

```json
# 一编译与打包

## 1 mode不同选项的区别
依据环境进行动态调整

## 2 JS处理 =》基础配置

## 3 public静态文件处理：
- HtmlWebpackPlugin：index.html 
- CopyWebpackPlugin：favicon.ico,robots.txt,...

## 4 css处理（执行循序右到左，分开写保证性能）
- css-loader工作原理： CSS模块化
- style-loader工作原理
- postcss-loader (postcss.config.js)： cssnano，postcss-preset-env（autoprefixer）
- .scss文件：sass，sass-loader

## 5 babel：三者的工作原理
- @babel/core 
- @babel/preset-env ： 理解core-js提供的Polyfill
- babel-loader

## 6 ts处理
- typescript 
- ts-loader 

@babel/preset-typescript

## 7 react
@babel/preset-react


# 二开发与优化

1 http服务（plugins）
- webpack-dev-server： Hot Module Replacement（HMR），自动刷新。 
- 工作原理：为什么可以在不写入到dist文件，能够自动刷新页面。
- file协议和http协议。本地文件加载 ES6 模块时遇到的 CORS 错误

注意：不要显式调用：HotModuleReplacementPlugin 会出现冲突。 static 不需要配置监听src和dist，会默认从entry调用。


2 Source Maps
- 选择mode
- 配置devtool： bundle.js.map文件


3 按需加载
- 代码分割（Code Splitting）：动态导入（Dynamic Imports），分割点（Split Points），懒加载（Lazy Loading）
- output.chunkFilename


# 三 测试
## 配置Jest



# 四部署

```



思考问题：

1 为什么需要把type="module" 放入script声明。

2 加载器：理解加载器以及加载器的作用和配置。理解：浏览器版本browserslist: package.json。 （npx browserslist）

3  babel配置过程中的presets 和 plugins

4  配置%PUBLIC_URL%

5 import style from './style' 问题

- 方法1:修改webpack配置
- 方法2:命名法： .module.css.  既可以实现css的模块化

6 autoprefixer 问题 => 使用代替。 前缀问题

7 配置本地的环境.env。 依据这个进行区分 production

8 多页面应用（MPA）

9 如何自己实现Webpack打包工具

## 四 learn-react

关于react的学习



## 五 learn-vercel

vercel：分离架构服务网站

- 静态资源：static（js/css）,img,icon等放入vercel CND（全球内容分布网络）。

- API函数： 部署在Serverless env（云计算模型）。处理动态逻辑。无服务器实例，按需加载。（由vercel商家扩展，监控，资源分配）



### 1 项目划分：

- next.js 全栈架构
- 前端框架（React.js/vue.js） + express 前后端分离架构，前端框架需要打包。
- 无框架 + express  前后端分离架构。静态资源无需打包。

全栈框架无需配置。 以下针对前后端分离项目：如何放在同一个项目，并部署在vercel。



#### 1.1  项目整体架构

```apl
## react框架 + express
├── api
│   ├── index.js
│   ├── node_modules
│   ├── package-lock.json
│   └── package.json
├── client
│   ├── README.md
│   ├── build
│   ├── config
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── scripts
│   └── src
├── node_modules
├── package-lock.json
├── package.json
└── vercel.json

## 无框架 + express
├── api
│   └── index.js
├── client
│   └── index.html
├── node_modules
├── package-lock.json
├── package.json
└── vercel.json
```

总之： 

- 静态/框架，放在/client文件夹。

- API层资源，放在/api文件夹: 修改API：api/index.js，最后补上导出应用实例：否则500。 ```module.exports = app;```



### 2 项目配置vercel.json

```
## react框架
{
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/client/$1"
    }
  ]
}

## 无框架
{
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
     {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/public/$1"
    }
  ],
  "cleanUrls": true
}
```

总之：

1 静态资源的处理：通过：@vercel/static构建插件处理对应的路径的资源。必须包含index.html。

 对于react框架，需要通过@vercel/static-build构建插件处理：这个插件表示运行框架的package.json中的 ```npm run build``` 用来构建。然后将输出的内容作为静态资源部署CND。但是一定要注意配置：config-distDir: 用来指定构建的目录是哪一个。react默认输出到build文件夹。否则vercel 无法拿到构建的资源。从而出现白屏（无static：js，css文件）。

路由访问：对应的资源

2 API处理：通过@vercel/node 用于部署 **Serverless 函数**,每个函数文件会被打包为一个单独的 API 端点。需要有export 导出。

路由访问：但凡以api开头的请求均转移到API处理。



> fuck！rewrites 有先后顺序问题！必须先去匹配："source": "/api/(.*)"。 不然接口出现404. 所以vercel.json文件中必须把匹配api位置放在配置的上面。




```
路径小知识：/的绝对路径 和 没有/的相对路径
1 在 builds 中，路径指向项目中的文件，相对路径，这里用 "api/index.js" 来指定。而使用/ 开头表示绝对路径。** 表示目录以及所有子目录都处理
2 在 rewrites 中，路径匹配的是客户端访问的 URL，必须使用 / 开头，例如 "/api/(.*)"，这样可以正确地处理客户端对 /api/... 请求的重写。 (.*)表示路径的匹配
```



### 3 vercel CLI部署

```
## 删除.vercel(如果有)
vercel login
vercel
```
