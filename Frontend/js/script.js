
// TODO: Remove
const getWebServerUrl = () => {

    const webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;
    const webServerRelativeUrl = _spPageContextInfo.webServerRelativeUrl;

    return webAbsoluteUrl.replace(webServerRelativeUrl, "");
}

const displayListItems = (listName) => {

    const webServerUrl = _spPageContextInfo.webAbsoluteUrl;
    const requestURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/items`;

    console.log(requestURL);

     $.ajax({
        url: requestURL,
        type: "GET",
        headers: {
           "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            let items = data.d.results;

            if(listName == 'Categories'){
                fillCategories(items);
            }
            else if (listName == 'Advertisements'){
                fillAdvertisements(items);
            }
            
            console.log(items);
            
        },
        error: function (err) {
           console.log("There was an error" + err);
        }
     });
}

const getUserInfo = (userID) => {   

    const requestURL = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/getuserbyid('${userID}')`;
    
    let userName = undefined;
    let loginName = undefined;
    let userImage = undefined;
    let imageSize = 'L';

    $.ajax({      
        url: requestURL,      
        type: "GET",      
        headers: {      
            "Accept": "application/json; odata=verbose"      
        },   
        async: false,       
        success: function(data) {
            console.log(data.d);      
            userName = data.d.Title;  
            loginName = data.d.LoginName;     
        },      
        error: function(err) {      
            console.log("There was an error" + err);     
        }      
    });

    userImage = `${_spPageContextInfo.siteAbsoluteUrl}/_layouts/15/userphoto.aspx?size=${imageSize}&accountname=${loginName}`

    return {
        Name: userName, 
        Image: userImage,
    };
}  

const getListProperty = (listName, itemId, propertyName) => {

    const requestURL = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})/?$select=${propertyName}`;
    let result = undefined;

    $.ajax({      
        url: requestURL,      
        type: "GET",      
        headers: {      
            "Accept": "application/json; odata=verbose"      
        },   
        async: false,       
        success: function(data) {
            console.log('check me');
            console.log(data.d);
            result = data.d.Title;  
        },      
        error: function(err) {      
            console.log("There was an error" + err);     
        }      
    });

    return result;
    
}

const fillCategories = (items) => {
    
    let optionsContainer = $('#Categories');

    let optionsHTML = `<option value="">Any</option>`;

    $.each(items, function (index, item) {
        optionsHTML += `<option value="">${item.Title}</option>`;
        console.log(item.Title)
    });

    optionsContainer.html(optionsHTML);
}

const fillAdvertisements = (items) => {
    
    let advertisementsContainer = $('div.news-box.section-padding');
    let advertisementsHTML = '';

    $.each(items, function (index, item) {

        let category = getListProperty('Categories', item.CategoryId, 'Title');
        let userInfo = getUserInfo(item.AuthorId);

        advertisementsHTML += `
        
        <div class="news-item">
            <div class="row">
                <div class="col-sm-4 col-xs-12">
                    <div class="img">
                    <a href><img src="${item.Image.Url}" alt></a>
                    </div>
                </div>

                <div class="col-sm-8 col-xs-12">
                    <div class="text">
                        <div class="date date-bottom">${item.Created}</div>
                        <div class="status">${category}</div>
                        <div class="name"><a href>${item.Title}</a></div>
                        <div class="ico-name">
                            <a href>
                                <div class="ico">
                                    <img src="${userInfo.Image}" alt>    
                                </div>
                                <div class="n">${userInfo.Name}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    });

    $('div.news-item.pending').remove();
    advertisementsContainer.prepend(advertisementsHTML);
}

$(document).ready( function() {

    displayListItems('Categories');
    displayListItems('Advertisements');
    
 });


