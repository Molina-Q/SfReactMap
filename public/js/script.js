// my delete buttons
const deleteBtn = document.getElementsByClassName("delete-btn");

// open a confirm modal on click on a delete action
for (const openDelete of deleteBtn) {
    openDelete.addEventListener('click', (e) => (confirm("Do you really want to delete this ?") ? '' : e.preventDefault()));
}   

// showCheckedCategory
const formEquip = document.getElementById('topic_form_Equipment');
const formArticle = document.getElementById('topic_form_Article');

// my forms
const forms = [
    { 
        label: formEquip,
        other: formArticle
    },
    { 
        label: formArticle,
        other: formEquip
    }
];

// check the value of the input on change, if it is empty nothing happens if it has any value it will set the value of the other input empty 
for (const openForm of forms) {
    openForm.label.addEventListener('change', () => {

        //make the changed input required and remove it from the other input
        openForm.label.setAttribute('required', 'true');
        openForm.other.removeAttribute('required');

        // loop on the childrens of the changed input
        for (const input of openForm.label.children) {
            // give them an event on click to check them
            input.addEventListener('click', () => {
                input.checked = true;
            })
        }

        // loop on the children of the other input
        for (const input of openForm.other.children) {
            // remove theire check and the required attribut from them
            input.checked = false;
            input.removeAttribute('required');
        }
    });
}
