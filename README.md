# 王宝瑞 AIGC 影像作品集

部署于 GitHub Pages 的静态电影作品集网站，展示 6 部 Bilibili 视频作品，并整合个人简介、创作能力、工作经历和联系方式。

## 内容结构

- 开场：创作者定位与精选作品
- 片单：6 部作品海报、简介和 Bilibili 嵌入播放器
- 创作流程：AIGC 影像制作能力清单
- 履历：个人简介与三段工作经历
- 联系：电话与 Bilibili 主页

## 修改内容

主要内容集中在 `assets/site-config.js`：

- `profile`：姓名、简介、经历、技能和联系方式
- `works`：作品标题、类型、职责、简介、封面、BV 号和时长

播放器地址由 `assets/bilibili-player.js` 根据 BV 号生成。作品封面位于 `assets/images/`。

## 本地检查

```bash
node --test tests/portfolio.test.mjs
```

使用本地静态文件服务器打开项目根目录即可预览完整网站。GitHub Pages 从 `main` 分支根目录发布。
