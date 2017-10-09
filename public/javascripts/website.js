$.getJSON( '/websites/getstatus/' + id,function( objects ) {
    websitedata = objects;
    //console.log(websitedata);

    //For each item in our JSON add a table row and cells to the content string
    $.each(websitedata, function(){
        //tableContent += '<table>';
        tableStatusContent += '<td>' +this.date +'</td>';
        tableStatusContent += '<td>' +this.status +  '</td>';
        tableStatusContent += '<td>' +this.responsetime + ' ms' + '</td>';
        tableStatusContent += '</tr>';
        tableStatusContent += '</table>';

    });
    $('#websiteStatusData tbody').html(tableContent);
});
