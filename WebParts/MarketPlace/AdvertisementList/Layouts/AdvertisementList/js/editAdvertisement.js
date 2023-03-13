let webAbsoluteUrl = _spPageContextInfo.webAbsoluteUrl;

var currentUserId = _spPageContextInfo.userId;
var isAdmin = isGroupMember(webAbsoluteUrl, currentUserId, "Avito Owners");

let listItemType = null;
let isAuthor = false;
let selectedCategoryId = 0;
let attachments = [];


let id = getQueryStringParameter("$id", window.location.search.substring(1)) || null;

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

const getAPIEndpoint = (listName) => {
    return `${_spPageContextInfo.webAbsoluteUrl}/_vti_bin/listdata.svc/${listName}`
}

const selectCategory = () => {

    let selectedValue = $("Select#Categories option:selected").val();
    selectedCategoryId = selectedValue;

}

const displayCategories = (categoryId) => {

    selectedCategoryId = categoryId;

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
    let optionsHTML = '';

    $.each(items, function (index, item) {
        let selectedAttr = ''
        if (item.Id == selectedCategoryId) {
            selectedAttr = 'selected';
        }
        optionsHTML += `<option value="${item.Id}" ${selectedAttr}>${item.Title}</option>`;
    });
    optionsContainer.html(optionsHTML);

}

const deleteImage = (index) => {
    attachments[index].MarkToDelete = true;
    $(`ul.download-images li#${index}`).remove();
}


const deleteMarkedAttachments = () => {

    let deletedAttachments = attachments.filter(item => item.MarkToDelete)

    $.each(deletedAttachments, function (index, item) {

        let requestUrl = `${webAbsoluteUrl}/_api/web/lists/getByTitle('Advertisement')/items('${id}')/AttachmentFiles/getByFileName(${deletedAttachments[index].FileName})"`

        $.ajax({
            url: requestUrl,
            method: "DELETE",
            headers: {
                "X-RequestDigest": $('#__REQUESTDIGEST').val(),
                "X-HTTP-Method": "DELETE",
                "If-Match": "*",
                "Content-Type": "application/json;odata=verbose"
            },
            success: function (data) {
                alert("Item delete successfully");
            },
            error: function (error) {
                console.error("Error updating item: " + JSON.stringify(error));
            }
        });

    });

}


const createNewAttachments = () => {

    let newAttachments = attachments.filter(item => item.isNew);

    $.each(newAttachments, function (index, item) {

        let requestUrl = `${webAbsoluteUrl}/_api/lists/GetByTitle('Advertisement')/items('${id}')/AttachmentFiles/add(FileName='${item.FileName}')`;



    });

    let mainImage = newAttachments.shift();

    var apiUrl = "/_api/web/lists/getbytitle('<list title>')/items(<item id>)/AttachmentFiles/add(FileName='" + fileName + "')";
    var file = files[i];
    var reader = new FileReader();
    reader.onload = function (e) {
        var fileData = e.target.result;
        $.ajax({
            url: apiUrl,
            method: "POST",
            data: fileData,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "content-length": file.size,
            },
            success: function (data) {
                console.log("File uploaded successfully");
            },
            error: function (error) {
                console.log("Error uploading file: " + error);
            }
        });
    };
    reader.readAsArrayBuffer(file);


}

const saveImages = () => {

    deleteMarkedAttachments();

    createNewAttachments();

}

const getAttachments = () => {

    let attachmentsUrls = [];
    const requestURL = `${webAbsoluteUrl}/_vti_bin/listdata.svc/Advertisements(${id})/Attachments`

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
                attachmentsUrls.push({
                    Url: item.__metadata.media_src,
                    FileName: item.Name,
                    MarkToDelete: false,
                    isNew: false
                });
            });
            console.log(attachmentsUrls);
        },
        error: function (err) {
            console.log("There was an error" + err);
        }
    });

    return attachmentsUrls;
}

const updateImagesLayout = () => {

    let imageContainer = $('ul.download-images');
    imageContainer.html('');

    let activeAttachments = attachments.filter(item => !item.MarkToDelete);

    $.each(activeAttachments, function (index, item) {
        imageContainer.append(`
        <li id="${index}">
            <img src="${item.Url}" alt="">
            <img class="delete" src="${webAbsoluteUrl}/_layouts/15/AdvertisementList/img/x.svg" alt="delete-icon" onclick="deleteImage(${index})">
        </li>
        `)
    });

}

const fillAdvertisementData = (data) => {

    let title = $('.edit-title');
    let description = $('edit-description');
    let status = $('.aside-title.title#status');
    let changeBtn = $('#changeStatus');

    title.val(data.Title);
    description.val(data.Description);

    // Admin-panel 
    currentStatus = data.Status.Value;

    status.html(`Status is ${currentStatus}`);
    if (currentStatus == 'Active') {
        changeBtn.html('To moderation');
    }
    else {
        changeBtn.html('Publish');
    }

    // let mainImageUrl = data.Image.replaceAll(' ', '').split(',')[0];

    // let mainImage = {
    //     Url: mainImageUrl,
    //     IsAttachment: false,
    //     FileName: mainImageUrl,
    //     MarkToDelete: false,
    //     isNew: false
    // };

    if (data.Attachments) {
        //attachments = [mainImage, ...getAttachmentUrls()];
        attachments = getAttachments();
    }
    else {
        attachments = [];
    }

    updateImagesLayout(attachments);
    console.log(attachments);

}



const displayAdvertisementInfo = () => {

    let filter = `$filter = Id eq ${id}`;
    let fields = '$select = Id, Title, Description, AuthorId, Created, Image, Attachments, Status/Value, CategoryId&$expand=Status'

    const advertisementsAPIEndpoind = getAPIEndpoint('Advertisements');
    const requestUrl = `${advertisementsAPIEndpoind}?${filter}&${fields}`;
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

            let item = data.d.results[0];

            if (data.d.results.length != 0) {

                isAuthor = currentUserId == data.d.results[0].AuthorId;

                if (isAdmin || isAuthor) {

                    // Admin-panel
                    $('#admin-panel').removeClass('inactive');
                    $('.aside-box.birthday-box').remove();
                    $('div.container#main').removeClass('inactive');

                    if (!isAdmin) {
                        // Status btn
                        $('#changeStatus').remove();
                    }

                    displayCategories(item.CategoryId);
                    fillAdvertisementData(item);
                }
                else {
                    $('div.container > div.title').html("You don't have access to that item...");
                }
            }
            else {
                $('div.container > div.title').html("This item doesn't exist...");
            }

            //listItemType = data.d.results[0].__metadata.type;
            //fillAdvertisementData(data.d.results[0]);
        },
        error: function (err) {
            console.log("There was an error" + err);
            $('div.container > div.title').html("This item doesn't exist...");
        }
    });

}

const deleteAdvertisement = () => {

    const webServerUrl = _spPageContextInfo.webAbsoluteUrl;
    const requestUrl = `${webServerUrl}/_api/web/lists/getbytitle('Advertisements')/Items(${id})`;

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
                window.location.href = `${webServerUrl}`
            },
            error: function (error) {
                console.error("Error updating item: " + JSON.stringify(error));
            }
        });
    }
}

const selectFiles = () => {

    let files = $('#file-upload')[0].files;

    $.each(files, function (index, file) {
        if (attachments.filter(item => !item.MarkToDelete).length < 3) {

            let imageType = /^image\//;

            if (imageType.test(file.type)) {

                attachments.push({
                    Url: URL.createObjectURL(file),
                    IsAttachment: true,
                    FileName: file.name,
                    MarkToDelete: false,
                    isNew: true,
                    data: file
                });

            }
        }
        else {
            alert('You have already added 3 images!');
        }

    });

    console.log(attachments);
    updateImagesLayout(attachments);

}

$(document).ready(function () {

    if (id) {
        // edit
        $('div.container > div.title').html('Edit Advertisement');
        displayAdvertisementInfo();
    }
    else {
        // create
        $('div.container > div.title').html('Create Advertisement');
        $('div.container#main').removeClass('inactive');
    }

});



