function displaySearchResults(data) {
    var buildTheHtmlOutput = "";
    $.each(data, function (dataKey, dataValue) {
//        buildTheHtmlOutput += '<li class="result">';
//        buildTheHtmlOutput += '<div class="eventName">';
//        buildTheHtmlOutput += '<div>';
//        buildTheHtmlOutput += '<div class="location">';
//        buildTheHtmlOutput += '<div>';
//        buildTheHtmlOutput += '<div class="date">';
//        buildTheHtmlOutput += '<div>';
//        buildTheHtmlOutput += '<div class="description">';
//        buildTheHtmlOutput += '<div>';
//        buildTheHtmlOutput += '</li>';
    })
    $(".js-result ul").html(buildTheHtmlOutput);
}

function displayComment(name, content, event, date, location) {
    var createTheHtmlOutput = "";
    $.each(data, function (dataKey, dataValue) {
        //        createTheHtmlOutput += '<li class="result">';
        //        createTheHtmlOutput += '<div class="eventName">';
        //        createTheHtmlOutput += '<div>';
        //        createTheHtmlOutput += '<div class="location">';
        //        createTheHtmlOutput += '<div>';
        //        createTheHtmlOutput += '<div class="date">';
        //        createTheHtmlOutput += '<div>';
        //        createTheHtmlOutput += '<div class="description">';
        //        createTheHtmlOutput += '<div>';
        //        createTheHtmlOutput += '</li>';
    })
    $(".js-list ul").html(createTheHtmlOutput);
}

function postComment(name, content, event, location) {
    var date = new Date();
    var dateString = date.toString();

    $.ajax({
            type: "POST",
            dataType: "json",
            //        url
        })
        .done(function () {
            console.info("");
            displayComment(name, content, event, date, location);
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
            //        url:
        })
        .done(function (result) {
            displaySearchResults(data);
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
    $('.js-comment').hide();
    $('.thank-you').hide();

    $(".js-submit-search").submit(function () {
        event.preventDefault;
        var searchLocation = $("#js-location").val();
        if (SearchLocation === "") {
            alert("input the location");
        } else {
            callApi(searchLocation);
            $('.js-result').show();
            $('.js-list').show();
            $('.js-comment').show();
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
