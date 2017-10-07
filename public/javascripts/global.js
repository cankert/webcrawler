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

    $('#btnCrawlAll').on('click', crawlAll);

    // Delete Website click link
    $('#websiteList').on('click', 'td a.linkdelwebsite', deleteWebsite);

    // Edit User Info on Click
    $('#websiteList table tbody').on('click', 'td a.linkcrawlwebsite', crawlNow);
/*
    // Update User Data on button
    $('#btnUpdateUser').on('click', updateUser);
    */
});

setInterval(function(){
    populateTable();
}, 2000);


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
        $.each(websiteListData, function(){
            var statusCode = [];
            var responseTime = [];

            tableContent += '<h1>'+this.website + '</h1><a href="#" class="linkdelwebsite" rel="' + this._id + '">'+'Delete</a>';
            tableContent += '<table>';
            tableContent += '<th>Datum</th>';
            tableContent += '<th>URL</th>';
            tableContent += '<th>Statuscode</th>';
            tableContent += '<th>Responsetime</th>';
            tableContent += '<tr>';
            tableContent += '</tr>';
            tableContent += '</table>';
            tableContent += 'WOOOOOOO'
            // Ab hier sollte eigentlich das Jquery für die Statusabfrage starten und TDs befüllen
            var id = this._id;

            $.getJSON( '/websites/getstatus/' + id,function( data ) {

                    websitedata = data;

                    // For each item in our JSON add a table row and cells to the content string
                    /*$.each(websitedata, function(){
                        console.log('TEST');
                        tableContent += '<td>' +this.date +'</td>';
                        tableContent += '<td>' +this.url +  '</td>';
                        tableContent += '<td>' +this.status +  '</td>';
                        tableContent += '<td>' +this.responsetime + ' ms' + '</td>';


                    });*/
            });

        });




        $('#websiteList').html(tableContent);

        // Inject the whole content string into our existing HTML table

    });
}

//==================

function getStatus(id){


}



// Crawl all button
function crawlAll(event){
    event.preventDefault();

    //jquery AJAX Call for json
    $.getJSON( '/websites/websitelist',function( data ) {

        // Stick our user data array into a websiteList variable in the global object
        websiteListData = data;
        console.log(websiteListData);
        $.each(data, function(){
            var websiteToCrawl = this.url;
            var entryId = this._id;

            console.log('starting crawl all');
            $.ajax({
                type: 'GET',
                url: ('/crawler/scrape/'),
                data: {website: websiteToCrawl, id: entryId},
                }).done(function(response){
                    setTimeout(function(){
                        populateTable();
                    }, 2000);

            });
        });
    });


}



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
            'status':'',
            'responsetime':''
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

// Delete Website
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
