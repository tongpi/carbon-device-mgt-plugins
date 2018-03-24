$(document).ready(function(){
    $("#signInForm").validate({
        rules: {
            username: {
                required: true,
                minlength: 3
            },
            password: {
                required: true,
                minlength: 3
            }
        },
        messages: {
            username: {
                required: "请输入用户名",
                minlength: "用户名至少包含3个字符"
            },
            password: {
                required: "请输入密码",
                minlength: "密码至少包含3个字符"
            }
        }
    });
});
