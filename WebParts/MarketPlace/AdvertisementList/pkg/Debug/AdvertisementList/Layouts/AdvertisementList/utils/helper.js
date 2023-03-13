const getUserInfo = (userID) => {   

    const requestURL = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/getuserbyid('${userID}')`;
    
    let userName = undefined;
    let loginName = undefined;
    let userImage = undefined;
    let imageSize = 'L';

    $.ajax({      
        url: requestURL,      
        type: "GET",      
        headers: {      
            "Accept": "application/json; odata=verbose"      
        },   
        async: false,       
        success: function(data) {     
            userName = data.d.Title;  
            loginName = data.d.LoginName;     
        },      
        error: function(err) {      
            console.log("There was an error" + err);     
        }      
    });

    userImage = `${_spPageContextInfo.siteAbsoluteUrl}/_layouts/15/userphoto.aspx?size=${imageSize}&accountname=${loginName}`

    return {
        Name: userName, 
        Image: userImage,
    };
}  

const getUserLink = (userID) => {
    return `${_spPageContextInfo.webAbsoluteUrl}/_layouts/15/userdisp.aspx?ID=${userID}`
}

const getLocalDate = (date, year = false) => {

    let localDate = new Date(date);
    let dateOptions;

    if(year){
        dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    }
    else{
        dateOptions = { day: 'numeric', month: 'long'};
    }

    return localDate.toLocaleDateString("en-ES", dateOptions);

}

const isGroupMember = (webUrl, userId, groupName) => {

    let isAdmin = false;
    const requestUrl = `${webUrl}/_api/web/getuserbyid('${userId}')/groups`

    $.ajax({      
        url: requestUrl,      
        type: "GET",      
        headers: {      
            "Accept": "application/json; odata=verbose"      
        },   
        async: false,       
        success: function(data) {

            $.each(data.d.results, function (index, item) {
                if(item.Title == groupName){
                    isAdmin = true;
                    return;
                }
            });

        },      
        error: function(err) {      
            console.log("There was an error" + err);     
        }      
    });

    return isAdmin;

};

const getQueryStringParameter = (param, query) => {

    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === param) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}