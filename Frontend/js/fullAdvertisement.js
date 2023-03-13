var currentUserId = _spPageContextInfo.userId;
const webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;
var isCurrentUserAdmin = isGroupMember(_spPageContextInfo.webAbsoluteUrl, currentUserId, "Avito Owners");

let currentStatus = '';
let listItemType = null;
let isAuthor = false;

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

    isAuthor = currentUserId == data.AuthorId;
    console.log(currentUserId);
    console.log(data.AuthorId);

    if (isCurrentUserAdmin) {
        $('#admin-panel').removeClass('inactive');
        $('.aside-box.birthday-box').remove();
    }
    else if (isAuthor) {
        $('#admin-panel').removeClass('inactive');
        $('#changeStatus').remove();
        $('.aside-box.birthday-box').remove();
    }

    let title = $('div.container > div.title');
    let text = $('div.text > p');
    let categoryDateInfo = $('div.hh > div.date');
    let authorLink = $('div.hh > div.who > a')
    let authorImage = $('div.hh > div.who > a > div.img img');
    let authorName = $('div.hh > div.who > a > div.name');
    let attachments = $('div.row.desk-photos')
    let linkToUser = $('a.link')
    let status = $('.aside-title.title#status');
    let changeBtn = $('#changeStatus');

    let userLink = getUserLink(data.AuthorId);
    let userInfo = getUserInfo(data.AuthorId);
    let dateCreated = new Date(data.Created);
    let dateOptions = { day: 'numeric', month: 'long' }

    title.html(data.Title);
    text.html(data.Description || '');

    categoryDateInfo.html(`${dateCreated.toLocaleDateString("en-ES", dateOptions)} · ${data.Category.Title}`)

    authorImage[0].src = userInfo.Image;
    authorName.html(userInfo.Name);
    authorLink[0].href = userLink;

    //let ImageUrl = data.Image.replaceAll(' ', '').split(',')[0];

    if (data.Attachments) {
        imageSet = getAttachmentUrls(webAbsoluteUrl, data.Id);
        console.log(data)
        //let imageSet = [ImageUrl, ...attachmentsUrls];
        attachments.html(GetAttachmentsHTML(imageSet))
    }
    else {
        attachments.html(GetAttachmentsHTML([ImageUrl]))
    }

    linkToUser.html(`Contact ${userInfo.Name}`)
    linkToUser[0].href = userLink;

    // Admin-panel 
    status.html(`Status is ${data.Status.Value}`);
    if (data.Status.Value == 'Active') {
        changeBtn.html('To moderation');
    }
    else {
        changeBtn.html('Publish');
    }
    $('a#edit').attr("href", `${webAbsoluteUrl}/editAdvertisement?$id=${id}`);
    currentStatus = data.Status;

}

const deleteAdvertisement = () => {

    const requestUrl = APIEndpoint;

    isAccepted = confirm('Are you sure?');
    if (isAccepted) {
        $.ajax({
            url: requestUrl,
            method: "DELETE",
            headers: {
                "X-RequestDigest": $('#__REQUESTDIGEST').val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": "*",
                "Content-Type": "application/json;odata=verbose"
            },
            success: function (data) {
                alert("Item delete successfully");
                window.location.href = `${webAbsoluteUrl}`
            },
            error: function (error) {
                console.error("Error updating item: " + JSON.stringify(error));
            }
        });
    }
}

const publishAdvertisement = () => {

    const requestUrl = APIEndpoint;

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

let id = getQueryStringParameter("$id", window.location.search.substring(1)) || 1;
const APIEndpoint = `${webAbsoluteUrl}/_api/web/lists/getbytitle('Advertisements')/Items(${id})`;

if (id !== null) {

    let filter = `$filter = Id eq ${id}`;
    let fields = '$select = Id, Title, Description, AuthorId, Created, Image, Attachments, Status/Value, Category/Title&$expand=Category, Status'
    const requestUrl = `${webAbsoluteUrl}/_vti_bin/listdata.svc/Advertisements?${filter}&${fields}`;
    console.log(requestUrl)

    $.ajax({
        url: requestUrl,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        async: false,
        success: function (data) {
            console.log(data.d);
            listItemType = data.d.results[0].__metadata.type;
            fillAdvertisementData(data.d.results[0]);
        },
        error: function (err) {
            console.log("There was an error" + err);
            $('div.container > div.title').html('Item you are looking for does not exist...');
        }
    });

}