
我的更新
====
1. 修改数据库保存分类列表方法，字段不对应；
2. 修改界面，引入zui简单布局；
3. 扩展主页，增加导航分类；
4. 文章图片显示，修复原图片不显示的问题，增加图片处理路由，从网络上抓取图片存到本地资源文件下resouce/img文件下；
5. 由于文章涉及图片往往较多，引入photoSwipe.js处理图片浏览问题；
6. 图片信息过大，为缓解网络存取效率不稳定的问题，增加数据表img_list存储图片和本地存储地址的映射信息；
7. 修改html文件解析逻辑，能够多解析一种博客页面；
8. 增加应用处理逻辑，开启服务清空已有数据，重新获取；


问题
====

* 目前只能针对两种博客文档抓取；
* 数据库连接感觉只开不关，不大懂所以没处理；
* 图片浏览有时候个别图片会显示不出来；
* 首次页面加载图片不显示；


      创建时间：2016/7/8
