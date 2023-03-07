
const getQueryStringParameter = (param) => {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === param) {
            return decodeURIComponent(pair[1]); 
        }
    }
    return null;
}

const GetAttachmentsHTML = (attachmentsUrls) => {
    let html = '';

    attachmentsUrls.forEach(url => {
        html += `
        <div class="col-sm-4 col-xs-12">
            <a href="${url}">
                <img src="${url}" alt>
            </a>
        </div>`
    });

    return html;
}

const fillAdvertisementData = (data) => {

    let title = $('div.container > div.title');
    let text = $('div.text > p');
    let categoryDateInfo = $('div.hh > div.date');
    let authorLink = $('div.hh > div.who > a')
    let authorImage = $('div.hh > div.who > a > div.img img');
    let authorName = $('div.hh > div.who > a > div.name');
    let attachments = $('div.row.desk-photos')
    let linkToUser = $('a.link')
    
    let userLink = getUserLink(data.AuthorId);
    let userInfo = getUserInfo(data.AuthorId);
    let dateCreated = new Date(data.Created);
    let dateOptions = { day: 'numeric', month: 'long'}

    title.html(data.Title);
    text.html(data.AdvDescription || '');

    categoryDateInfo.html(`${dateCreated.toLocaleDateString("en-ES", dateOptions)} · ${data.Category.Title}`)

    authorImage[0].src = userInfo.Image;
    authorName.html(userInfo.Name);
    authorLink[0].href = userLink;

    attachments.html(GetAttachmentsHTML([data.Image.Url]))

    linkToUser.html(`Contact ${userInfo.Name}`)
    linkToUser[0].href = userLink;

}

let id = getQueryStringParameter("$id");

if (id !== null) {

    const webServerUrl = _spPageContextInfo.webAbsoluteUrl;
    const listName = 'Advertisements';
    let filter = `?$filter=Id eq ${id}`
    let fields = '&$select=*,Category/Title&$expand=Category'

    const requestItemCountURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/Items${filter}${fields}`;
    console.log(requestItemCountURL)
    

    $.ajax({
        url: requestItemCountURL,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        async: false,
        success: function (data) {  
            console.log(data.d.results);
            fillAdvertisementData(data.d.results[0]);
        },  
        error: function (err) {
            console.log("There was an error" + err);
        }
    });
}