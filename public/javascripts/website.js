
var id = '59dc71079e016882d2eebeea';
var tableStatusContent = '';

insertData();

function insertData (){
    $.getJSON( '/websites/getstatus/' + id,function( objects ) {
        websitedata = objects;
        console.log(websitedata);

        //For each item in our JSON add a table row and cells to the content string
        $.each(websitedata, function(){
            //tableContent += '<table>';
            tableStatusContent += '<tr>';
            tableStatusContent += '<td>' +this.date +'</td>';
            tableStatusContent += '<td>' +this.status +  '</td>';
            tableStatusContent += '<td>' +this.responsetime + ' ms' + '</td>';
            tableStatusContent += '</tr>';
            tableStatusContent += '</table>';

        });
        $('StatusData table tbody').html(tableStatusContent);
    });
}
