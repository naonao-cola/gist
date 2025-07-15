import DefaultTheme from 'vitepress/theme';
import 'viewerjs/dist/viewer.min.css';
import imageViewer from 'vitepress-plugin-image-viewer';
import vImageViewer from 'vitepress-plugin-image-viewer/lib/vImageViewer.vue';
import { useRoute } from 'vitepress';
//引入样式文件
import './style.css';
//图片居中对齐
import './custom.css'
export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx);
        // 注册全局组件（可选）
        ctx.app.component('vImageViewer', vImageViewer);
    },
    setup() {
        const route = useRoute();
        // 启用插件
        imageViewer(route);
    }
};