<template>
    <div class="register">
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
            <a-form-model-item label="地区" prop="region" has-feedback="">
                <a-select v-model="form.region" placeholder="选择一个地区">
                    <a-select-option value="shanghai">
                        上海
                    </a-select-option>
                    <a-select-option value="beijing">
                        北京
                    </a-select-option>
                    <a-select-option value="guangzhou">
                        广州
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="生日" required prop="birthday" has-feedback="">
                <a-date-picker v-model="form.birthday" type="date" placeholder="选择日期" style="width: 100%;"></a-date-picker>
            </a-form-model-item>
            <a-form-model-item label="喜欢音乐类型" prop="type">
                <a-checkbox-group v-model="form.type">
                    <a-checkbox value="1" name="type">
                        古风
                    </a-checkbox>
                    <a-checkbox value="2" name="type">
                        流行
                    </a-checkbox>
                    <a-checkbox value="3" name="type">
                        民族
                    </a-checkbox>
                </a-checkbox-group>
            </a-form-model-item>
            <a-form-model-item label="性别" prop="sex">
                <a-radio-group v-model="form.sex" name="sex">
                    <a-radio value="1">
                        男
                    </a-radio>
                    <a-radio value="2">
                        女
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="个性签名" prop="desc" has-feedback="">
                <a-input v-model="form.desc" type="textarea" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">
                    注册
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
        name: 'Register',
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                other: '',
                form: {
                    name: '',
                    password:'',
                    showPassword: 0,
                    region: undefined,
                    birthday: undefined,
                    delivery: false,
                    type: [],
                    sex: '',
                    desc: '',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 1, max: 20, message: '用户名长度在1到20位之间', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 20, message: '密码长度在5到20位之间', trigger: 'blur' },
                    ],
                    region: [{ required: true, message: '请选择地区', trigger: 'change' }],
                    birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
                    type: [
                        {
                            type: 'array',
                            required: true,
                            message: '请至少选择一种音乐类型',
                            trigger: 'change',
                        },
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'change' },
                    ],
                    desc: [{ required: true, message: '请输入个性签名', trigger: 'blur' }],
                },
            };
        },
        methods: {
            onSubmit() {
                let _this = this;
                _this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        _this.$http.get(_this.HTTP_URL + 'user/register', {
                            params:{
                                username:_this.form.name, password:_this.form.password, area:_this.form.region,
                                birthday:_this.form.birthday.format("YYYY-MM-DD"), like_type:_this.form.type, sex:_this.form.sex, desc:_this.form.desc
                            }
                        }).then(function (res) {
                            console.log(res.data);
                            if (res.data.result.status === 0) {
                                _this.$message.info('注册成功');
                            } else {
                                _this.$message.error('注册失败');
                            }
                        }).catch(function (error) {
                            console.log(error)
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
            //显示密码或隐藏
            changePasswordShow(res) {
                this.form.showPassword = res;
            }
        },
        created() {
            document.title = '注册'
        }
    };
</script>

<style>
    .register {
        padding: 10px 100px;
        text-align: left;
    }
</style>
