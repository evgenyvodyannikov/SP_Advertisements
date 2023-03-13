﻿p<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="EditAdvertisementWebPart.ascx.cs" Inherits="AdvertisementList.EditAdvertisementWebPart.EditAdvertisementWebPart" %>

<!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="ru"> <!--<![endif]-->

<head>
	<meta charset="utf-8">
	<title>Заголовок</title>
	<meta name="description" content="">

	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	
	<link rel="stylesheet" href="../_layouts/15/AdvertisementList/css/owl.carousel.min.css">
	<link rel="stylesheet" href="../_layouts/15/AdvertisementList/css/owl.theme.default.min.css">

	<link rel="stylesheet" href="../_layouts/15/AdvertisementList/libs/bootstrap/css/bootstrap-grid.min.css">
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext" rel="stylesheet">
	<link rel="stylesheet" href="../_layouts/15/AdvertisementList/css/main.css">
	<link rel="stylesheet" href="../_layouts/15/AdvertisementList/css/media.css">

</head>

<body>
<div id="wrapper">
	<div class="main bg-white">
		<div class="toping-box">
			<div class="container">
				<ul class="pagin">
					<li><a href="">Главная</a></li>
				</ul>
				<div class="title">Pending</div>
			</div>
		</div>
		<div class="container inactive" id="main">
			<div class="two-columns">
				<div class="row">
					<div class="col-md-9 col-sm-12">
						<div class="content-box">
							
							<div class="section-padding">
								<form action="" class="default-form edit-form">
									<div class="row-inp">
										<p class="label">Заголовок</p>
										<input type="text" class="edit-title">
									</div>
									<div class="row-inp">
										<p class="label">Категории</p>
										<select class="form-control" id="Categories">
											<option value="" disabled>Pending</option>
										</select>
									</div>
									<div class="row-inp">
										<p class="label">Описание</p>
										<textarea class="edit-description"></textarea>
									</div>
									<div class="row-inp">
										<label for="file-upload" class="custom-file-upload">Select images (3 or less)</label>
                                        <input id="file-upload" type="file"/>
									</div>
									<div class="row-inp">
										<ul class="download-images">
										</ul>
									</div>
									<div class="row-inp">
										<p class="label">Объявление будет отправлено на модерацию</p>
										<input type="submit" class="btn" value="Сохранить">
									</div>
								</form>
							</div>

						</div>
					</div>
					<div class="col-md-3 col-sm-12">
						<div class="aside aside-moved-top">
							<div class="aside-box news-archive">
								<div class="aside-title title" id="status">Pending</div>
								<a href="#change" class="btn publish" id="changeStatus" onclick="publishAdvertisement()">Опубликовать</a>
								<ul class="month-list">
									<li><a href="">В архив</a></li>
									<li><a href="#delete" onclick="deleteAdvertisement()">Удалить</a></li  
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="footer footer-inner">
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<div class="wrap">
						<div class="copy">© 2018 РН Банк. Корпоративный портал сотрудников банка.</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


	<!--[if lt IE 9]>
	<script src="libs/html5shiv/es5-shim.min.js"></script>
	<script src="libs/html5shiv/html5shiv.min.js"></script>
	<script src="libs/html5shiv/html5shiv-printshiv.min.js"></script>
	<script src="libs/respond/respond.min.js"></script>
	<![endif]-->

	<script src="../_layouts/15/AdvertisementList/libs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../_layouts/15/AdvertisementList/utils/helper.js"></script>
    <script src="../_layouts/15/AdvertisementList/js/editAdvertisement.js"></script>
	<script src="../_layouts/15/AdvertisementList/libs/plugins-scroll/plugins-scroll.js"></script>
	<script src="../_layouts/15/AdvertisementList/js/owl.carousel.js"></script>
	<script src="../_layouts/15/AdvertisementList/js/common.js"></script>
	
</body>
</html>