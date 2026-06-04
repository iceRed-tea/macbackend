import { inject } from 'vue';

/**
 * 在窗口内的任意子组件中调用，获取页面栈导航能力。
 *
 * navigate(loader, data?, title?) — 推入新页面（底层页面保持挂载）
 *   loader 可以是路径字符串、路由 name、懒加载函数或组件对象
 *
 * goBack() — 关闭当前页并返回（仅此时销毁当前页）
 * goForward() — 前进到曾返回过的页面
 * reload() — 刷新当前页
 *
 * canGoBack / canGoForward — 是否可后退 / 前进
 */
export function useAppWin() {
    const nav = inject('windowNav', null);
    if (!nav) {
        console.warn('[useAppWin] 必须在 AppWindow 内部使用');
        return {
            navigate: () => {},
            goBack: () => {},
            goForward: () => {},
            reload: () => {},
            canGoBack: { value: false },
            canGoForward: { value: false },
        };
    }
    return nav;
}
