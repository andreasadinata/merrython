function displaySearchResults(data) {
    var buildTheHtmlOutput = "";
    $.each(data.results, function (dataKey, dataValue) {
        if (dataValue.assetName !== "") {
            buildTheHtmlOutput += '<li class="result">';
            buildTheHtmlOutput += '<div class="eventName">';
            buildTheHtmlOutput += dataValue.assetName;
            buildTheHtmlOutput += '<div>';
            buildTheHtmlOutput += '<div class="location">';
            buildTheHtmlOutput += '<div class="address">';
            buildTheHtmlOutput += dataValue.place.addressLine1Txt;
            buildTheHtmlOutput += '<div>';
            buildTheHtmlOutput += '<div class="city">';
            buildTheHtmlOutput += dataValue.place.cityName.toUpperCase();
            buildTheHtmlOutput += '<div>';
            buildTheHtmlOutput += '<div>';
            buildTheHtmlOutput += '<div class="date">';
            buildTheHtmlOutput += dataValue.activityStartDate //ask marius about format once again
            buildTheHtmlOutput += '<div>';
            buildTheHtmlOutput += '<div class="description">';
            buildTheHtmlOutput += dataValue.assetDescriptions[0]; //error
            buildTheHtmlOutput += '<div>';
            buildTheHtmlOutput += '</li>';
        }
    })
    $(".js-result ul").html(buildTheHtmlOutput);
}

function displayComment() {
    $.ajax({
            type: "GET",
            dataType: "json",
            url: '/active/'
        })
        .done(function (result) {
            console.log(result);
            console.log(result.length);
            var createTheHtmlOutput = "";
            for (i = 0; i < 10; i++) {
                var backLoop = result.length - i;
                console.log(result[i].username);
                createTheHtmlOutput += '<li>';
                createTheHtmlOutput += '<div class="username">';
                createTheHtmlOutput += result[i].username;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '<div class="eventName">';
                createTheHtmlOutput += result[i].eventName;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '<div class="userlocation">';
                createTheHtmlOutput += result[i].userLocation;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '<div class="postDate">';
                createTheHtmlOutput += result[i].postDate;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '<div class="userComment">';
                createTheHtmlOutput += result[i].userComment;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '</li>';
            }
            //            $.each(result, function (dataKey, dataValue) {
            //                console.log("inside displayComment function");
            //                console.log(result);
            //                createTheHtmlOutput += '<li class="result">';
            //                createTheHtmlOutput += '<div class="username">';
            //                createTheHtmlOutput += '<div>';
            //                createTheHtmlOutput += '<div class="eventName">';
            //                createTheHtmlOutput += '<div>';
            //                createTheHtmlOutput += '<div class="userlocation">';
            //                createTheHtmlOutput += '<div>';
            //                createTheHtmlOutput += '<div class="postDate">';
            //                createTheHtmlOutput += '<div>';
            //                createTheHtmlOutput += '<div class="content">';
            //                createTheHtmlOutput += '<div>';
            //                createTheHtmlOutput += '</li>';
            //            })
            $(".js-list ul").html(createTheHtmlOutput);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

}

function postComment(name, content, event, searchLocation) {
    var date = new Date();
    var dateString = date.toString();
    var object = {
        'username': name,
        'userLocation': searchLocation,
        'postDate': dateString,
        'eventName': event,
        'userComment': content
    }

    $.ajax({
            type: "POST",
            dataType: "json",
            data: JSON.stringify(object),
            contentType: 'application/json',
            url: '/post-comment'
        })
        .done(function (resultresult) {
            console.info("");
            displayComment();
            console.log("inside post Comment");
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            console.log("inside error postComment AJAX")
        });
}

function callApi(inputData) {
    $.ajax({
            type: "GET",
            dataType: "json",
            url: "/activity/" + inputData
        })
        .done(function (result) {
            console.log(result.results);
            displaySearchResults(result);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}


$(document).ready(function () {
    $('.js-result').hide();
    $('.js-list').hide();
    $('.js-drop-comment').hide();
    $('.thank-you').hide();

    $('.js-zipcode').submit(function (event) {
        console.log("hey");
        event.preventDefault();
        var searchLocation = $("#jsLocation").val();
        if (searchLocation === "") {
            alert("input the location");
            console.log("hey");
        } else {
            console.log("hey");
            callApi(searchLocation);
            $('.js-result').show();
            $('.js-list').show();
            $('.js-drop-comment').show();
            $('.js-comment-form').submit(function (event) {
                event.preventDefault();
                $('.thank-you').show();
                var event = $("#js-event").val();
                var name = $("#js-name").val();
                var content = $("#js-content").val();
                postComment(name, content, event, searchLocation);
            });
        }
    });
});
