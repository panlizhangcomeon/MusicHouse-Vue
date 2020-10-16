<template>
    <div class="changePassword">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item ref="oldPassword" label="旧密码" prop="oldPassword" has-feedback="">
                <a-input v-model="form.oldPassword" @blur="() => {$refs.oldPassword.onFieldBlur();}" autocomplete="off"/>
            </a-form-model-item>
            <a-form-model-item ref="password" label="新密码" prop="password" has-feedback="">
                <a-input v-model="form.password" type="password" @blur="() => {$refs.password.onFieldBlur();}" autocomplete="off"/>
            </a-form-model-item>
            <a-form-model-item ref="confirmPassword" label="确认密码" prop="confirmPassword" has-feedback="">
                <a-input v-model="form.confirmPassword" type="password" @blur="() => {$refs.confirmPassword.onFieldBlur();}" autocomplete="off"/>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">
                    确认
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
        name: 'ChangePassword',
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                other: '',
                form: {
                    oldPassword: '',
                    password:'',
                    confirmPassword: '',
                },
                rules: {
                    oldPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 20, message: '用户名长度在5到20位之间', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { min: 5, max: 20, message: '新密码长度在5到20位之间', trigger: 'blur' },
                    ],
                    confirmPassword: [
                        { required: true, message: '请输入确认密码', trigger: 'blur' },
                        { min: 5, max: 20, message: '确认密码长度在5到20位之间', trigger: 'blur' },
                    ]
                },
            };
        },
        methods: {
            onSubmit() {
                let _this = this;
                if (_this.form.password === _this.form.oldPassword) {
                    _this.$message.error('新密码与旧密码不能相同');
                    return false;
                }
                if (_this.form.password !== _this.form.confirmPassword) {
                    _this.$message.error('密码与确认密码不一致');
                    return false;
                }
                _this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let username = localStorage.getItem('username');
                        _this.$http.get('http://10.100.50.130:9501/user/changePassWd', {
                            params:{username:username, oldpassword:_this.form.oldPassword, newpassword:_this.form.password}
                        }).then(function (res) {
                            if (res.data.result.status === 0) {
                                localStorage.setItem('token', res.data.result.token); //更新token
                                _this.$message.info('修改成功');
                            } else {
                                _this.$message.error(res.data.result.errorMsg);
                            }
                        }).catch(function (error) {
                            _this.$message.error(error);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.ruleForm.resetFields();
            },
        },
        created() {
            document.title = '修改密码';
        }
    };
</script>

<style>
    .changePassword {
        padding: 10px 100px;
        text-align: left;
    }
</style>
