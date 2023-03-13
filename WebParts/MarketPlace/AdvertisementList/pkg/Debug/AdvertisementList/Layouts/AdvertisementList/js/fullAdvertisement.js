var currentUserId = _spPageContextInfo.userId;
var isCurrentUserAdmin = isGroupMember(_spPageContextInfo.webAbsoluteUrl, currentUserId, "Avito Owners");

if (isCurrentUserAdmin) {
    $('#admin-panel').removeClass('inactive');
    $('.aside-box.birthday-box').remove();
}
else {
    $('#admin-panel').remove();
}

const webServerUrl = _spPageContextInfo.webAbsoluteUrl;
let currentStatus = '';
let listItemType = null;

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

const getAttachmentUrls = () => {

    let attachmentsUrls = [];
    const requestURL = `${webServerUrl}/_vti_bin/listdata.svc/Advertisements(${id})/Attachments`

    $.ajax({
        url: requestURL,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        async: false,
        success: function (data) {
            console.log(data.d);
            $.each(data.d.results, function (index, item) {
                attachmentsUrls.push(item.__metadata.media_src);
            });
            console.log(attachmentsUrls);
        },
        error: function (err) {
            console.log("There was an error" + err);
        }
    });

    return attachmentsUrls;
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
    let status = $('.aside-title.title');
    let changeBtn = $('#changeStatus');

    let userLink = getUserLink(data.AuthorId);
    let userInfo = getUserInfo(data.AuthorId);
    let dateCreated = new Date(data.Created);
    let dateOptions = { day: 'numeric', month: 'long' }

    title.html(data.Title);
    text.html(data.AdvDescription || '');

    categoryDateInfo.html(`${dateCreated.toLocaleDateString("en-ES", dateOptions)} · ${data.Category.Title}`)

    authorImage[0].src = userInfo.Image;
    authorName.html(userInfo.Name);
    authorLink[0].href = userLink;

    if (data.Attachments) {
        let attachmentsUrls = getAttachmentUrls();
        let imageSet = [data.Image.Url, ...attachmentsUrls];
        attachments.html(GetAttachmentsHTML(imageSet))
    }
    else {
        attachments.html(GetAttachmentsHTML([data.Image.Url]))
    }

    linkToUser.html(`Contact ${userInfo.Name}`)
    linkToUser[0].href = userLink;

    // Admin-panel 
    status.html(`Status is ${data.Status}`);
    if (data.Status == 'Active') {
        changeBtn.html('To moderation');
    }
    else {
        changeBtn.html('Publish');
    }
    $('a#edit').attr("href", `${webServerUrl}/editAdvertisement?$id=${id}`);
    currentStatus = data.Status;

}

const publishAdvertisement = () => {

    const listName = 'Advertisements';
    const requestUrl = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/Items(${id})`;

    let patchStatus = currentStatus == 'Active' ? 'Moderation' : 'Active';
    let itemPayload = {
        "__metadata": { "type": listItemType },
        "Status": patchStatus
    };

    $.ajax({
        url: requestUrl,
        type: "POST",
        headers: {
            "X-RequestDigest": $('#__REQUESTDIGEST').val(),
            "X-HTTP-Method": "MERGE",
            "If-Match": "*",
            "Content-Type": "application/json;odata=verbose"
        },
        data: JSON.stringify(itemPayload),
        success: function (data) {
            console.log("Item updated successfully");
            window.location.reload();
        },
        error: function (error) {
            console.error("Error updating item: " + JSON.stringify(error));
        }
    });
}

let id = getQueryStringParameter("$id") || 1;

if (id !== null) {

    const listName = 'Advertisements';
    let fields = '$select=Title, AdvDescription, AuthorId, Created, Image, Attachments, Status, Category/Title&$expand=Category'

    const requestItemCountURL = `${webServerUrl}/_api/web/lists/getbytitle('${listName}')/Items(${id})?${fields}`;
    console.log(requestItemCountURL)

    $.ajax({
        url: requestItemCountURL,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        async: false,
        success: function (data) {
            console.log(data.d);
            listItemType = data.d.__metadata.type;
            fillAdvertisementData(data.d);
        },
        error: function (err) {
            console.log("There was an error" + err);
        }
    });
}