function getMessage() {
   $("#msg").html("Transmitting data, wait a few seconds..");
   name = $("#tag_name").val();
   read = $("#tag_read").val();
   write = $("#tag_write").val();

   $.ajax({
      type:'POST',
      url:'/api/newtag',
      data: {name: name, read: read, write: write},
      headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success:function(data) {
         $("#msg").html(data.msg);
      }
   });
 }