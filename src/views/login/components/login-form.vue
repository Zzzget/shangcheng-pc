<template>
  <div class="account-box">
    <!-- <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 注册
      </a>
    </div> -->
    <Form
      class="form"
      :validation-schema="scheam"
      autocomplete="off"
      v-slot="{ errors }"
      ref="formCom"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入账号"
            />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="form.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              v-model="form.code"
              name="code"
              type="password"
              placeholder="请输入验证码"
            />
            <span class="code">发送验证码</span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>

      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login()">登录</a>
    </Form>
    <div class="action">
      <img
        src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
        alt=""
      />
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;" @click="isMsgLogin = !isMsgLogin">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import veeSchema from '@/utils/vee-validate-schema'
import { Form, Field } from 'vee-validate'
import { reactive, ref, watch } from 'vue'
import Message from '@/components/library/Message'
import { accountLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup() {
    const isMsgLogin = ref(false)
    const formCom = ref(null)

    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: 'ceshi',
      password: '123456',
      mobile: null,
      code: null
    })

    // 切换登录方式时还原表单数据
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = 'ceshi'
      form.password = '123456'
      form.mobile = null
      form.code = null
      formCom.value.resetForm()
    })
    // 校验规则对象
    const mySchema = {
      account: isMsgLogin.value || veeSchema.account,
      password: isMsgLogin.value || veeSchema.password,
      mobile: !isMsgLogin.value || veeSchema.mobile,
      code: !isMsgLogin.value || veeSchema.code,
      isAgree: veeSchema.isAgree
    }

    const store = useStore()
    const router = useRouter()
    // const route = useRoute()
    // 表单校验函数
    const login = async (value) => {
      const valid = await formCom.value.validate()
      if (valid.valid) {
        if (!isMsgLogin.value) {
          accountLogin(form)
            .then((data) => {
              const { id, mobile, token, nickname, avatar } = data.result
              console.log(data)
              store.commit('user/setUser', {
                id,
                mobile,
                token,
                nickname,
                avatar
              })
              store.dispatch('cart/mergeLocalCart')
              router.push('/')
            })
            .catch((err) => {
              Message({
                text: err.response.data.message || '登录失败',
                type: 'error'
              })
            })
        }
      }
    }
    return { isMsgLogin, form, scheam: mySchema, formCom, login }
  }
}
</script>

<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
