<template>
    <div class="userInfo">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item ref="username" label="用户名" prop="username" has-feedback="">
                <a-input v-model="form.username" @blur="() => {$refs.username.onFieldBlur();}" autocomplete="off" disabled=""/>
            </a-form-model-item>
            <a-form-model-item label="地区" prop="area" has-feedback="">
                <a-select v-model="form.area" placeholder="选择一个地区" disabled="disabled">
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
            <a-form-model-item label="生日" prop="birthday" has-feedback="">
                <a-date-picker v-model="form.birthday" type="date" placeholder="选择日期" style="width: 100%;" disabled="disabled"></a-date-picker>
            </a-form-model-item>
            <a-form-model-item label="喜欢音乐类型" prop="like_type">
                <a-checkbox-group v-model="form.like_type" disabled="disabled">
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
                <a-radio-group v-model="form.sex" disabled="disabled">
                    <a-radio :value="0">
                        男
                    </a-radio>
                    <a-radio :value="1">
                        女
                    </a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="个性签名" prop="desc" has-feedback="">
                <a-input v-model="form.desc" type="textarea" disabled="disabled"/>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        name: 'OtherInfo',
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                other: '',
                form: {
                    username: 'jacky',
                    area: '北京',
                    birthday: moment('1997-06-13', 'YYYY/MM/DD'),
                    delivery: true,
                    like_type: ['1'],
                    sex: '1',
                    desc: '测试个性签名',
                },
            };
        },
        methods: {
            //根据token获取当前登陆的用户信息
            getOtherInfo() {
                let _this = this;
                let username = _this.$route.query.username;
                _this.$http.get("http://10.100.50.130:9501/user/getOtherInfo", {
                    params:{username:username}
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
        },
        created() {
            let _this = this;
            document.title = '他人信息';
            _this.getOtherInfo();
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
