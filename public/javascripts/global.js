// websiteList data array for filliung in Info Box
var websiteListData = [];

// DOM Ready ==========================================
$(document).ready(function(){

    //Populate the user table on initial page load
    populateTable();

    //Username link click
    //$('#websiteList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddWebsite').on('click', addWebsite);

    // Delete Website click link
    $('#websiteList table tbody').on('click', 'td a.linkdelwebsite', deleteWebsite);

    // Edit User Info on Click
    $('#websiteList table tbody').on('click', 'td a.linkcrawlwebsite', crawlNow);
/*
    // Update User Data on button
    $('#btnUpdateUser').on('click', updateUser);
    */
});

// Functions ==========================================

//Fill table with Data
function populateTable() {

    //Empty content string
    var tableContent = '';

    //jquery AJAX Call for json
    $.getJSON( '/websites/websitelist',function( data ) {

        // Stick our user data array into a websiteList variable in the global object
        websiteListData = data;

        // For each item in our JSON add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' +this.website +  '</td>';
            tableContent += '<td>' +this.url +  '</td>';
            tableContent += '<td>' +this.status +  '</td>';
            tableContent += '<td>' +this.responsetime + ' ms' + '</td>';
            tableContent += '<td><a href="#" class="linkcrawlwebsite" id="' + this._id + '" rel="' + this.url + '">Crawl now</a></td>';
            tableContent += '<td><a href="#" class="linkdelwebsite" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#websiteList table tbody').html(tableContent);
    });
}

//==================
// Crawl all button
/*function crawlAll(event){
    event.preventDefault();

    //jquery AJAX Call for json
    $.getJSON( '/websites/websitelist',function( data ) {

        // Stick our user data array into a websiteList variable in the global object
        websiteListData = data;

        $.each(data, function(){
            var websiteToCrawl = this.url;
            var entryId = this._Id;

            console.log('starting crawl all');
            $.ajax({
                type: 'GET',
                url: ('/crawler/scrape/'),
                data: {website: websiteToCrawl, id: entryId},
                }).done(function(response){
                populateTable();
                });
        });
    }
)};
*/

//==================


// Crawl now function
function crawlNow(event){
    event.preventDefault();
    var websiteToCrawl = $(this).attr('rel');
    var entryId = $(this).attr('id');

    console.log('Click received');
    $.ajax({
        type: 'GET',
        url: ('/crawler/scrape/'),
        data: {website: websiteToCrawl, id: entryId},
        }).done(function(response){
        populateTable();
    });
}


// Show User info
/*
function showUserInfo(event){

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisId = $(this).attr('rel');

    // Get index of object based on id value
    var arrayPosition = websiteListData.map(function(arrayItem){ return arrayItem._id; }).indexOf(thisId);

    //Get our User object
    var thisUserObject = websiteListData[arrayPosition];

    //Populate Info box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

}*/

// Add User
function addWebsite(event){
    event.preventDefault();

    //Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addWebsite input').each(function(index, val){
        if($(this).val() === '') {errorCount++; }
    });

    //Check and make sure errorCount still at zero
    if(errorCount === 0) {

        //if its is, compile all user info into an object
        var newWebsite = {
            'website': $('#addWebsite fieldset input#inputWebsiteName').val(),
            'url': $('#addWebsite fieldset input#inputWebsiteUrl').val(),
            'lastdowntime':''
        };
        console.log('This is the new user');
        console.log(newWebsite);
        //Use AJAX to post the object to our addWebsite Service
        $.ajax({
            type: 'POST',
            data: newWebsite,
            url: '/websites/addwebsite',
            dataType: 'JSON'
        }).done(function(response){

            // Check for successfal (blank) response
            if (response.msg === '') {
                //Clear the form inputUserAge
                $('#addWebsite fieldset input').val('');

                //Update the table
                populateTable();
            }
            else{
                //If something goes wrong, alert the error messag that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else{
        //if error Count is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
}

// Delete User
function deleteWebsite(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Website?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/websites/deletewebsite/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });
    }
    else {

        // If they said no to the confirm, do nothing
        return false;
    }
}

//Edit User Info -> Show in Table
function editUser(event){
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisId = $(this).attr('rel');

    // Get index of object based on id value
    var arrayPosition = websiteListData.map(function(arrayItem){ return arrayItem._id; }).indexOf(thisId);

    //Get our User object
    var thisUserObject = websiteListData[arrayPosition];

    //Populate edit User Box
    $('#inputUserName').val(thisUserObject.username);
    $('#inputUserEmail').val(thisUserObject.email);
    $('#inputUserFullname').val(thisUserObject.fullname);
    $('#inputUserAge').val(thisUserObject.age);
    $('#inputUserGender').val(thisUserObject.gender);
    $('#inputUserLocation').val(thisUserObject.location);
    $('#userId').val(thisUserObject._id);
}

// Update User
function updateUser(event){
    event.preventDefault();

    //Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updateUser input').each(function(index, val){
        if($(this).val() === '') {errorCount++; }
    });

    //Check and make sure errorCount still at zero
    if(errorCount === 0) {

        //if its is, compile all user info into an object
        var updatedUser = {
            'username': $('#addWebsite fieldset input#inputUserName').val(),
            'email': $('#addWebsite fieldset input#inputUserEmail').val(),
            'fullname': $('#addWebsite fieldset input#inputUserFullname').val(),
            'age': $('#addWebsite fieldset input#inputUserAge').val(),
            'location': $('#addWebsite fieldset input#inputUserLocation').val(),
            'gender': $('#addWebsite fieldset input#inputUserGender').val()
        };

        // Get userId from paragraph as value
        var id = $('#idInfo #userId').val();

        //Use AJAX to post the object to our updateuser Service

        $.ajax({
            type: 'PUT',
            data: updatedUser,
            url: ('/users/updateuser/'+ id),
            dataType: 'JSON'
        }).done(function(response){

            // Check for successfal (blank) response
            if (response.msg === '') {
                //Clear the form inputUserAge
                $('#addWebsite fieldset input').val('');

                //Update the table
                populateTable();
            }
            else{
                //If something goes wrong, alert the error messag that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else{
        //if error Count is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
}
