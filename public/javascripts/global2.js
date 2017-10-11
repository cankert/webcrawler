// websiteList data array for filliung in Info Box
var websiteListData = [];
const notifier = require('node-notifier');
// DOM Ready ==========================================
$(document).ready(function(){

    //Populate the user table on initial page load

    //Username link click
    //$('#websiteList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddWebsite').on('click', addWebsite);

    $('#btnCrawlAll').on('click', crawlAll);

    // Delete Website click link
    $('#websitelist').on('click', 'td a.linkdelwebsite', deleteWebsite);

    // Edit User Info on Click
    //$('#websiteList table tbody').on('click', 'td a.linkcrawlwebsite', crawlNow);
/*
    // Update User Data on button
    $('#btnUpdateUser').on('click', updateUser);
    */

});

setInterval(function(){
    location.reload();
}, 10000);


notifier.notify('Go empty the dishwasher!');


// Functions ==========================================


// Crawl all button
function crawlAll(event){
    event.preventDefault();
    console.log('starting crawl all');
    $.ajax({
        type: 'GET',
        url: ('/crawler/crawl/'),
        data: '',
        }).done(function(response){

            });
//alert('Crawled all');
location.reload();
}



//==================

//

function searchTable() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
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
            'responsetime':'',
            'health':''
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
                //populateTable();
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
    location.reload();
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
            //populateTable();

        });
    }
    else {

        // If they said no to the confirm, do nothing
        return false;
    }
    location.reload();
}
