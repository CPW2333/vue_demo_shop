## 项目笔记
### 项目概述
#### 电商后台管理系统的技术选型
1. 前端项目技术栈
- Vue
- Vue-router
- Element-UI：前端UI组件库
- Axios 
- Echarts：获取图形报表
2. 后端项目技术栈
- Node.js
- Express
- Jwt：状态保持工具 模拟类似于session的登录记录功能
- Mysql
- Sequelize：操控数据库的框架
### 项目初始化 
#### 前端项目初始化步骤
- ① 安装 Vue 脚手架
- ② 通过 Vue 脚手架创建项目
    必选：`Babel、Router、Linter/Formatter、使用配置文件`
- ③ 配置 Vue 路由
    选用`hash`模式路由、`ESLint+Standard config `
- ④ 配置 Element-UI 组件库
    插件搜索`vue-cli-plugin-element-ui`安装
    选用`import on demand`
- ⑤ 配置 axios 库
    运行依赖搜索`axios`
- ⑥ 初始化 git 远程仓库
- ⑦ 将本地项目托管到 Github 或 码云 中
    `git remote add 远程仓库地址别名(origin) 远程仓库地址`
    `git push -u 远程仓库地址别名(origin) 分支名称(master)`
    下次推送: `git push`
#### 后台项目的环境安装配置
- ① 安装 MySQL 数据库
    版本`5.0+`
    `phpstudy`需要老版本
    `mydb.sql`导入`mysql`
- ② 安装 Node.js 环境
- ③ 配置项目相关信息
    `npm install`
- ④ 启动项目
    `node app.js`
- ⑤ 使用 Postman 测试后台项目接口是否正常

### 各模块合并的git操作

    git merge login
    git status
    git add .
    git commit -m tw提交合并的login模块
    git push