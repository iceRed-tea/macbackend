<script setup>
const router = useRouter();

const form = reactive({
    name: '',
    password: '',
});
const tab = ref('first');
const second = ref(60);
let timer = null;
const now = ref(new Date().getFullYear());

onBeforeUnmount(() => {
    clearInterval(timer);
});

const register = () => {
    console.log('register');
};

const getCode = () => {
    if (timer) return;
    second.value = 59;
    timer = setInterval(() => {
        if (second.value === 0) {
            second.value--;
            clearInterval(timer);
            timer = null;
            return;
        }
        second.value--;
    }, 1000);
};

function loginFun() {
    setTimeout(() => {
        router.replace('/os');
    }, 2500);
}
</script>

<template>
    <div class="mobile_login">
        <header class="mobile_login__header">
            <img class="mobile_login__logo" src="/logo.png" alt="logo" />
            <h1 class="mobile_login__title">Mac-Backend</h1>
            <p class="mobile_login__subtitle">欢迎回来，请登录您的账号</p>
        </header>

        <main class="mobile_login__main">
            <q-card class="mobile_login__card" flat>
                <q-card-section class="mobile_login__card-inner">
                    <q-tabs
                        v-model="tab"
                        class="mobile_login__tabs"
                        active-color="primary"
                        indicator-color="primary"
                        align="justify"
                        dense
                    >
                        <q-tab name="first" label="密码登录" />
                        <q-tab name="second" label="验证码登录" />
                    </q-tabs>
                    <q-separator class="q-mb-md" />

                    <q-form class="mobile_login__form" @submit="loginFun">
                        <q-input
                            v-model="form.name"
                            outlined
                            rounded
                            dense
                            type="text"
                            placeholder="请输入用户名 / 手机号"
                            :rules="[val => (val && val.length > 0) || '请输入用户名']"
                        >
                            <template #prepend>
                                <q-icon name="bi-phone" size="18px" />
                            </template>
                        </q-input>

                        <q-input
                            v-model="form.password"
                            outlined
                            rounded
                            dense
                            :type="tab === 'first' ? 'password' : 'text'"
                            :placeholder="tab === 'first' ? '请输入密码' : '请输入验证码'"
                            :rules="[
                                val =>
                                    (val && val.length > 0) ||
                                    `请输入${tab === 'first' ? '密码' : '验证码'}`,
                            ]"
                        >
                            <template #prepend>
                                <q-icon v-if="tab === 'first'" name="bi-lock" size="18px" />
                                <q-icon v-else name="bi-shield-lock" size="18px" />
                            </template>
                            <template v-if="tab === 'second'" #append>
                                <el-button
                                    :disabled="second > 0 && second < 60"
                                    link
                                    type="primary"
                                    size="small"
                                    @click.stop="getCode"
                                >
                                    {{
                                        second === -1
                                            ? '重新获取'
                                            : second === 60
                                            ? '获取验证码'
                                            : `${second}s`
                                    }}
                                </el-button>
                            </template>
                        </q-input>

                        <div class="mobile_login__links">
                            <el-button link type="primary" size="small">忘记密码？</el-button>
                            <el-button link type="primary" size="small" @click="register">
                                注册账号
                            </el-button>
                        </div>

                        <q-btn
                            class="mobile_login__submit"
                            label="登 录"
                            rounded
                            unelevated
                            color="primary"
                            type="submit"
                        />

                        <div class="mobile_login__divider">
                            <span>其他登录方式</span>
                        </div>

                        <div class="mobile_login__social">
                            <q-btn round flat>
                                <q-icon name="bi-tencent-qq" size="22px" />
                            </q-btn>
                            <q-btn round flat>
                                <q-icon name="bi-wechat" size="22px" color="positive" />
                            </q-btn>
                            <q-btn round flat>
                                <q-icon name="bi-alipay" size="22px" color="primary" />
                            </q-btn>
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </main>

        <footer class="mobile_login__footer">
            Copyright © 2023-{{ now }} macbackend All Rights Reserved.
        </footer>
    </div>
</template>

<style scoped lang="scss">
.mobile_login {
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --safe-x: env(safe-area-inset-left, 0px);

    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
    max-width: 100%;
    padding: calc(16px + var(--safe-top)) max(16px, var(--safe-x)) calc(12px + var(--safe-bottom));
    box-sizing: border-box;
    animation: mobile_login_fade 0.45s ease-out;

    @keyframes mobile_login_fade {
        from {
            opacity: 0;
            transform: translateY(16px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    &__header {
        flex-shrink: 0;
        text-align: center;
        padding: 8px 0 20px;
    }

    &__logo {
        width: 80px;
        height: 80px;
        object-fit: cover;
    }

    &__title {
        margin: 12px 0 4px;
        font-size: 1.35rem;
        font-weight: 700;
        color: #0a3d5c;
        letter-spacing: 0.02em;
        line-height: 2.5;
    }

    &__subtitle {
        margin: 0;
        font-size: 0.9rem;
        color: rgba(10, 61, 92, 0.65);
        line-height: 1.5;
    }

    &__main {
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
        min-height: 0;
    }

    &__card {
        width: 100%;
        max-width: 480px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 24px rgba(0, 105, 155, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    &__card-inner {
        padding: 16px 18px 20px;
    }

    &__tabs {
        :deep(.q-tab) {
            min-height: 44px;
            font-weight: 600;
            font-size: 0.95rem;
        }
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 20px;

        :deep(.q-field__control) {
            min-height: 48px;
            &::after {
                height: 48px;
            }
            .q-field__control-container {
                height: 48px;
            }
        }

        :deep(.q-field__prepend),
        :deep(.q-field__append) {
            height: 48px;
        }
    }

    &__links {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 4px;
    }

    &__link {
        font-size: 0.875rem;
        color: $primary;
        font-weight: 500;
        padding: 8px 4px;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
    }

    &__submit {
        width: 100%;
        min-height: 48px;
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        box-shadow: 0 8px 20px rgba(22, 119, 255, 0.28);
        margin-top: 30px;
    }

    &__divider {
        display: flex;
        align-items: center;
        margin: 24px 0 12px;
        color: rgba(0, 0, 0, 0.35);
        font-size: 0.8rem;

        &::before,
        &::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(0, 0, 0, 0.1);
        }

        span {
            padding: 0 12px;
            white-space: nowrap;
        }
    }

    &__social {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    &__footer {
        flex-shrink: 0;
        text-align: center;
        font-size: 0.75rem;
        color: rgba(10, 61, 92, 0.45);
        padding-top: 20px;
        line-height: 1.4;
    }
}

/* 平板 600px–799px：略放宽内边距与标题 */
@media (min-width: 600px) and (max-width: 799px) {
    .mobile_login {
        padding-left: 32px;
        padding-right: 32px;

        &__header {
            padding-bottom: 28px;
        }

        &__logo {
            width: 80px;
            height: 80px;
        }

        &__title {
            font-size: 2.5rem;
            line-height: 2.5;
        }

        &__card-inner {
            padding: 20px 24px 24px;
        }
    }
}

/* 小屏手机 */
@media (max-width: 380px) {
    .mobile_login {
        padding-left: 12px;
        padding-right: 12px;

        &__card-inner {
            padding: 14px 14px 18px;
        }

        &__title {
            font-size: 1.2rem;
            line-height: 2.5;
        }
    }
}
</style>
