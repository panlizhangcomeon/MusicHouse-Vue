<template>
    <div class="userInfo">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item ref="username" label="用户名" prop="username" has-feedback="">
                <a-input v-model="form.username" @blur="() => {$refs.username.onFieldBlur();}" autocomplete="off" disabled=""/>
            </a-form-model-item>
            <a-form-model-item ref="password" label="密码" prop="password" has-feedback="">
                <a-input v-if="form.showPassword" v-model="form.password" @blur="() => {$refs.password.onFieldBlur();}" autocomplete="off" disabled=""/>
                <a-input v-else v-model="form.password" type="password" @blur="() => {$refs.password.onFieldBlur();}" autocomplete="off" disabled=""/>
            </a-form-model-item>
            <a-form-model-item label="显示密码" prop="delivery">
                <a-switch v-model="form.delivery" v-on:click="changePasswordShow(form.delivery)"/>
            </a-form-model-item>
            <a-form-model-item label="上传头像" prop="avatar">
                <a-upload
                        name="avatar"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        :action="this.HTTP_URL + `user/uploadAvatar`"
                        :before-upload="beforeUpload"
                        @change="handleChange"
                >
                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                            Upload
                        </div>
                    </div>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item label="地区" prop="area" has-feedback="">
                <a-select v-model="form.area" placeholder="选择一个地区">
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
            <a-form-model-item label="喜欢音乐类型" prop="like_type">
                <a-checkbox-group v-model="form.like_type">
                    <a-checkbox value="1" name="like_type">
                        古风
                    </a-checkbox>
                    <a-checkbox value="2" name="like_type">
                        流行
                    </a-checkbox>
                    <a-checkbox value="3" name="like_type">
                        民族
                    </a-checkbox>
                </a-checkbox-group>
            </a-form-model-item>
            <a-form-model-item label="性别" prop="sex">
                <a-radio-group v-model="form.sex">
                    <a-radio :value="0">
                        男
                    </a-radio>
                    <a-radio :value="1">
                        女
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="个性签名" prop="desc" has-feedback="">
                <a-input v-model="form.desc" type="textarea" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">
                    修改
                </a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
    import moment from 'moment';
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        name: 'UserInfo',
        data() {
            return {
                loading: false,
                imageUrl: '',
                trueImgUrl:'',
                avatar:'',
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                other: '',
                form: {
                    username: 'jacky',
                    password:'123456',
                    showPassword: 1,
                    area: '北京',
                    birthday: moment('1997-06-13', 'YYYY/MM/DD'),
                    delivery: true,
                    like_type: ['1'],
                    sex: '1',
                    desc: '测试个性签名',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 5, max: 20, message: '用户名长度在5到20位之间', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 20, message: '密码长度在5到20位之间', trigger: 'blur' },
                    ],
                    area: [{ required: true, message: '请选择地区', trigger: 'change' }],
                    birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
                    like_type: [
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
                        _this.$http.get(_this.HTTP_URL + "user/changeUserInfo", {
                            params:{
                                username:_this.form.username,
                                avatar:_this.trueImgUrl,
                                desc:_this.form.desc
                            }
                        }).then(function (res) {
                            if (res.data.result.status === 0) {
                                if (_this.trueImgUrl !== '') {
                                    localStorage.setItem('avatar', _this.HTTP_URL + 'user/img?imgPath=' + _this.trueImgUrl);
                                }
                                localStorage.setItem('token', res.data.result.token); //更新token
                                _this.$message.info('修改成功');
                                setTimeout(function() {
                                    location.reload();
                                }, 500);
                            }
                        }).catch(function (err) {
                           console.log(err);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //显示密码或隐藏
            changePasswordShow(res) {
                this.form.showPassword = res;
            },
            //根据token获取当前登陆的用户信息
            getUserInfo() {
                let _this = this;
                let token = localStorage.getItem('token');
                _this.$http.get(_this.HTTP_URL + "user/getUserInfo", {
                    params:{token:token}
                }).then(function (res) {
                    console.log(res.data.result);
                    if (res.data.result.status === 0) {
                        _this.form = res.data.result;
                        _this.form.birthday = moment(_this.form.birthday, 'YYYY/MM/DD')
                    }
                }).catch(function (error) {
                    console.log(error)
                });
            },
            handleChange(info) {
                let _this = this;
                if (info.file.status === 'uploading') {
                    _this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl => {
                        _this.imageUrl = imageUrl;
                        _this.loading = false;
                    });
                    _this.trueImgUrl = info.file.response.result.avatarUrl;
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },
        },
        created() {
            let _this = this;
            document.title = '个人信息';
            _this.getUserInfo();
        }
    };
</script>

<style>
    .userInfo {
        padding: 10px 100px;
        text-align: left;
    }
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>
