define([''], function() {
    $('#btn-entry-logout').on('click', function(e) {
        $.ajax({
            cache: false,
            url: 'api/entry/logout',
            type: 'GET',
            success: function(resp) {
                console.log(resp);
                if(resp.success) {
                    window.location = 'login.html';
                }
            }
        });
    });
});