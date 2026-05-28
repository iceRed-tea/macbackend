const OPEN_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';
const CLOSE_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const OPEN_DURATION = 480;
const CLOSE_DURATION = 420;
/** 开/关动画全程保持圆角，与桌面图标一致 */
export const WINDOW_RADIUS = 15;
const MIN_SCALE = 0.001;
const MAX_VISUAL_RADIUS_RATIO = 0.18;

function originToRect(origin) {
    const w = origin.width ?? 56;
    const h = origin.height ?? 56;
    return {
        left: origin.x - w / 2,
        top: origin.y - h / 2,
        width: w,
        height: h,
        borderRadius: origin.borderRadius ?? WINDOW_RADIUS,
    };
}

function toPx(value) {
    return `${Number(value.toFixed(3))}px`;
}

function getCompensatedRadius(dom, radius, scaleX = 1, scaleY = scaleX) {
    const sx = Math.max(Math.abs(scaleX), MIN_SCALE);
    const sy = Math.max(Math.abs(scaleY), MIN_SCALE);
    const visualWidth = dom.offsetWidth * sx;
    const visualHeight = dom.offsetHeight * sy;
    const visualRadius = Math.min(
        radius,
        visualWidth * MAX_VISUAL_RADIUS_RATIO,
        visualHeight * MAX_VISUAL_RADIUS_RATIO
    );
    const rx = toPx(visualRadius / sx);
    const ry = toPx(visualRadius / sy);

    return {
        outer: `${rx} / ${ry}`,
        clip: `inset(0 round ${rx} / ${ry})`,
        header: `${rx} ${rx} 0 0 / ${ry} ${ry} 0 0`,
        body: `0 0 ${rx} ${rx} / 0 0 ${ry} ${ry}`,
    };
}

function applyAnimClip(dom, radius = WINDOW_RADIUS, scaleX = 1, scaleY = scaleX) {
    const r = getCompensatedRadius(dom, radius, scaleX, scaleY);
    dom.style.setProperty('overflow', 'hidden', 'important');
    dom.style.setProperty('border-radius', r.outer, 'important');
    dom.style.setProperty('clip-path', r.clip);

    const header = dom.querySelector('.wb-header');
    const body = dom.querySelector('.wb-body');
    if (header) {
        header.style.setProperty('border-radius', r.header, 'important');
        header.style.setProperty('overflow', 'hidden');
    }
    if (body) {
        body.style.setProperty('border-radius', r.body, 'important');
        body.style.setProperty('overflow', 'hidden');
    }
}

function applyTransformBetween(dom, fromRect, toRect) {
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    const tx = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2);
    const ty = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2);

    dom.style.transformOrigin = 'center center';
    dom.style.transform = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`;

    return { scaleX, scaleY };
}

function cleanupTransform(dom) {
    dom.style.transition = '';
    dom.style.transform = '';
    dom.style.transformOrigin = '';
    dom.style.opacity = '';
    dom.style.removeProperty('overflow');
    dom.style.removeProperty('border-radius');
    dom.style.removeProperty('clip-path');
    dom.classList.remove('winbox-ios-anim', 'winbox-ios-opening', 'winbox-ios-closing');

    dom.querySelectorAll('.wb-header, .wb-body').forEach(el => {
        el.style.removeProperty('border-radius');
        el.style.removeProperty('overflow');
    });
}

function waitTransition(dom, prop = 'transform') {
    return new Promise(resolve => {
        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            dom.removeEventListener('transitionend', onEnd);
            resolve();
        };
        const onEnd = e => {
            if (e.target === dom && e.propertyName === prop) finish();
        };
        dom.addEventListener('transitionend', onEnd);
        setTimeout(finish, OPEN_DURATION + 120);
    });
}

/** @param {HTMLElement} dom */
export function playWindowOpen(dom, origin) {
    if (!dom || !origin) return Promise.resolve();

    const fromRect = originToRect(origin);
    const toRect = dom.getBoundingClientRect();
    const radius = fromRect.borderRadius ?? WINDOW_RADIUS;

    dom.classList.add('winbox-ios-anim', 'winbox-ios-opening');

    // 初始状态：应用图标尺寸的圆角裁剪与位移缩放
    dom.style.transition = 'none';
    dom.style.opacity = '0.92';
    const startScale = applyTransformBetween(dom, fromRect, toRect);
    applyAnimClip(dom, radius, startScale.scaleX, startScale.scaleY);

    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(async () => {
                // 圆角需要同步过渡，否则缩放时视觉圆角会被压扁。
                dom.style.transition = `transform ${OPEN_DURATION}ms ${OPEN_EASING}, border-radius ${OPEN_DURATION}ms ${OPEN_EASING}, clip-path ${OPEN_DURATION}ms ${OPEN_EASING}, opacity ${
                    OPEN_DURATION * 0.7
                }ms ease`;

                dom.style.transform = 'none';
                dom.style.opacity = '1';
                applyAnimClip(dom, radius);

                await waitTransition(dom);
                cleanupTransform(dom);
                resolve();
            });
        });
    });
}

/** @param {HTMLElement} dom */
export function playWindowClose(dom, origin) {
    if (!dom || !origin) return Promise.resolve();

    const fromRect = dom.getBoundingClientRect();
    const toRect = originToRect(origin);
    const radius = toRect.borderRadius ?? WINDOW_RADIUS;

    dom.classList.add('winbox-ios-anim', 'winbox-ios-closing');

    // 初始状态：确立窗口正常展开时的圆角裁剪，无 transform 干扰
    applyAnimClip(dom, radius);
    dom.style.transition = 'none';
    dom.style.opacity = '1';
    dom.style.transform = 'none';

    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(async () => {
                // 向图标尺寸坍缩
                dom.style.transition = `transform ${CLOSE_DURATION}ms ${CLOSE_EASING}, border-radius ${CLOSE_DURATION}ms ${CLOSE_EASING}, clip-path ${CLOSE_DURATION}ms ${CLOSE_EASING}, opacity ${
                    CLOSE_DURATION * 0.65
                }ms ease`;

                const endScale = applyTransformBetween(dom, toRect, fromRect);
                dom.style.opacity = '0.6';
                applyAnimClip(dom, radius, endScale.scaleX, endScale.scaleY);

                await waitTransition(dom);
                cleanupTransform(dom);
                resolve();
            });
        });
    });
}

/** @param {string} appName */
export function getDockOrigin(appName) {
    const base = { borderRadius: WINDOW_RADIUS };

    if (appName) {
        const el = document.querySelector(`.dock-item[data-app-name="${CSS.escape(appName)}"]`);
        if (el) {
            const r = el.getBoundingClientRect();
            return {
                ...base,
                x: r.left + r.width / 2,
                y: r.top + r.height / 2,
                width: r.width,
                height: r.height,
            };
        }
    }

    const dock = document.querySelector('.dock');
    if (dock) {
        const r = dock.getBoundingClientRect();
        return {
            ...base,
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            width: 52,
            height: 52,
        };
    }

    return {
        ...base,
        x: window.innerWidth / 2,
        y: window.innerHeight - 96,
        width: 52,
        height: 52,
    };
}
