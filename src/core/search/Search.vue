<script setup>
const search = reactive({
    name: '',
});
</script>

<template>
    <div class="search_page">
        <div class="search_wrap">
            <svg
                class="search_icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input v-model="search.name" class="search_input" type="text" placeholder="搜索" />
            <span v-if="search.name" class="search_clear" @click="search.name = ''">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <line
                        x1="8"
                        y1="8"
                        x2="16"
                        y2="16"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <line
                        x1="16"
                        y1="8"
                        x2="8"
                        y2="16"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                </svg>
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.search_page {
    width: 100%;
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2em;
}

.search_wrap {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 30px;
    padding: 0 10px;
    border: 1px solid rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
    -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.1);

    transition: all 0.25s ease;

    &:focus-within {
        background: rgba(255, 255, 255, 0.6);
        border-color: rgba(255, 255, 255, 0.7);
    }
}

.search_icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: rgba(60, 60, 67, 0.6);
    margin-right: 6px;
}

.search_input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    height: 40px;
    font-size: 15px;
    color: #1c1c1e;
    caret-color: #007aff;

    &::placeholder {
        color: rgba(60, 60, 67, 0.45);
        font-size: 15px;
    }
}

.search_clear {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 4px;
    opacity: 0.45;
    transition: opacity 0.15s;

    svg {
        width: 17px;
        height: 17px;
        color: #8e8e93;
    }

    &:hover {
        opacity: 0.7;
    }
}
</style>
