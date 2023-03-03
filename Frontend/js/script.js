
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
    
    let advertisementsContainer = $('div.news-box.section-padding');

    let advertisementsHTML = '';
    let Item = null;

    $.each(items, function (index, item) {

        Item = document.createElement('div');
        Item.className = "news-item";

        let Row = document.createElement('div');
        Row.className = "row";
        Item.appendChild(Row);

        let LeftBlock = document.createElement('div');
        LeftBlock.className = "col-sm-4 col-xs-12";
        let Img = document.createElement('div');
        Img.className = "img";

        let LinkToImage = document.createElement('a');
        LinkToImage.href = "";
        let Image = document.createElement('img');
        Image.src = item.Image.Url;
        LinkToImage.appendChild(Image);
        Img.appendChild(LinkToImage);
        LeftBlock.appendChild(Img);

        let RightBlock = document.createElement('div');
        LeftBlock.className = "col-sm-8 col-xs-12";

        Row.appendChild(LeftBlock);
        Row.appendChild(RightBlock);


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
                        <div class="status">Rental</div>
                        <div class="name"><a href>${item.Title}</a></div>
                    </div>
                </div>
            </div>
        </div>`;

    });

    advertisementsContainer.prepend(advertisementsHTML);
}

$(document).ready( function() {

    displayListItems('Categories');
    displayListItems('Advertisements');
    
 });


