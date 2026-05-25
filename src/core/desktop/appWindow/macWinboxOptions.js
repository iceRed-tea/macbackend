/** macOS 风格 WinBox 模板：交通灯在左侧，标题居中 */
function createMacTemplate() {
    const root = document.createElement('div');
    root.innerHTML = `
        <div class="wb-header">
            <div class="wb-control">
                <div class="wb-close row items-center justify-center bg-red-12" title="关闭">
                    <svg t="1779499607568" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7816" width="200" height="200"><path d="M755.2 755.2c-16.8 16.8-44 16.8-60.8 0L268.8 329.6c-16.8-16.8-16.8-44 0-60.8 16.8-16.8 44-16.8 60.8 0l425.7 425.7c16.7 16.7 16.7 44-0.1 60.7z" p-id="7817"></path><path d="M755.2 268.8c16.8 16.8 16.8 44 0 60.8L329.6 755.2c-16.8 16.8-44 16.8-60.8 0-16.8-16.8-16.8-44 0-60.8l425.7-425.7c16.7-16.7 44-16.7 60.7 0.1z" p-id="7818"></path></svg>
                </div>
                <div class="wb-min row items-center justify-center bg-amber" title="最小化">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="transparent" stroke="rgba(48, 48, 48, 1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"></path></svg>
                </div>
                <div class="wb-max row items-center justify-center bg-light-green" title="最大化">
                    <svg t="1779416449313" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2648" width="200" height="200"><path d="M383.684923 279.867077L738.067692 637.873231V279.867077H383.684923z m246.862769 454.419692L276.164923 376.280615v358.006154h354.382769z" p-id="2649"></path></svg>
                </div>
            </div>
            <div class="wb-drag">
                <div class="wb-icon"></div>
                <div class="wb-title"></div>
            </div>
        </div>
        <div class="wb-body"></div>
        <div class="wb-n"></div>
        <div class="wb-s"></div>
        <div class="wb-w"></div>
        <div class="wb-e"></div>
        <div class="wb-nw"></div>
        <div class="wb-ne"></div>
        <div class="wb-se"></div>
        <div class="wb-sw"></div>
    `;
    return root;
}

function mergeClass(...values) {
    const list = values.flatMap(v => {
        if (!v) return [];
        return Array.isArray(v) ? v : String(v).split(/\s+/);
    });
    return [...new Set(list.filter(Boolean))];
}

/** 合并 macOS 窗口样式与用户 options，仅负责 header / 缩放区域外观 */
export function buildMacWinboxOptions(win) {
    const user = win.options || {};
    return {
        ...user,
        id: user.id ?? `app-win-${win.id}`,
        appName: win.appName,
        launchOrigin: win.launchOrigin,
        icon: user.icon ?? win.icon,
        class: mergeClass('macos', 'no-full', user.class),
        template: user.template ?? createMacTemplate(),
        background: user.background ?? 'transparent',
        overflow: true,
        minwidth: 320,
        minheight: 240,
    };
}
