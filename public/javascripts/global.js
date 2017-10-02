// Userlist data array for filliung in Info Box
var userListData = [];

// DOM Ready ==========================================
$(document).ready(function(){

    //Populate the user table on initial page load
    populateTable();

    //Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User click link
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    // Edit User Info on Click
    $('#userList table tbody').on('click', 'td a.linkedituser', editUser);

    // Update User Data on button
    $('#btnUpdateUser').on('click', updateUser);
});

// Functions ==========================================

//Fill table with Data
function populateTable() {

    //Empty content string
    var tableContent = '';

    //jquery AJAX Call for json
    $.getJSON( '/users/userlist',function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">Edit</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
}

// Show User info
function showUserInfo(event){

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisId = $(this).attr('rel');

    // Get index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem){ return arrayItem._id; }).indexOf(thisId);

    //Get our User object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

}

// Add User
function addUser(event){
    event.preventDefault();

    //Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val){
        if($(this).val() === '') {errorCount++; }
    });

    //Check and make sure errorCount still at zero
    if(errorCount === 0) {

        //if its is, compile all user info into an object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        };
        console.log('This is the new user');
        console.log(newUser);
        //Use AJAX to post the object to our adduser Service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response){

            // Check for successfal (blank) response
            if (response.msg === '') {
                //Clear the form inputUserAge
                $('#addUser fieldset input').val('');

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
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
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
    var arrayPosition = userListData.map(function(arrayItem){ return arrayItem._id; }).indexOf(thisId);

    //Get our User object
    var thisUserObject = userListData[arrayPosition];

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
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        };

        // Get userId from paragraph as value
        var id = $('#idInfo #userId').val()

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
                $('#addUser fieldset input').val('');

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
