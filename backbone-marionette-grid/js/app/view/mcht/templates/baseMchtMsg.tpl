<!-- *******  录入信息 *******  -->
<%

var user = data.viceUsers;
var imgs = data.images;
var terminalInfos = data.terminalInfos;
var items;
var imgAddress;
if(!user) {
    user=[];
}
if(!sn){
    sn=[];
}
var getImgAddress = function(imgs, name) {
    var imgAddress = null;

    _.each(imgs, function(img) {
        if(img.name === name) {
            imgAddress = img.value;
        }
    });

    return imgAddress;
};

var kind = data.mchtKind;
var extraImages = getImgAddress(imgs, 'extra') ? getImgAddress(imgs, 'extra').split(',') : [];

var accountNo = Opf.get(data, 'accountNo');
var l = accountNo.length;

var userMsg = ((Opf.get(data, 'cardNo') ? Opf.get(data, 'cardNo').slice(0,6) + '************' : '')) + ' ' + (Opf.get(data, 'mchtUserName') || ''),
    bankCardMsg = (accountNo.slice(0,6) + '****' + accountNo.slice(l-4,l) || '') + ' ' + (Opf.get(data, 'mchtUserName') || ''),
    licNoMsg = (Opf.get(data, 'licNo') || '') + ' ' + (Opf.get(data, 'mchtName') || ''),
    taxNoMsg = (Opf.get(data, 'taxNo') || '') + ' ' + (Opf.get(data, 'mchtName') || '');

var formLayout = {

    sections: [{
        items: [
            {name:    'explorerName', key:    'explorerName', label: '拓展员', belong: 'B1,B2,C1,C4'},
            {name:    'explorePhone', key:    'explorePhone', label: '拓展员手机', belong: 'B1,B2,C1,C4'},
            {name:    'mchtNo', key:    'mchtNo', label: '商户编号', belong: 'B1,B2,C1,C4'}
        ]
    },{
        caption: '经营信息',
        items: [
            {name: 'mchtName', key: 'mchtName', label:     '商家名称', belong:   'B1,B2,C1,C4'},
            {name:  'address', key:  'address', label:     '商家地址', belong: 'B1,B2,C1,C4'},
            {name:  'comTel', key:  'comTel', label:     '公司电话', belong: 'B2'},
            {name:    'scope', key:    'scope', label:     '经营范围', belong: 'B1,B2,C1,C4'},
            {name:     'attr', key:     'attr', label:     '经济类型', belong: 'B2'},
            {name:    'licNo', key:    'licNo', label:   '营业执照号', belong: 'B2',
                numBeauty:function(val){
                    return  Opf.String.beautyWithSeparator(val,' ',4);
                }
            },
            {name:    'taxNo', key:    'taxNo', label: '税务登记证号', belong: 'B2',
                numBeauty:function(val){
                    return  Opf.String.beautyWithSeparator(val,' ',4);
                }
            }
        ]
    }, {
        caption: '法人代表信息',
        items: [
            {name: 'userName', key: 'mchtUserName', label:     '姓名', belong: 'B1,B2,C1,C4'},
            {name:        'userPhone', key:        'phone', label: '手机号码', belong: 'B1,B2,C1,C4'},
            {name:       'userCardNo', key:       'cardNo', label: '身份证', belong: 'B1,B2,C1,C4',
                numBeauty:function(val){
                    return val ? Opf.String.beautyIdNo(val,' ') : '';
                }
            },
            {name:        'userEmail', key:        'userEmail', label: '电子邮箱', belong: 'B1,B2,C1,C4'},

        ]
    }, {
        name: 'account',
        caption: '账户信息',
        items: [
            {name: 'accountName', key: 'accountName', label:   '开户名', belong: 'B1,B2,C1,C4'},
            {name:   'accountNo', key:   'accountNo', label:   '账户号', belong: 'B1,B2,C1,C4',
                numBeauty:function(val){
                    return  Opf.String.beautyBankCardNo(val,' ');
                }
            },
            {name:   'zbankName', key:   'zbankName', label: '开户支行', belong: 'B1,B2,C1,C4'}
        ]
    }],

    imageSections: [{
            belong: 'B1,B2,C1,C4',
            name: 'user',
            caption: '法人代表证件照',
            items: [
                {name: 'idCardFront', title: '身份证正面 ' + userMsg}, 
                {name: 'idCardBack', title: '身份证反面'},
                {name: 'personWithIdCard', title: '手持证件照'}
            ]
        }, {
            belong: 'B1,B2,C1,C4',
            name: 'account',
            caption: '银行卡/开户许可证照片',
            items: [
                {name: 'bankCard', title: '银行卡/开户许可证照片' + bankCardMsg}
            ]
        }, {
            belong: data.accountProxy == 1 ? 'B1,B2,C1,C4' : '',
            name: 'agreement',
            caption: '委托清算协议书盖章页',
            items: [
                {name: 'agreement', title: '委托清算协议书盖章页'}
            ]
        }, {
            belong: 'B2',
            name: 'license',
            caption: '经营资质',
            items: [
                {name: 'license', title: '营业执照 ' + licNoMsg},
                {name: 'orgImage', title: '组织机构证照片'},
                {name: 'taxImage', title: '税务登记表照片 ' + taxNoMsg}
            ]
        }, {
            belong: 'B2',
            name: 'scene',
            caption: '经营场景',
            items: [
                {name: 'scene', title: '经营场景'}
            ]
        }

    ]
};
var sections = formLayout.sections;
var imageSections = formLayout.imageSections;


%>
<div class="info-board container" style="margin-bottom: 30px;">
    <div class="row mcht-form-group">
    <div role="form" id="submit-data">

        <div class="col-lg-6 form-section">
            
            <div class="form-section-container">
           <% 
            for(var i=0; i<sections.length; i++) {
                var section = sections[i];
                items = sections[i].items;
                %>
            <div class="container fieldset" style="width: 100%;">
                
                <%if(section.caption) {%>
                    <div class="caption caption-text-font"><%= section.caption %></div>
                
                <%}%>

                <%
                for(j=0; j<items.length; j++) {
                    var item = items[j];
                    if(((item.belong.indexOf(kind)) + 1)){
                        var dataForValueCol = Opf.get(data, item.key);
                        if(item.numBeauty){
                            dataForValueCol = item.numBeauty(dataForValueCol);
                        }
                %>
                    <div class="row row-text-font row-margintop <%=item.name%>-row">
                        <div class="col-lg-2 col-xs-2 label-col label-color"><%=item.label %>：</div>
                        <div class="col-lg-8 col-xs-7 value-col checkable value checkable-text" name="<%=item.name%>">
                            <span class="text"><%= dataForValueCol %></span>
                        </div>
                    </div>

                    <% }
                }%>

                </div>
            <%}%>    

            </div>
        </div>


        <div class="col-lg-6 form-section">

                <div class="user-section container fieldset" style="width: 100%;">
                    <div class="caption caption-text-font">收银员</div>
                    <%if(user && user.length){%>
                        <%for(var i=0; i<user.length; i++){%>
                        <div class="row row-text-font row-margintop">
                            <div class="col-xs-5 value"><%=user[i].name%></div>
                            <div class="value col-xs-7">
                                <span class="text"><%=user[i].phone%></span>
                            </div>
                        </div>
                        <%}%>
                    <%}else{%>
                        <div class="row row-text-font row-margintop">
                            <div class="col-xs-5 value"><%=Opf.get(data,'mchtUserName')%></div>
                            <div class="value col-xs-7">
                                <span class="text"><%=Opf.get(data,'phone')%></span>
                            </div>
                        </div>
                    <%}%>
                </div>

                <div class="pos-section container fieldset" style="width: 100%;">
                    <div class="caption caption-text-font">商户的终端</div>
                    <%if(terminalInfos && terminalInfos.length){%>
                        <%for(var i=0; i<terminalInfos.length; i++){
                        var sn = terminalInfos[i].terminal;
                        var termFactory = terminalInfos[i].termFactory;
                        var termMachType = terminalInfos[i].termMachType;
                        var iboxSn = terminalInfos[i].iboxSn;
                        %>
                        <div class="row row-text-font row-margintop">
                            <div class="value">
                                <span class="text"><%=termMachType%> SN: <%=iboxSn%> —— 终端号：<%=sn%></span>
                            </div>
                        </div>
                        <%}%>
                    <%}else{%>
                        无
                    <%}%>
                </div>
        </div>

    </div>
    </div>

</div><!--ef *******  录入信息 *******  -->