// html output rendering on top
function displaySearchResults(data) {
    var buildTheHtmlOutput = "";
    var assetNamesDisplayedSoFar = [];
    $.each(data.results, function (dataKey, dataValue) {
        if (dataValue.assetName !== "") {
            if (assetNamesDisplayedSoFar.indexOf(dataValue.assetName) == -1) {
                if (dataValue.assetName !== 'Price') {
                    if (dataValue.assetDescriptions[0].description !== "") {
                        var utcDate = dataValue.activityStartDate;
                        console.log(dataValue);
                        buildTheHtmlOutput += '<li class="active-api-call-result">';
                        //homePageUrlAdr//
                        buildTheHtmlOutput += '<div class="js-active-event-name">';
                        buildTheHtmlOutput += dataValue.assetName;
                        buildTheHtmlOutput += '</div>';
                        buildTheHtmlOutput += '<div class="location">';
                        buildTheHtmlOutput += '<div class="address">';
                        buildTheHtmlOutput += dataValue.place.addressLine1Txt;
                        buildTheHtmlOutput += '</div>';
                        buildTheHtmlOutput += '<div class="city">';
                        buildTheHtmlOutput += dataValue.place.cityName.toUpperCase();
                        buildTheHtmlOutput += '</div>';
                        buildTheHtmlOutput += '</div>';
                        buildTheHtmlOutput += '<div class="date">';
                        var modifiedDate = new Date(utcDate);
                        buildTheHtmlOutput += (modifiedDate.getMonth() + 1) + '/' + modifiedDate.getDate() + '/' + modifiedDate.getFullYear();
                        //buildTheHtmlOutput += new Date(utcDate);
                        buildTheHtmlOutput += '</div>';
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
                        buildTheHtmlOutput += '</div>';
                        buildTheHtmlOutput += '</li>';

                        assetNamesDisplayedSoFar.push(dataValue.assetName);
                    }
                }
            }
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
                createTheHtmlOutput += '</div>';
                createTheHtmlOutput += '<div class="eventName">';
                createTheHtmlOutput += result[backLoop].eventName;
                createTheHtmlOutput += '</div>';
                createTheHtmlOutput += '<div class="userlocation">';
                createTheHtmlOutput += result[backLoop].userLocation;
                createTheHtmlOutput += '</div>';
                createTheHtmlOutput += '<div class="postDate">';
                createTheHtmlOutput += result[backLoop].postDate;
                createTheHtmlOutput += '</div>';
                createTheHtmlOutput += '<div class="userComment">';
                createTheHtmlOutput += result[backLoop].userComment;
                createTheHtmlOutput += '</div>';

                //                createTheHtmlOutput += '<div class="hiddenId" type="hidden">';
                //                createTheHtmlOutput += result[backLoop]._id
                //                createTheHtmlOutput += '<div>';

                //                createTheHtmlOutput += '<form class="delete-form">';
                createTheHtmlOutput += '<input class="hiddenId" type="hidden" value="' + result[backLoop]._id + '">';


                createTheHtmlOutput += '<button class="deleteBox">';
                createTheHtmlOutput += 'Delete';
                createTheHtmlOutput += '</button>';
                //                createTheHtmlOutput += '</form>';

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

//crud api
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
        });
}

function deleteData(DeleteId) {
    $.ajax({
            type: "DELETE",
            dataType: "json",
            contentType: 'application/json',
            url: '/delete-comment/' + DeleteId
        })
        .done(function (result) {
            displayComment();
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function updateData(updatedId) {
    $.ajax({
            type: "PUT",
            dataType: 'json',
            contentType: 'application/json',
            url: '/update-comment/' + updatedId
        })
        .done(function (result) {
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
        event.preventDefault();
        var searchLocation = $("#jsLocation").val();
        if (searchLocation == "") {
            alert("Input the location");
        } else {
            $('.js-top').css("margin-top", "10px");
            $('.js-top').css("font-size", "20px");
            $('.js-zipcode').css("font-size", "12px");
            $('body').css("background-image", "url(images/qp3kOx.jpg)");
            callApi(searchLocation);
            $('.js-result').show();
            $('.js-list').show();
            $('.js-drop-comment').show();
            displayComment();
            $('.js-comment-form').submit(function (event) {
                event.preventDefault();
                var event = $("#js-event").val();
                var name = $("#js-name").val();
                var content = $("#js-content").val();
                if (event === "" || name === "" || content === "") {
                    alert("Input the data");
                } else if (content.length > 160) {
                    alert("Characters more than 160");
                } else {
                    $('.js-comment-form').hide();
                    $('.thank-you').show();
                    postComment(name, content, event, searchLocation);
                }
            });
        };
    });



});

$('.js-list').on('click', '.deleteBox', function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    console.log("inside the deleteBox trigger");
    event.preventDefault();

    var IdToBeDeleted = $(this).parent().parent().find('.hiddenId').val();
    console.log(IdToBeDeleted);
    deleteData(IdToBeDeleted);

});


// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
