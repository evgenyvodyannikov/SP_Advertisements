var currentPage = parseInt(window.localStorage.getItem('currentPage'));
console.log(currentPage)
if(!currentPage){
    currentPage = 1;
}

var pageCount = 0;
var pageSize = 5;
var lastItemId = 1;

var selectedCategoryId = 0;
var isLookingActiveAds = true;
var isLookingUserAds = false;

const displayCategories = () => {

    const webServerUrl = _spPageContextInfo.webAbsoluteUrl;
    const listName = 'Categories';
    const requestURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/items`;

     $.ajax({
        url: requestURL,
        type: "GET",
        headers: {
           "accept": "application/json;odata=verbose"
        },
        success: function (data) {

            let items = data.d.results;
            console.log(items);
            let optionsContainer = $('#Categories');
            optionsContainer.change(selectCategory);
            let optionsHTML = `<option value="0">Any</option>`;

            $.each(items, function (index, item) {
                optionsHTML += `<option value="${item.Id}">${item.Title}</option>`;
            });

            optionsContainer.html(optionsHTML);           
        },
        error: function (err) {
           console.log("There was an error" + err);
        }
     });
}

const getFilterRequestUrl = (filter = '') => {
    
    if(!filter) {
        filter = '$filter=';
    }
    else {
        filter += ' and '
    }

    if(isLookingActiveAds) {
        filter += `Status eq 'Active'`;
    }
    else {
        filter += `Status eq 'Moderation'`;
    }
    
    if(selectedCategoryId != 0) {
        filter += ` and Category eq ${selectedCategoryId}`;
    }

    return filter;
}

const displayAdvertisements = (page) => {

    // Get count of Items for current selected conditions
    $('.news-item').remove();
    $('div.news-box.section-padding').prepend('<div class="news-item pending">Pending...</div>');

    const webServerUrl = _spPageContextInfo.webAbsoluteUrl;
    const listName = 'Advertisements';

    let lookingFields = '$Select=Id,Category/Id,Status&$expand=Category';
    let filter = getFilterRequestUrl();

    const requestItemCountURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/Items?${lookingFields}&${filter}`;
    console.log('selectedCategoryId' + selectedCategoryId)
    console.log(requestItemCountURL)

    $.ajax({
        url: requestItemCountURL,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        async: false,
        success: function (data) {
            pageCount = Math.ceil(data.d.results.length / pageSize);  
            lastItemId = data.d.results[0]?.Id;     
            console.log(data.d.results);
            console.log('new page count = ' + pageCount)   
        },  
        error: function (err) {
            console.log("There was an error" + err);
        }
    });

    // Clear the Pager element
    let pager = $('div.pager ul');
    pager.html('');

    // Display warning if there is no items to show
    if(pageCount == 0){
        $('.news-item').remove();
        $('div.news-box.section-padding').prepend('<div class="news-item pending">There is no items to display...</div>');
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

    // Prepare to get Items

    skipToken = `$skiptoken=Paged=TRUE&p_ID=${lastItemId}&$top=${pageSize}`

    filter = `$filter=ID ge ${(page - 1) * pageSize + 1} and ID le ${page * pageSize}`
    filter = getFilterRequestUrl(filter);

    const requestItemsURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/Items?${filter}&${skipToken}`;
    console.log(requestItemsURL);
    console.log(filter);

     $.ajax({
        url: requestItemsURL,
        type: "GET",
        headers: {
           "accept": "application/json;odata=verbose"
        },
        success: function (data) {
            console.log(data.d.results)
            console.log(data.d.__next)
            fillAdvertisements(data.d.results);   
        },
        error: function (err) {
           console.log("There was an error" + err);
        }
     });
}

const getSkipToken = (page) => {

    /// example 2

    skipTokent = `$skiptoken=Paged=TRUE&p_ID=${lastItemId}&$top=${pageSize}`
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

const fillCategories = (items) => {
    
    let optionsContainer = $('#Categories');
    let optionsHTML = `<option value="">Any</option>`;

    $.each(items, function (index, item) {
        optionsHTML += `<option value="">${item.Title}</option>`;
    });

    optionsContainer.html(optionsHTML);
}

const fillAdvertisements = (items) => {
    
    let advertisementsContainer = $('div.news-box.section-padding');
    let advertisementsHTML = '';

    $.each(items, function (index, item) {

        let category = getListProperty('Categories', item.CategoryId, 'Title');
        let userInfo = getUserInfo(item.AuthorId);
        let userLink = getUserLink(item.AuthorId);

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

$(document).ready( function() {

    displayCategories();
    displayAdvertisements(currentPage);
    


 });


