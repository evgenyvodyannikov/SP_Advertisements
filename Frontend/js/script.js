
// TODO: Remove
const getWebServerUrl = () => {

    const webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;
    const webServerRelativeUrl = _spPageContextInfo.webServerRelativeUrl;

    return webAbsoluteUrl.replace(webServerRelativeUrl, "");
}

const displayListItems = (listName) => {

    const webServerUrl = _spPageContextInfo.webAbsoluteUrl;
    const RequestURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/items`;

    console.log(RequestURL);

     $.ajax({
        url: RequestURL,
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
           console.log("There was an error");
           console.log(err);
        }
     });
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

}

$(document).ready( function() {

    displayListItems('Categories');
    
 });


