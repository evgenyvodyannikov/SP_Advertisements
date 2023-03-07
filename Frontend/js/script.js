var currentPage = parseInt(window.localStorage.getItem('currentPage'));
console.log(currentPage)
if(!currentPage){
    currentPage = 1;
}

var pageCount = 0;
var pageSize = 5;

var isUsersAdsSelected = false;
var selectedCategoryId = 0;

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
            optionsContainer.change(optionSelected);
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

const displayAdvertisements = (page) => {


    $('.news-item').remove();
    $('div.news-box.section-padding').prepend('<div class="news-item pending">Pending...</div>');

    const webServerUrl = _spPageContextInfo.webAbsoluteUrl;
    const listName = 'Advertisements';
    let filter = '';
    if(selectedCategoryId != 0){
        filter = `?$filter=Category eq ${selectedCategoryId}`
    }
    const requestItemCountURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/Items${filter}`;
    console.log('selectedCategoryId' + selectedCategoryId)
    console.log(requestItemCountURL)
    
    if(pageCount == 0 || selectedCategoryId != 0){

        $.ajax({
            url: requestItemCountURL,
            type: "GET",
            headers: {
               "accept": "application/json;odata=verbose"
            },
            async: false,
            success: function (data) {
                pageCount = Math.ceil(data.d.results.length / pageSize);       
                console.log(data.d.results);
                console.log('new page count = ' + pageCount)   
            },  
            error: function (err) {
               console.log("There was an error" + err);
            }
         });

         let pager = $('div.pager ul');
         pager.html('');

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
    };

    
    filter = `$filter=ID ge ${(page - 1) * pageSize + 1} and ID le ${page * pageSize}`

    if(selectedCategoryId != 0){
        filter = `$filter=Category eq ${selectedCategoryId}&$top=5`
        
    }

    const requestItemsURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/Items?${filter}`;
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

    currentPage = page;
    window.localStorage.setItem('currentPage', currentPage);
    displayAdvertisements(page);
}

const paginateNext = () => {

    if(currentPage + 1 <= pageCount){
        
        $('.filter').removeClass('active');

        $(`div.pager ul li#${currentPage+1}`).addClass('active');

        currentPage += 1;
        window.localStorage.setItem('currentPage', currentPage);
        displayAdvertisements(currentPage);
    }
}

const optionSelected = () => {

    let selectedValue = $("Select#Categories option:selected").val();
    selectedCategoryId = selectedValue;
    displayAdvertisements(1);

}

$(document).ready( function() {

    displayCategories();
    displayAdvertisements(currentPage);
    


 });


