$(function() {
    $('#btn-forget-password').on('click', forgetButtonClick);
});


function forgetButtonClick(e) {
    e.preventDefault();

    var signal = false;

    $('.main-body').hide();
    $('.forget-password-main').html($('#forget-password-template').html()).show();

    init();


    function init() {
        var $form = $('#repair-password-from');
        $form.validate({
            rules: {
                loginName: {
                    required: true
                },
                mobile: {
                    required: true,
                    mobile: true
                },
                password: {
                    required: true,
                    nowhitespace: true,
                    byteRangeLength: [6,30]
                },
                repassword: {
                    required: true,
                    nowhitespace: true,
                    byteRangeLength: [6,30],
                    equalTo: '#password'
                }

            },
            messages: {
                loginName: {
                    required: '请输入用户名'
                },
                mobile: {
                    required: '请输入手机号码'
                },
                password: {
                    required: '请输入密码',
                    nowhitespace: '密码不能包含空格',
                    byteRangeLength: '密码长度 {0} ~ {1}'
                },
                repassword: {
                    required: '请输入密码',
                    nowhitespace: '密码不能包含空格',
                    byteRangeLength: '密码长度 {0} ~ {1}',
                    equalTo: '两次输入的密码不相同'
                }
            }
        });
        var loginName = $form.find('input[name="loginName"]');
        var mobile = $form.find('input[name="mobile"]');
        var getVerifyCode = $form.find('button[name="getVerifyCode"]');
        var verification = $form.find('button[name="verification"]');

        verification.addClass('disabled');
        getVerifyCode.addClass('disabled');

        $('[name="getVerifyCode"]').on('click', getVerifyCodeClick);
        $('[name="verification"]').on('click', verificationClick);
        $('[name="repairPassword"]').on('click', repairPasswordClick);
        $('.repair-password').hide();

        $(mobile).on('input propertychange', function(e){
            if(signal) {
                return;
            }


            if(!e.target.value) {
                getVerifyCode.addClass('disabled');
            } else {
                getVerifyCode.removeClass('disabled');
            }
        });

        $('.remove-icon').on('click', function(e) {
            $('.forget-password-main').empty().hide();
            $('.main-body').show();
        });

    }


    function getVerifyCodeClick(e) {
        e.preventDefault();
        signal = true;

        var $form = $('#repair-password-from');
        var $button = $('[name="getVerifyCode"]');

        if (!$form.validate().form()) {
            return;
        }

        var loginName = $form.find('input[name="loginName"]').val();
        var mobile = $form.find('input[name="mobile"]').val();

        var options = {
            url: 'api/entry/forget-password-getinfo',
            data: {
                loginName: mobile,
                mobile: mobile
            }
        };

        var timer,count=60;
        $button.addClass("disabled");

        ajaxRequest(options,
            function() {
                $('#put-result-information-success').empty().append('已发送');
                $('#repair-password-from').find('button[name="verification"]').removeClass('disabled');
                timer = setInterval(function(){
                    $button.html(count + "秒后可重新发送");
                    count = count - 1;
                    if(count == -1) {
                        $button.html("获取验证码").removeClass("disabled");
                        count = 60;
                        getVcode = false;
                        signal = false;
                        clearInterval(timer);
                    }
                }, 1000);
            },
            function(res) {
                signal = false;
                $button.removeClass("disabled");
                $('#put-result-information-success').empty().append(res.remark);
            },
            function(resp) {
                signal = false;
                $button.removeClass("disabled");
                console.error('ajax post faild : ' + JSON.stringify(resp));
            });

    }

    function verificationClick(e) {
        e.preventDefault();
        
        var $form = $('#repair-password-from');
        var verifyCode = $form.find('input[name="verifyCode"]').val();

        if (!verifyCode) {
            return;
        }

        var options = {
            url: 'api/entry/forget-password-validate',
            data: {
                verifyCode: verifyCode
            }
        };

        ajaxRequest(options,
            function() {
                $('#result-verification-success').show();
                $("#result-verification-error").hide();

                setTimeout(function() {
                    $('.entry-verifyCode').hide();
                    $('.repair-password').show();

                }, 1000);
            },
            function() {
                $('#result-verification-success').hide();
                $("#result-verification-error").show();
            }
        );
    }

    function repairPasswordClick(e) {
        e.preventDefault();

        var $form = $('#repair-password-from');

        if (!$form.validate().form()) {
            return;
        }

        var password = $form.find('input[name="password"]').val();
        var verifyCode = $form.find('input[name="verifyCode"]').val();

        var options = {
            url: 'api/entry/forget-password-modify',
            data: {
                password: password,
                verifyCode: verifyCode
            }
        };

        ajaxRequest(options, 
        function() {
            $('.remove-icon').trigger('click');

            bootbox.dialog({
                message: "<span class='bigger-110'>修改成功</span>",
                buttons:            
                {
                    "success" :
                    {
                        "label" : "确定!",
                        "className" : "btn-sm btn-success"

                    }
                }
            });
            console.log('修改成功!');
        },
        function() {
            bootbox.dialog({
                message: "<span class='bigger-110'>修改失败</span>",
                buttons:            
                {
                    "danger" :
                    {
                        "label" : "确定!",
                        "className" : "btn-sm btn-danger"

                    }
                }
            });
        });
    }

    function ajaxRequest(options, successCallback, faildCallback, errorCallback) {
        $.ajax({
            url: options.url,
            type: 'POST',
            data: options.data,
            success: function(res) {
                if (res.status === 0) {
                    faildCallback ? faildCallback(res) : console.log(res.remark);

                } else if (res.status === 1) {
                    successCallback();

                } else {
                    if(res.success === false) {
                        $('#btn-forget-password').trigger('click');

                        bootbox.dialog({
                            message: "<span class='bigger-110'>操作异常："+(res.msg||'数据请求错误')+"</span>",
                            buttons:
                            {
                                "danger" :
                                {
                                    "label" : "确定",
                                    "className" : "btn-sm btn-danger"
                                }
                            }
                        });
                    }
                }
            },

            error: function(res) {
                errorCallback ? errorCallback(res) : console.error('ajax post faild : ' + JSON.stringify(res));
            }

        });


    }
}
