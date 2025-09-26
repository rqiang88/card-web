#!/bin/bash

echo "🚀 启动会员管理系统前端项目..."

# 检查 Node.js 版本
echo "📋 检查环境..."
node --version
yarn --version

# 安装依赖
echo "📦 安装依赖..."
yarn install

# 启动开发服务器
echo "🌟 启动开发服务器..."
yarn dev
