var currentPage = parseInt(window.localStorage.getItem('currentPage'));

if(!currentPage){
    currentPage = 1;
}

/// Variables and conditions
var webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;
var pageCount = 0;
var pageSize = 5;
var currentUserId = _spPageContextInfo.userId;
var isCurrentUserAdmin = isGroupMember(_spPageContextInfo.webAbsoluteUrl, currentUserId, "Avito Owners");

if(isCurrentUserAdmin){
    $('.choices-inp').removeClass('inactive');
}
else{
    $('.choices-inp').remove();
}

var selectedCategoryId = 0;
var isLookingActiveAds = true;
var isLookingUserAds = false;

const getAPIEndpoint = (listName) => {
    return `${_spPageContextInfo.webAbsoluteUrl}/_vti_bin/listdata.svc/${listName}`
}

const displayCategories = () => {

    const categoriesAPIEndpoind = getAPIEndpoint('Categories');
    const requestURL = categoriesAPIEndpoind;

    $.ajax({
        url: requestURL,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            fillCategories(data.d.results);       
        },
        error: function (err) {
            console.log("There was an error" + err);
        }
    });
}

const fillCategories = (items) => {

    let optionsContainer = $('#Categories');
    optionsContainer.change(selectCategory);
    
    let optionsHTML = `<option value="0">Any</option>`;
    
    $.each(items, function (index, item) {
        optionsHTML += `<option value="${item.Id}">${item.Title}</option>`;
    });
    optionsContainer.html(optionsHTML);    

}

const getFilterRequestUrl = (filter = '') => {
    
    if(!filter) {
        filter = '$filter=';
    }
    else {
        filter += ' and '
    }

    if(isLookingActiveAds) {
        filter += `Status/Value eq 'Active'`;
    }
    else {
        filter += `Status/Value eq 'Moderation'`;
    }
    
    if(selectedCategoryId != 0) {
        filter += ` and Category/Id eq ${selectedCategoryId}`;
    }

    if(isLookingUserAds) {
        filter += ` and AuthorId eq ${currentUserId}`;
    }

    return filter;
}

const displayAdvertisements = (page) => {

    // Get count of Items for current selected conditions
    $('.news-item').remove();
    $('div.news-box.section-padding').prepend('<div class="news-item pending">Pending...</div>');

    const AdvertisementsAPIEndpoint = getAPIEndpoint('Advertisements');

    let lookingFields = '$select=Id,Category/Id,Status&$expand=Category';
    let filter = getFilterRequestUrl();

    const requestItemCountURL = `${AdvertisementsAPIEndpoint}?${lookingFields}&${filter}&$inlinecount=allpages`;
    
    // Get count and fill Pager element
    $.ajax({
        url: requestItemCountURL,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        async: false,
        success: function (data) {
            fillPager(data.d.__count); 
        },  
        error: function (err) {
            console.log("There was an error" + err);
        }
    });

    if(pageCount == 0){
        $('.news-item').remove();
        $('div.news-box.section-padding').prepend('<div class="news-item pending">There is no items to display...</div>');
        return;
    }

    const skipToken = `&$skip=${(page - 1) * pageSize}&$top=${pageSize}` 
    const requestItemsURL = `${AdvertisementsAPIEndpoint}?${filter}${skipToken}`;

    $.ajax({
        url: requestItemsURL,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            console.log(data)
            fillAdvertisements(data.d);   
        },
        error: function (err) {
            console.log("There was an error" + err);
        }
    });
}

const fillPager = (itemsCount) => {
    
    pageCount = Math.ceil(itemsCount / pageSize);  
    
    // Clear the Pager element
    let pager = $('div.pager ul');
    pager.html('');

    // Display warning if there is no items to show
    if(pageCount == 0){
        return;
    }

    // Fill the Pager element
    for(i = 1; i <= pageCount; i++){

        let elClass = 'filter';
        if(i == currentPage){
            elClass += ' active'; 
        }

        pager.append(
            `<li id="${i}" class="${elClass}"><a  href="#${i}" onclick="paginate(${i}, this)">${i}</a></li>`
        );

    }

    pager.append(
        `<li id="next" class="filter"><a  href="#next" onclick="paginateNext()">Next</a></li>`
    );
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
            result = data.d.Title;  
        },      
        error: function(err) {      
            console.log("There was an error" + err);     
        }      
    });

    return result;
    
}

const fillAdvertisements = (items) => {
    
    let advertisementsContainer = $('div.news-box.section-padding');
    let advertisementsHTML = '';

    $.each(items, function (index, item) {

        let category = getListProperty('Categories', item.CategoryId, 'Title');
        let userInfo = getUserInfo(item.AuthorId);
        let userLink = getUserLink(item.AuthorId);
        let ImageUrl = getAttachmentUrls(webAbsoluteUrl, item.Id, true);

        let date = item.Created.replace(/\D/g, '');
        date = getLocalDate(date * 1, true);
        advertisementsHTML += `
        
        <div class="news-item">
            <div class="row">
                <div class="col-sm-4 col-xs-12">
                    <div class="img">
                    <a href><img src="${ImageUrl}" alt="${ImageUrl}"></a>
                    </div>
                </div>

                <div class="col-sm-8 col-xs-12">
                    <div class="text">
                        <div class="date date-bottom">${date}</div>
                        <div class="status">${category}</div>
                        <div class="name">
                            <a href="${_spPageContextInfo.webAbsoluteUrl}/Pages/FullAdvertisement.aspx?$id=${item.Id}" target="_blank">${item.Title}</a>
                        </div>
                        <div class="ico-name">
                            <a href=${userLink}>
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

const paginate = (page, target) => {

    $('.filter').removeClass('active');
    $(target).parent().addClass('active');

    updateCurrentPage(page);
    displayAdvertisements(page);
}

const paginateNext = () => {

    if(currentPage + 1 <= pageCount){
        
        $('.filter').removeClass('active');

        $(`div.pager ul li#${currentPage+1}`).addClass('active');

        updateCurrentPage(currentPage += 1);
        displayAdvertisements(currentPage);
    }
}

const updateCurrentPage = (param) => {
    currentPage = param;
    window.localStorage.setItem('currentPage', currentPage);
} 

const selectCategory = () => {

    let selectedValue = $("Select#Categories option:selected").val();
    selectedCategoryId = selectedValue;
    displayAdvertisements(1);

}

const selectStatus = (status, target) => {
    
    isLookingActiveAds = status == 'Active' ? true : false;

    $('.choice').removeClass('active');
    $(target).addClass('active');

    updateCurrentPage(1)
    displayAdvertisements(currentPage);

}

const selectUserAds = () => {
    
    if ($('#c1').is(":checked")){
        isLookingUserAds = true;
    }
    else{
        isLookingUserAds = false;
    }

    updateCurrentPage(1)
    displayAdvertisements(currentPage);
    
}

$(document).ready( function() {

    displayCategories();
    displayAdvertisements(currentPage);
    
});