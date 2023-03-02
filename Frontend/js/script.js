
// TODO: Remove
const getWebServerUrl = () => {

    const webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;
    const webServerRelativeUrl = _spPageContextInfo.webServerRelativeUrl;

    return webAbsoluteUrl.replace(webServerRelativeUrl, "");
}

const getListItems = (listName) => {

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
            console.log(items);
            let optionsContainer = $('#Categories');

            let optionsHTML = `<option value="">Any</option>`;

            $.each(items, function (index, item) {
                optionsHTML += `<option value="">${item.Title}</option>`;
                console.log(item.Title)
            });

            optionsContainer.html(optionsHTML);
        },
        error: function (err) {
           console.log("There was an error");
           console.log(err);
        }
     });
}


$(document).ready( function() {

    getListItems("Categories");
    
 });


