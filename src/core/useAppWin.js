import { inject, onBeforeUnmount } from 'vue';

const noop = () => {};
const noopUnsub = () => noop;

function bindEvent(nav, method) {
    return callback => {
        if (typeof callback !== 'function') return noopUnsub;
        return nav?.[method]?.(callback) ?? noopUnsub;
    };
}

function createFallback() {
    console.warn('[useAppWin] 必须在 AppWindow 内部使用');
    return {
        navigate: noop,
        goBack: noop,
        goForward: noop,
        reload: noop,
        created: noopUnsub,
        focus: noopUnsub,
        blur: noopUnsub,
        minimize: noopUnsub,
        restore: noopUnsub,
        close: noopUnsub,
        move: noopUnsub,
        resize: noopUnsub,
        instance: { value: null },
        canGoBack: { value: false },
        canGoForward: { value: false },
    };
}

/**
 * 在窗口内的任意子组件中调用，获取页面栈导航与 WinBox 事件能力。
 *
 * navigate(loader, data?, title?) — 推入新页面
 * goBack() / goForward() / reload() — 页面栈操作
 * created / focus / blur / minimize / restore / close / move / resize — 监听 WinBox 事件
 * instance — WinBox 实例（Ref，创建后为 readonly）
 */
export function useAppWin() {
    const nav = inject('useAppWin', null);
    if (!nav) return createFallback();

    return {
        navigate: nav.navigate,
        goBack: nav.goBack,
        goForward: nav.goForward,
        reload: nav.reload,
        canGoBack: nav.canGoBack,
        canGoForward: nav.canGoForward,
        instance: nav.instance,
        created: bindEvent(nav, 'created'),
        focus: bindEvent(nav, 'focus'),
        blur: bindEvent(nav, 'blur'),
        minimize: bindEvent(nav, 'minimize'),
        restore: bindEvent(nav, 'restore'),
        close: bindEvent(nav, 'close'),
        move: bindEvent(nav, 'move'),
        resize: bindEvent(nav, 'resize'),
    };
}

/** 监听 WinBox 创建，组件卸载时自动取消 */
export function useAppWinCreated(callback) {
    const { created } = useAppWin();
    const off = created(callback);
    onBeforeUnmount(off);
}
