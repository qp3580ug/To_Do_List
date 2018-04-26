var deleteButtons = document.querySelectorAll('.delete-button');

deleteButtons.forEach(function(button){

  button.addEventListener('click', function(ev){

    var okToDelete = confirm("Delete task - are you sure?");

    if (!okToDelete) {
      ev.preventDefault();
    }

  })
});
