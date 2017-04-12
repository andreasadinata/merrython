function displaySearchResults(data) {
    var buildTheHtmlOutput = "";
    $.each(data.results, function (dataKey, dataValue) {
        buildTheHtmlOutput += '<li class="result">';
        buildTheHtmlOutput += '<div class="event">';
        buildTheHtmlOutput += dataValue.activityEndDate;
        buildTheHtmlOutput += '<div>';
        buildTheHtmlOutput += '<div class="location">';
        buildTheHtmlOutput += '<div>';
        buildTheHtmlOutput += '<div class="date">';
        buildTheHtmlOutput += '<div>';
        buildTheHtmlOutput += '<div class="description">';
        buildTheHtmlOutput += '<div>';
        buildTheHtmlOutput += '</li>';
    })
    $(".js-result ul").html(buildTheHtmlOutput);
}

function displayComment() {
    $.ajax({
            type: "GET",
            dataType: "json",
            url: '/active/'
        })
        .done(function () {
            //    var createTheHtmlOutput = "";
            //    $.each(data, function (dataKey, dataValue) {
            //        //        createTheHtmlOutput += '<li class="result">';
            //        //        createTheHtmlOutput += '<div class="eventName">';
            //        //        createTheHtmlOutput += '<div>';
            //        //        createTheHtmlOutput += '<div class="location">';
            //        //        createTheHtmlOutput += '<div>';
            //        //        createTheHtmlOutput += '<div class="date">';
            //        //        createTheHtmlOutput += '<div>';
            //        //        createTheHtmlOutput += '<div class="description">';
            //        //        createTheHtmlOutput += '<div>';
            //        //        createTheHtmlOutput += '</li>';
            //    })
            //    $(".js-list ul").html(createTheHtmlOutput);
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
        'userLocation': location,
        'postDate': dateString,
        'eventName': event,
        'userComment': content
    }

    $.ajax({
            type: "POST",
            dataType: "json",
            data: JSON.stringify(object),
            //        contentType: '', why do we need this one?
            url: '/post-commet'
        })
        .done(function () {
            console.info("");
            displayComment();
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
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
            $('.js-submit-comment').submit(function () {
                event.preventDefault;
                $('.thank-you').show();
                var event = $("#js-event").val();
                var name = $("#js-name").val();
                var content = $("#js-content").val();
                postComment(name, content, event, searchLocation);
            });
        }
    });
});
