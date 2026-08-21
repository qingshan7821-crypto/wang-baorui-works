# 王宝瑞作品视频网站

一套可直接发布到 GitHub Pages 的静态影视作品集模板。页面采用黑色电影感设计，包含首页精选作品、15 个视频作品、作品详情弹窗、关于我和联系入口。

## 最快替换方法

网站内容都集中在 `assets/site-config.js`：

1. 修改 `profile` 中的姓名、简介、联系方式和简历路径。
2. 修改 `works` 数组中的作品标题、类别、职责和简介。
3. 把封面放到 `assets/images/`，把视频放到 `assets/videos/`。
4. 保持配置里的文件名与实际文件名一致。

模板已预留以下示例位置：

- `assets/images/work-01.jpg` 至 `work-15.jpg`：作品封面，建议使用 16:10 或 16:9 横图。
- `assets/videos/work-01.mp4` 至 `work-15.mp4`：作品视频，推荐 H.264 编码的 MP4。
- `assets/images/portrait.jpg`：个人照片，建议使用 4:5 竖图。
- `assets/resume.pdf`：个人简历。

如果需要增加作品，复制 `site-config.js` 中任意一项并修改 `id`、文字和文件路径即可。`featured: true` 的第一项会显示在首页精选位置。

## 发布到 GitHub Pages

1. 新建一个 GitHub 仓库，把本文件夹内的全部内容上传到仓库根目录。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. 选择 `main` 分支和 `/ (root)`，保存后等待 GitHub 生成网站地址。

所有资源均使用相对路径，因此仓库名作为网址子目录时也能正常使用。

## 视频文件建议

GitHub 对单个文件和仓库大小有限制。体积较小的作品可直接放在 `assets/videos/`；较大的视频建议使用视频平台的嵌入播放器，或存放在对象存储/CDN 后把视频地址写入配置文件。

## 本地预览

直接双击 `index.html` 即可查看大部分效果。为避免浏览器限制本地视频加载，正式检查时建议使用任意本地静态文件服务器打开本文件夹。

