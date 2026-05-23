<script setup>
import WinBox from 'winbox';
import 'winbox/dist/css/winbox.min.css';
import { getDockOrigin, playWindowClose, playWindowOpen } from '../utils/windowAnimation';

const props = defineProps({
    options: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['move', 'resize', 'close', 'focus', 'blur']);

const instance = shallowRef(null);
const ready = ref(false);
const isClosing = ref(false);

const teleportTarget = computed(() => {
    const id = props.options?.id;
    return id ? `#${CSS.escape(id)} .wb-body` : null;
});

async function init() {
    if (instance.value) return;

    const { onmove, onresize, onclose, onfocus, onblur, launchOrigin, appName, ...rest } =
        props.options;

    instance.value = new WinBox({
        ...rest,
        onmove(x, y, width, height) {
            onmove?.(x, y, width, height);
            emit('move', { x, y, width, height });
        },
        onresize(width, height) {
            onresize?.(width, height);
            emit('resize', { width, height });
        },
        onclose(force) {
            if (force) return false;
            if (isClosing.value) return true;

            isClosing.value = true;
            const origin = getDockOrigin(appName);

            playWindowClose(instance.value.dom, origin).then(() => {
                onclose?.();
                emit('close');
                ready.value = false;
                instance.value?.close(true);
                instance.value = null;
            });

            return true;
        },
        onfocus() {
            onfocus?.();
            emit('focus');
        },
        onblur() {
            onblur?.();
            emit('blur');
        },
    });

    await nextTick();

    if (launchOrigin && instance.value?.dom) {
        await playWindowOpen(instance.value.dom, launchOrigin);
    }

    ready.value = true;
}

onMounted(init);

onBeforeUnmount(() => {
    if (!instance.value) return;
    instance.value.close(true);
    instance.value = null;
    ready.value = false;
});

defineExpose({
    instance,
    ready,
});
</script>

<template>
    <Teleport v-if="ready && teleportTarget" :to="teleportTarget">
        <div class="winbox-window-content">
            <slot />
        </div>
    </Teleport>
</template>

<style scoped>
.winbox-window-content {
    width: 100%;
    height: 100%;
    min-height: 100%;
}
</style>
