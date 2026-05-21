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
const loading = ref(false);

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
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        router.replace('/os');
    }, 2500);
}
</script>

<template>
    <q-card class="login_card" flat>
        <q-card-section>
            <div class="logo">
                <img src="/logo.png" alt="logo" />
                <span class="text-bold text-h6">Mac-Backend</span>
            </div>
            <div class="top_tip">
                <span class="text-h6 text-bold">欢迎回来</span>
                <div class="text-body1" style="margin-bottom: 10px">请登录您的账号继续使用</div>
                <q-tabs v-model="tab" active-color="primary">
                    <q-tab name="first" label="密码登录" />
                    <q-tab name="second" label="验证码登录" />
                </q-tabs>
                <q-separator />
            </div>
            <div class="login_content">
                <q-form class="login_box" @submit="loginFun">
                    <div class="content">
                        <span class="text-bold text-h6" style="margin-bottom: 12px">
                            {{ tab === 'first' ? '密码' : '验证码' }}登录
                        </span>
                        <q-input
                            v-model="form.name"
                            outlined
                            rounded
                            dense
                            type="text"
                            placeholder="请输入用户名"
                            :rules="[val => (val && val.length > 0) || '请输入用户名']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="bi-phone" size="16px" />
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
                            <template v-slot:prepend>
                                <q-icon v-if="tab === 'first'" name="bi-lock" size="16px" />
                            </template>
                            <template v-slot:append v-if="tab === 'second'">
                                <el-button
                                    :disabled="second > 0 && second < 60"
                                    link
                                    type="primary"
                                    size="small"
                                    @click.stop="getCode"
                                >
                                    <span class="text-bold">
                                        {{
                                            second === -1
                                                ? '重新获取'
                                                : second === 60
                                                ? '获取验证码'
                                                : `${second}s`
                                        }}
                                    </span>
                                </el-button>
                            </template>
                        </q-input>
                        <q-btn
                            label="登录"
                            rounded
                            unelevated
                            color="primary"
                            type="submit"
                            :loading="loading"
                        />
                        <div class="row orther">
                            <q-icon name="bi-tencent-qq" color="black">
                                <q-tooltip>QQ登录</q-tooltip>
                            </q-icon>
                            <q-icon name="bi-wechat" color="positive">
                                <q-tooltip>微信登录</q-tooltip>
                            </q-icon>
                            <q-icon name="bi-alipay" color="primary">
                                <q-tooltip>支付宝登录</q-tooltip>
                            </q-icon>
                        </div>
                    </div>
                    <div class="forget" v-ripple>忘记密码</div>
                    <div class="register" v-ripple @click="register">注册</div>
                </q-form>
            </div>
            <div class="text-center text-body2 text-grey-6">
                Copyright © 2023-{{ now }} macbackend All Rights Reserved.
            </div>
        </q-card-section>
    </q-card>
</template>

<style scoped lang="scss">
.login_card {
    border-radius: 20px;
    width: 50%;
    background: rgba($color: #ebebeb, $alpha: 0.9);
    backdrop-filter: blur(10px);
    max-width: 1000px;
    min-width: 800px;
    padding-bottom: 12px;
    animation: login_card_animation 1s ease forwards;
    @keyframes login_card_animation {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .logo {
        display: flex;
        align-items: center;
        position: absolute;
        top: 8px;
        left: 15px;
        gap: 10px;
        img {
            width: 50px;
            height: 50px;
            object-fit: cover;
        }
    }

    .login_box {
        position: relative;
        width: 500px;
        height: fit-content;
        border-radius: 20px;
    }
    .top_tip {
        width: 500px;
        padding: 20px 0;
        text-align: center;
        margin: auto;
    }
    .q-tab-panels {
        background: none;
        .q-tab-panel {
            padding: 0;
            height: 430px;
        }
    }
    .login_content {
        display: flex;
        gap: 20px;
        justify-content: center;
        padding-bottom: 50px;
    }

    .content {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 380px;
        height: 380px;
        padding: 50px 20px;
        box-shadow: inset 20px 20px 20px rgba($color: #000000, $alpha: 0.05),
            25px 35px 20px rgba($color: #000000, $alpha: 0.05),
            25px 30px 30px rgba($color: #000000, $alpha: 0.05),
            inset -20px -20px 25px rgba($color: #ffffff, $alpha: 0.9);
        border-radius: 52% 48% 33% 67% / 38% 45% 55% 62%;
        transition: all 0.5s;

        .q-field {
            margin-bottom: 12px;
        }

        .orther {
            width: 200px;
            align-items: center;
            justify-content: space-around;
            font-size: 20px;
            color: #8a9eb3;
            transition: all 0.3s;

            .q-icon:hover {
                cursor: pointer;
                color: #c61dff;
                text-decoration: underline;
            }
            .q-icon:nth-child(1):hover {
                color: #000;
            }
            .q-icon:nth-child(2):hover {
                color: #05da6c;
            }
        }

        &:hover {
            border-radius: 50%;
            .orther {
                transform: translateY(10px);
            }
        }

        &::before {
            content: '';
            position: absolute;
            top: 50px;
            left: 85px;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-color: #fff;
            opacity: 0.9;
        }

        &::after {
            content: '';
            position: absolute;
            top: 90px;
            left: 110px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: #fff;
            opacity: 0.9;
        }

        h2 {
            margin: 0;
        }

        .q-input,
        .q-btn {
            position: relative;
            width: 220px;
            border-radius: 25px;
            font-weight: bold;
            height: 44px;
            box-shadow: inset 2px 5px 10px rgba($color: #000000, $alpha: 0.1),
                inset -2px -5px 10px rgba($color: #ffffff, $alpha: 1),
                15px 15px 10px rgba($color: #000000, $alpha: 0.05),
                15px 10px 15px rgba($color: #000000, $alpha: 0.025);

            &::before {
                content: '';
                position: absolute;
                top: 8px;
                left: 50%;
                width: 65%;
                height: 5px;
                border-radius: 5px;
                background-color: rgba($color: #ffffff, $alpha: 0.5);
                transform: translateX(-50%);
            }
            :deep(.q-field__control) {
                height: 44px;
                .q-field__prepend,
                .q-field__append {
                    height: 44px;
                }
            }
        }

        .q-btn {
            padding: 10px 0;
            box-shadow: inset 2px 5px 10px rgba($color: #000000, $alpha: 0.1),
                15px 15px 10px rgba($color: #000000, $alpha: 0.05),
                15px 10px 15px rgba($color: #000000, $alpha: 0.025);
            transition: all 0.5s;

            &:hover {
                width: 180px;
            }
        }
    }

    .register {
        position: absolute;
        right: 0;
        bottom: 150px;
        width: 80px;
        height: 80px;
        border-radius: 49% 51% 52% 48% / 63% 59% 41% 37%;
        background-color: #01b4ff;
        box-shadow: inset 10px 10px 10px rgba($color: #01b4ff, $alpha: 0.05),
            15px 25px 10px rgba($color: #01b4ff, $alpha: 0.1),
            15px 20px 20px rgba($color: #01b4ff, $alpha: 0.1),
            inset -10px -10px 15px rgba($color: #ffffff, $alpha: 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        transition: all 0.5s;

        &::before {
            position: absolute;
            content: '';
            top: 10px;
            left: 20px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: #fff;
            opacity: 0.5;
        }

        &:hover {
            border-radius: 50%;
            cursor: pointer;
        }
    }

    .forget {
        right: 0px;
        bottom: 0px;
        width: 120px;
        height: 120px;
        position: absolute;
        background: #c61dff;
        color: #fff;
        box-shadow: inset 10px 10px 10px rgba($color: #c61dff, $alpha: 0.05),
            15px 25px 10px rgba($color: #c61dff, $alpha: 0.1),
            15px 20px 20px rgba($color: #c61dff, $alpha: 0.1),
            inset -10px -10px 15px rgba($color: #ffffff, $alpha: 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.5s;
        border-radius: 44% 56% 65% 35% / 57% 58% 42% 43%;

        &::before {
            position: absolute;
            content: '';
            top: 15px;
            left: 30px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #fff;
            opacity: 0.6;
        }

        &:hover {
            border-radius: 50%;
            cursor: pointer;
        }
    }
}
</style>
