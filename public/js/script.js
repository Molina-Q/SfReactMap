const deleteBtn = document.getElementsByClassName("delete-btn");

// open a confirm modal on click on a delete action
for (const openDelete of deleteBtn) {
    openDelete.addEventListener('click', (e) => (confirm("Do you really want to delete this ?") ? '' : e.preventDefault()));
}   
