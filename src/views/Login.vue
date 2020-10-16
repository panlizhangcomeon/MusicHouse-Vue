<template>
    <div class="login">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item ref="name" label="用户名" prop="name" has-feedback="">
                <a-input v-model="form.name" @blur="() => {$refs.name.onFieldBlur();}" autocomplete="off"/>
            </a-form-model-item>
            <a-form-model-item ref="password" label="密码" prop="password" has-feedback="">
                <a-input v-if="form.showPassword" v-model="form.password" @blur="() => {$refs.password.onFieldBlur();}" autocomplete="off"/>
                <a-input v-else v-model="form.password" type="password" @blur="() => {$refs.password.onFieldBlur();}" autocomplete="off"/>
            </a-form-model-item>
            <a-form-model-item label="显示密码" prop="delivery">
                <a-switch v-model="form.delivery" v-on:click="changePasswordShow(form.delivery)"/>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">
                    登陆
                </a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">
                    重置
                </a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
    export default {
        name: 'Login',
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                other: '',
                form: {
                    name: '',
                    password:'',
                    showPassword: 0,
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 5, max: 20, message: '用户名长度在5到20位之间', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 20, message: '密码长度在5到20位之间', trigger: 'blur' },
                    ],
                },
            };
        },
        methods: {
            onSubmit() {
                let _this = this;
                _this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        _this.$http.get(_this.HTTP_URL + 'user/login', {
                            params:{username:this.form.name, password:this.form.password}
                        }).then(function (res) {
                            console.log(res.data);
                            let result = res.data.result;
                            if (result.status === 0) {
                                _this.$message.info('登陆成功');
                                //登陆成功，localstorage存放token
                                localStorage.setItem('token', result.token);
                                localStorage.setItem('avatar', _this.HTTP_URL + 'user/img?imgPath=' + result.userInfo[0]['avatar']);
                                localStorage.setItem('userInfo', JSON.stringify(result.userInfo));
                                localStorage.setItem('username', result.userInfo[0]['username']);
                                _this.$router.push({
                                    path:'/homelist'
                                });
                                _this.$emit('parentFun', 'login')
                            } else {
                                _this.$message.error(result.errorMsg);
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.ruleForm.resetFields();
            },
            //显示密码或隐藏
            changePasswordShow(res) {
                this.form.showPassword = res;
            }
        },
        created() {
            document.title = '登陆'
        }
    };
</script>

<style>
    .login {
        padding: 10px 100px;
        text-align: left;
    }
</style>
