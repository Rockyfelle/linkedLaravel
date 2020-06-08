function newLink(user_id) {
   $("#msg").html("Transmitting data, wait a few seconds..");
   link = $("#link_link").val();
   name = $("#link_name").val();
   tags = [];
   $("input:checked").each(function(){
      tags.push($(this).attr("id"));
   });

   $.ajax({
      type:'POST',
      url:'/api/newlink',
      data: {link: link, name: name, tags: tags, userId: user_id},
      headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success:function(data) {
         $("#msg").html(data.msg);
      }
   });
}

function tagSharelinkMakeDelete(makedelete, id) {
   $.ajax({
      type:'POST',
      url:'/api/tag/sharelink/makedelete',
      data: {makedelete: makedelete, id: id},
      headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success:function(data) {
         location.reload();
      }
   });
}

function tagAddProceed() {//Add check to see if tag exists in db
   tagName = $('#tagname').val().replace(/[^a-z0-9]/gi,'');
   $('#tagname').val(tagName)
   if (tagName.length > 2 && tagName.length < 17)
   $("#tagAddExpanded").removeClass('d-none');
   console.log("aaa");
}

function tagAddSend(userId) {
   name = $("#tagname").val();
   read = $("#tagread").val();
   write = $("#tagwrite").val();

   $.ajax({
      type:'POST',
      url:'/api/newtag',
      data: {name: name, read: read, write: write, user_id: userId},
      headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success:function(data) {
         console.log(data.msg);
      }
   });
}

// To style only selects with the my-select class
//$('.selectpicker').selectpicker();