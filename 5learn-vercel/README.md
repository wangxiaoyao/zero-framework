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
