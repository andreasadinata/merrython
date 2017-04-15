function displaySearchResults(data) {
    var buildTheHtmlOutput = "";
    var assetNamesDisplayedSoFar = [];
    $.each(data.results, function (dataKey, dataValue) {
        if (dataValue.assetName !== "") {
            if (assetNamesDisplayedSoFar.indexOf(dataValue.assetName) == -1) {
                if (dataValue.assetName !== 'Price') {
                    var utcDate = dataValue.activityStartDate;
                    buildTheHtmlOutput += '<li class="active-api-call-result">';
                    buildTheHtmlOutput += '<div class="js-active-event-name">';
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
                    var modifiedDate = new Date(utcDate);
                    buildTheHtmlOutput += (modifiedDate.getMonth() + 1) + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();
                    //buildTheHtmlOutput += new Date(utcDate);
                    buildTheHtmlOutput += '<div>';
                    buildTheHtmlOutput += '<div class="description">';
                    var showDescription = dataValue.assetDescriptions[0];
                    if (showDescription === undefined) {
                        buildTheHtmlOutput += "";
                    } else {

                        //                        exclude the event details text

                        var DescriptionWithoutEventDetails = dataValue.assetDescriptions[0].description.split("Event details and schedule");

                        if (DescriptionWithoutEventDetails[0] != '') {
                            buildTheHtmlOutput += DescriptionWithoutEventDetails[0];
                        }
                        if (DescriptionWithoutEventDetails[1] != '') {
                            buildTheHtmlOutput += DescriptionWithoutEventDetails[1];
                        }
                        //buildTheHtmlOutput += dataValue.assetDescriptions[0].description;
                    }
                    buildTheHtmlOutput += '<div>';
                    buildTheHtmlOutput += '</li>';

                    assetNamesDisplayedSoFar.push(dataValue.assetName);
                }
            }
        }
        console.log(assetNamesDisplayedSoFar);
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
            var createTheHtmlOutput = "";

            var maxLimitForLoop = 10;
            if (result.length < 10) {
                maxLimitForLoop = result.length;
            }

            for (i = 0; i < maxLimitForLoop; i++) {
                var backLoop = (result.length - 1) - i;

                createTheHtmlOutput += '<li class="comment-list">';
                createTheHtmlOutput += '<div class="username">';
                createTheHtmlOutput += result[backLoop].username;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '<div class="eventName">';
                createTheHtmlOutput += result[backLoop].eventName;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '<div class="userlocation">';
                createTheHtmlOutput += result[backLoop].userLocation;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '<div class="postDate">';
                createTheHtmlOutput += result[backLoop].postDate;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '<div class="userComment">';
                createTheHtmlOutput += result[backLoop].userComment;
                createTheHtmlOutput += '<div>';
                createTheHtmlOutput += '</li>';
            }
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
    var dateArray = dateString.split(" ");

    var niceDate = "";

    for (var niceDateCounter = 1; niceDateCounter <= 3; niceDateCounter++) {
        niceDate += dateArray[niceDateCounter];
        niceDate += " ";
    }

    console.log(niceDate);

    var object = {
        'username': name,
        'userLocation': searchLocation,
        'postDate': niceDate,
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
        .done(function (result) {
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
    $('.js-zipcode').css("margin-top", "20%");
    $('.js-result').hide();
    $('.js-list').hide();
    $('.js-drop-comment').hide();
    $('.thank-you').hide();
    $('.js-zipcode').submit(function (event) {
        $('.js-zipcode').css("margin-top", "10px")
        event.preventDefault();
        var searchLocation = $("#jsLocation").val();
        if (searchLocation === "") {
            alert("Input the location");
        } else {
            callApi(searchLocation);
            $('.js-result').show();
            $('.js-list').show();
            $('.js-drop-comment').show();
            displayComment();
            //            $('.js-submit-comment').button("disable");
            //            var nameLength = $("#js-name").length;
            //            var eventLength = $("#js-event").length;
            //            var commentLength = $("#js-comment").length;
            //            if (nameLength > 0 && eventLength > 0 && commentLength > 0) {
            //                $('js-submit-comment').button("enable");
            //            }
            $('.js-comment-form').submit(function (event) {
                event.preventDefault();
                var event = $("#js-event").val();
                var name = $("#js-name").val();
                var content = $("#js-content").val();
                if (event === "" || name === "" || content === "") {
                    alert("Input the data");
                } else {
                    $('.js-comment-form').hide();
                    $('.thank-you').show();
                    postComment(name, content, event, searchLocation);
                }
            });
        }
    });
});
