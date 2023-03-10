﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AdvertisementList.AdvertisementListWebPart {
    using System.Web.UI.WebControls.Expressions;
    using System.Web.UI.HtmlControls;
    using System.Collections;
    using System.Text;
    using System.Web.UI;
    using System.Collections.Generic;
    using System.Linq;
    using System.Xml.Linq;
    using Microsoft.SharePoint.WebPartPages;
    using System.Web.SessionState;
    using System.Configuration;
    using Microsoft.SharePoint;
    using System.Web;
    using System.Web.DynamicData;
    using System.Web.Caching;
    using System.Web.Profile;
    using System.ComponentModel.DataAnnotations;
    using System.Web.UI.WebControls;
    using System.Web.Security;
    using System;
    using Microsoft.SharePoint.Utilities;
    using System.Text.RegularExpressions;
    using System.Collections.Specialized;
    using System.Web.UI.WebControls.WebParts;
    using Microsoft.SharePoint.WebControls;
    using System.CodeDom.Compiler;
    
    
    public partial class AdvertisementListWebPart {
        
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebPartCodeGenerator", "14.0.0.0")]
        public static implicit operator global::System.Web.UI.TemplateControl(AdvertisementListWebPart target) 
        {
            return target == null ? null : target.TemplateControl;
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "14.0.0.0")]
        private void @__BuildControlTree(global::AdvertisementList.AdvertisementListWebPart.AdvertisementListWebPart @__ctrl) {
            @__ctrl.SetRenderMethodDelegate(new System.Web.UI.RenderMethod(this.@__Render__control1));
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "14.0.0.0")]
        private void @__Render__control1(System.Web.UI.HtmlTextWriter @__w, System.Web.UI.Control parameterContainer) {
            @__w.Write(@"

<head>
	<meta charset=""utf-8"">
	<title>Marketplace</title>
	<meta name=""description"" content="""">

	<meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
	<meta name=""viewport"" content=""width=device-width, initial-scale=1, maximum-scale=1"">
	
	<link rel=""stylesheet"" href=""../_layouts/15/AdvertisementList/css/owl.carousel.min.css"">
	<link rel=""stylesheet"" href=""../_layouts/15/AdvertisementList/css/owl.theme.default.min.css"">

	<link rel=""stylesheet"" href=""../_layouts/15/AdvertisementList/libs/bootstrap/css/bootstrap-grid.min.css"">
	<link href=""https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext"" rel=""stylesheet"">
    <link href=""../_layouts/15/AdvertisementList/css/main.css?ver=");
                                                          @__w.Write(DateTime.Now.Millisecond);

            @__w.Write("\" rel=\"stylesheet\" />\r\n\t<link rel=\"stylesheet\" href=\"../_layouts/15/Advertisement" +
                    "List/css/media.css\">\r\n\r\n</head>\r\n\r\n<body>\r\n<div id=\"wrapper\">\r\n\t<div class=\"main" +
                    " bg-white\">\r\n\t\t<div class=\"toping-box\">\r\n\t\t\t<div class=\"container\">\r\n\t\t\t\t<ul cla" +
                    "ss=\"pagin\">\r\n\t\t\t\t\t<li><a href=\"\">Главная</a></li>\r\n\t\t\t\t\t<li><a href=\"\">Кредитный" +
                    " департамент</a></li>\r\n\t\t\t\t\t<li><a hre\tf=\"\">Отдел прогназирования спроса</a></li" +
                    ">\r\n\t\t\t\t</ul>\r\n\t\t\t\t<div class=\"title\">Доска объявлений</div>\r\n                   " +
                    " <div class=\"first-row\">\r\n                        <div class=\"choices-inp\">\r\n\t\t\t" +
                    "\t\t\t    <p class=\"label\">Объявления</p>\r\n\t\t\t\t\t\t    <div class=\"choices\">\r\n\t\t\t\t\t\t\t" +
                    "    <a href=\"#active\" class=\"choice active\" onclick=\"selectStatus(\'Active\', this" +
                    ")\">Активные</a>\r\n\t\t\t\t\t\t\t    <a href=\"#moderation\" class=\"choice\" onclick=\"select" +
                    "Status(\'Moderation\', this)\">На модерации</a>\r\n\t\t\t\t\t\t    </div>\r\n\t\t\t\t\t    </div>\r" +
                    "\n\t\t\t\t\t    <div class=\"inp\">\r\n\t\t\t\t\t\t    <p class=\"label\">Категории</p>\r\n\t\t\t\t\t\t   " +
                    " <select class=\"form-control\" id=\"Categories\">\r\n\t\t\t\t\t\t\t    <option value=\"\">Any<" +
                    "/option>\r\n                                <option disabled value=\"\">Pending...</" +
                    "option>\r\n\t\t\t\t\t\t    </select>\r\n\t\t\t\t\t    </div>\r\n\t\t\t\t\t    <input class=\"btn\" type=" +
                    "\"submit\" value=\"+ Create Advertisement\">\r\n\t\t\t\t    </div>\r\n                    <d" +
                    "iv class=\"second-row\">\r\n                         <div class=\"ch\">\r\n\t\t\t\t\t\t    <in" +
                    "put type=\"checkbox\" id=\"c1\">\r\n\t\t\t\t\t\t    <label for=\"c1\">Мои объявления</label>\r\n" +
                    "\t\t\t\t\t    </div>\r\n                    </div>\r\n                </div>\r\n\t\t\t</div>\r\n" +
                    "\t\t</div>\r\n\t\t<div class=\"container\">\r\n\t\t\t<div class=\"two-columns\">\r\n\t\t\t\t<div clas" +
                    "s=\"row\">\r\n\t\t\t\t\t<div class=\"col-md-9 col-sm-12\">\r\n\t\t\t\t\t\t<div class=\"content-box\">" +
                    "\r\n\t\t\t\t\t\t\t<div class=\"news-box section-padding\">\r\n\t\t\t\t\t\t\t\t<div class=\"news-item p" +
                    "ending\">Pending...</div>\r\n\t\t\t\t\t\t\t\t<div class=\"pager\">\r\n\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t<" +
                    "/ul>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div clas" +
                    "s=\"col-md-3 col-sm-12\">\r\n\t\t\t\t\t\t<div class=\"aside aside-moved-top\">\r\n\t\t\t\t\t\t\t<div " +
                    "class=\"aside-box fast-links\">\r\n\t\t\t\t\t\t\t\t<div class=\"aside-title title\">Быстрые сс" +
                    "ылки</div>\r\n\t\t\t\t\t\t\t\t<ul class=\"list\">\r\n\t\t\t\t\t\t\t\t\t<li><a href=\"\">Анонсы</a></li>\r\n" +
                    "\t\t\t\t\t\t\t\t\t<li><a href=\"\">Оргструктура</a></li>\r\n\t\t\t\t\t\t\t\t\t<li><a href=\"\">Онлайн би" +
                    "блиотека</a></li>\r\n\t\t\t\t\t\t\t\t\t<li><a href=\"\">Объявления</a></li>\r\n\t\t\t\t\t\t\t\t</ul>\r\n\t" +
                    "\t\t\t\t\t\t\t<a href=\"\" class=\"like\">Скажи спасибо</a>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<div cla" +
                    "ss=\"aside-box birthday-box\">\r\n\t\t\t\t\t\t\t\t<div class=\"aside-title title\">Ближайшие д" +
                    "ни рождения</div>\r\n\t\t\t\t\t\t\t\t<ul class=\"list\">\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div clas" +
                    "s=\"img\"><a href=\"\"><img src=\"../_layouts/15/AdvertisementList/img/face.png\" alt=" +
                    "\"\"></a></div>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"tt\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"date\">26 марта" +
                    "</div>\r\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"name\"><a href=\"\">Анна Ефремова</a></div>\r\n\t\t\t\t\t\t\t" +
                    "\t\t\t\t<div class=\"fah\">Дизайнер</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t" +
                    "<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"img\"><a href=\"\"><img src=\"../_layouts/15/Advertiseme" +
                    "ntList/img//face.png\" alt=\"\"></a></div>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"tt\">\r\n\t\t\t\t\t\t\t\t\t\t\t" +
                    "<div class=\"date\">26 марта</div>\r\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"name\"><a href=\"\">Анна Е" +
                    "фремова</a></div>\r\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"fah\">Дизайнер</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r" +
                    "\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t<a href=\"\" class=\"more-link\">Показать бо" +
                    "льше</a>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</d" +
                    "iv>\r\n\t</div>\r\n\t<div class=\"footer footer-inner\">\r\n\t\t<div class=\"container\">\r\n\t\t\t" +
                    "<div class=\"row\">\r\n\t\t\t\t<div class=\"col-sm-12\">\r\n\t\t\t\t\t<div class=\"wrap\">\r\n\t\t\t\t\t\t<" +
                    "div class=\"copy\">© 2018 РН Банк. Корпоративный портал сотрудников банка.</div>\r\n" +
                    "\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n\r\n\t<!--[if lt I" +
                    "E 9]>\r\n\t<script src=\"libs/html5shiv/es5-shim.min.js\"></script>\r\n\t<script src=\"li" +
                    "bs/html5shiv/html5shiv.min.js\"></script>\r\n\t<script src=\"libs/html5shiv/html5shiv" +
                    "-printshiv.min.js\"></script>\r\n\t<script src=\"libs/respond/respond.min.js\"></scrip" +
                    "t>\r\n\t<![endif]-->\r\n\r\n\t<script src=\"../_layouts/15/AdvertisementList/libs/jquery/" +
                    "jquery-1.11.2.min.js\"></script>\r\n    <script src=\"../_layouts/15/AdvertisementLi" +
                    "st/utils/helper.js\"></script>\r\n    <script src=\"../_layouts/15/AdvertisementList" +
                    "/js/script.js?ver=");
                                                           @__w.Write(DateTime.Now.Millisecond);

            @__w.Write(@"""></script>
	<script src=""../_layouts/15/AdvertisementList/libs/plugins-scroll/plugins-scroll.js""></script>
	<script src=""../_layouts/15/AdvertisementList/js/owl.carousel.js""></script>
	<script src=""../_layouts/15/AdvertisementList/js/common.js""></script>");
        }
        
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "14.0.0.0")]
        private void InitializeControl() {
            this.@__BuildControlTree(this);
            this.Load += new global::System.EventHandler(this.Page_Load);
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "14.0.0.0")]
        protected virtual object Eval(string expression) {
            return global::System.Web.UI.DataBinder.Eval(this.Page.GetDataItem(), expression);
        }
        
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Never)]
        [GeneratedCodeAttribute("Microsoft.VisualStudio.SharePoint.ProjectExtensions.CodeGenerators.SharePointWebP" +
            "artCodeGenerator", "14.0.0.0")]
        protected virtual string Eval(string expression, string format) {
            return global::System.Web.UI.DataBinder.Eval(this.Page.GetDataItem(), expression, format);
        }
    }
}
