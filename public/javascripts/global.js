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
    //$('#websiteList table tbody').on('click', 'td a.linkcrawlwebsite', crawlNow);
/*
    // Update User Data on button
    $('#btnUpdateUser').on('click', updateUser);
    */

});

setInterval(function(){
    populateTable();
}, 40000);




// Functions ==========================================

//Fill table with Data
function populateTable() {

    //Empty content string
    var tableContent = '';
    var completeTable = '';
    var websiteInfo = getWebsiteList();


    var firstPromise = $.get('/websites/websitelist');
    var secondPromise = $.get('/websites/getstatus/59db53717dc6220ace651185');

    $.when(firstPromise, secondPromise).done(function(firstData, secondData) {
      console.log('Loaded Data');
      websiteInfo = firstData;
    });
    console.log(websiteInfo);

    //jquery AJAX Call for json
    $.getJSON( '/websites/websitelist',function( data ) {
        var tableStatusContent = '';
        var tableContent = '';
        // Stick our user data array into a websiteList variable in the global object
        websiteListData = data;

        // For each item in our JSON add a table row and cells to the content string
        $.each(websiteListData, function(){


            tableContent += '<h1>'+this.website + '</h1><a href="#" class="linkdelwebsite" rel="' + this._id + '">'+'Delete</a>';
            tableContent += '<table>';
            tableContent += '<th>Datum</th>';
            tableContent += '<th>Statuscode</th>';
            tableContent += '<th>Responsetime</th>';
            tableContent += '</table>';

            // Ab hier sollte eigentlich das Jquery für die Statusabfrage starten und TDs befüllen
            var id = this._id;


            $.getJSON( '/websites/getstatus/' + id,function( objects ) {
                websitedata = objects;
                //console.log(websitedata);

                //For each item in our JSON add a table row and cells to the content string
                $.each(websitedata, function(){
                    //tableContent += '<table>';
                    tableStatusContent += '<table>';
                    tableStatusContent += '<tr>';
                    tableStatusContent += '<td>' +this.date +'</td>';
                    tableStatusContent += '<td>' +this.status +  '</td>';
                    tableStatusContent += '<td>' +this.responsetime + ' ms' + '</td>';
                    tableStatusContent += '</tr>';
                    tableStatusContent += '</table>';

                });

            });
            //console.log(tableContent);
            //console.log(tableContent);

        });
        $('#websiteList').html(tableContent);

    });



        // Inject the whole content string into our existing HTML table
        /*var id = '59db2a69d0b57bf34a988bed';
        $.getJSON( '/websites/getstatus/' + id,function( objects ) {
            websitedata = objects;
            console.log(websitedata);
            //For each item in our JSON add a table row and cells to the content string
            $.each(websitedata, function(){
                console.log('TEST');
                //tableContent += '<table>';
                tableContent += '<table>';
                tableContent += '<tr>';
                tableContent += '<td>' +this.date +'</td>';
                tableContent += '<td>' +this.status +  '</td>';
                tableContent += '<td>' +this.responsetime + ' ms' + '</td>';
                tableContent += '</tr>';
                tableContent += '</table>';

            });
            $('#websiteStatusData').html(tableContent);
        });*/

}





//==================

function writeTable (response){
var tableContent = tableHead + tableBody;


$('#websiteList').html(tableContent);

}


function getWebsiteList(){
    return $.ajax({
      url: '/websites/websitelist/',
      type: 'GET',
      dataType: 'jsonp',
      timeout: 3000
    });

}



function getStatus(data){
    var id = data.id;

    return $.ajax({
      url: '/websites/getstatus/' + id,
      type: 'GET',
      dataType: 'json',
      timeout: 3000
    });

    /*
    $.getJSON( '/websites/getstatus/' + id,function( objects ) {
        websitedata = objects;
        console.log(websitedata);
        //For each item in our JSON add a table row and cells to the content string
        $.each(websitedata, function(){
            console.log('TEST');
            //tableContent += '<table>';
            tableContent += '<table>';
            tableContent += '<tr>';
            tableContent += '<td>' +this.date +'</td>';
            tableContent += '<td>' +this.status +  '</td>';
            tableContent += '<td>' +this.responsetime + ' ms' + '</td>';
            tableContent += '</tr>';
            tableContent += '</table>';

        });
    });*/

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
