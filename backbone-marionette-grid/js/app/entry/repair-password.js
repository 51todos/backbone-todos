define(['tpl!app/entry/templates/repair-password.tpl',  'jquery.validate.origin'], function(tpl) { 	
	
	App.on('toChangePsw', showChangePswDiag);

    function getFormValues(form) {
        var $form = $(form);

        if($form.validate && $form.validate().form()) {
            var result = {};

            result['oldpassword'] = $form.find('input[name="oldpassword"]').val();
            result['newpassword'] = $form.find('input[name="newpassword"]').val();
            
            return result;
        }


        return null;

    }

    function addRulesForm(form) {
        $(form).validate({
            rules: {
                oldpassword:'required',
                newpassword:{
                    required:true,
                    minlength:6
                },
                renewpassword:{
                    required:true,
                    minlength:6,
                    equalTo:"#newpassword"
                }
            },

            messages: {
                oldpassword:'请输入密码',
                newpassword:{
                    required:'请输入密码',
                    minlength:'密码的长度至少为6'
                },
                renewpassword:{
                    required:'请输入密码',
                    minlength:'密码的长度至少为6',
                    equalTo:'两次输入的密码不相同'
                }
            }
        });

    }
    
    function showChangePswDiag4Inig () {
    	var $dialog = showChangePswDiag();   
    	$dialog.find(".icon-remove").hide();
    	$dialog.closest(".hide-screen").css("background", "#ccc");

        setTimeout(function(){
            var $buttonset = $('.bottom-body');
            $buttonset.append('<a class="psw-link">跳过此项操作</a>');
            var $pswLink = $buttonset.find('.psw-link');
            $pswLink.css({
                "float": "right",
                "margin-right": "10px",
                "margin-top": "18px",
                "cursor": "pointer"
            });
            $pswLink.click(function(){
                $dialog.remove();
                App.trigger('psw:skip:success'); 
            });

        },10);
    }

    function showChangePswDiag(){
        
        var dialog = tpl();
        var $dialog = $(dialog);
        var $form = $dialog.find('form');

        $dialog.appendTo($('body'));

        addRulesForm($form);

        //点击关闭按钮后触发的事件
        $dialog.find('i.icon-remove').on('click', function() {
            $dialog.remove();
        });

        //点击提交按钮后触发的事件
        $dialog.find('.btn-submit').on('click', function() {
            var postData = getFormValues($dialog.find('form'));

            if(postData) {
                Opf.ajax({
                    url: 'api/entry/modify-password',
                    type: 'POST',
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "json",
                    data: postData,
                    success: function(resp) {                      
                        if(resp.status == 1) {
                        	 /*Opf.alert({
                                 title: '修改结果',
                                 message: '修改成功'
                             });*/
                        	$dialog.remove();
                        	App.trigger("psw:change:success");                        	

                            //todo
                            // $('#btn-entry-logout').trigger('click');
                        } else {
                            if(resp.status == 0) {
                                return;
                            }
                            Opf.alert({
                                title:'修改结果',
                                message: resp.remark
                            });
                        }
                    },
                    error: function() {
                        Opf.alert({
                            title:'修改结果',
                            message: "修改密码出错了！"
                        });
                    }
                });
            }

        });
        return $dialog;
        
    }
    var API = {
    		showChangePswDiag: showChangePswDiag,
    		showChangePswDiag4Inig: showChangePswDiag4Inig
        };

    return API;


});