$(document).on("click", ".btn-secondary", function () { //on click edit
    const postID = $(this).attr("post-id");
    const postData = $(`.card[post-id="${postID}"]`).attr(`post-data`);
    $(`#modify-buttons .btn-secondary[post-id="${postID}"]`).remove();

    const saveButton = `<button type="save" class="btn btn-success" post-id ="${postID}">Save</button>`;
    const cancelButton = `<button type="cancel" class="btn btn-primary post-id ="${postID}">Cancel</button>`;
    const input = ` <form id="edit-form"> <input id="edit-input" type="text" name="post_text" required placeholder="${postData}"> </form>`;

    $(`#modify-buttons[post-id="${postID}"]`).prepend(cancelButton); //add cancel button
    $(`#modify-buttons[post-id="${postID}"]`).prepend(saveButton);  //add save button
    $(`.card[post-id = "${postID}"] .card-body .blockquote p`).remove(); //remove previous text temporarily 
    $(`.card[post-id = "${postID}"] .card-body .blockquote`).append(input); //adds text input ready for edits
});


$(document).on("click", ".btn-success", function () { //on click save
    const postID = $(this).attr("post-id");
    const currTime = new Date();
    const formattedDate = currTime.toLocaleDateString();
    const formattedTime = currTime.toLocaleTimeString();
    const postTime = `Posted on ${formattedDate} at ${formattedTime}`;

    const newPostData = $(`#edit-input`).val();
    const emptyAlert = `
            <div class="alert alert-danger alert-dismissible show" role="alert">
                <strong>You made the post empty. Please re enter what you want to post!</strong> 
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
    const successAlert = `
    <div class="alert alert-success alert-dismissible show" role="alert">
        <strong>Post saved! 🗂️</strong> 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

    if (newPostData.length == 0) {
        $(".new-alerts").append(emptyAlert);
        setTimeout(() => {
            $(".new-alerts .alert-danger").remove();
        }, 5000);
    }
    else {

        $.post("/save", { post_text: newPostData, post_id: postID }, function (response) {
            if (response.error) {
                alert("Error saving post: " + response.error);
                return;
            }

            const newPost = `<p>${response.data}</p>`;
            $(`.card[post-id = "${postID}"] .card-body .blockquote #edit-form`).remove(); //remove edit textbox
            $(`.card[post-id = "${postID}"] .card-body .blockquote`).append(newPost); //replace old data with new data
            $(`.card[post-id = "${postID}"] .card-header`).html(`${postTime}`);


            const editButton = `<button type="edit" class="btn btn-secondary" post-id ="${postID}">Edit</button>`;
            $(`#modify-buttons[post-id="${postID}"] .btn-success`).remove(); // Remove Save button
            $(`#modify-buttons[post-id="${postID}"] .btn-primary`).remove(); //remove cancel button
            $(`#modify-buttons[post-id="${postID}"]`).prepend(editButton); //add edit button back

            $(".new-alerts").append(successAlert);
            setTimeout(() => {
                $(".new-alerts .alert-success").remove();
            }, 5000);

        }).fail(function () {
            alert("Failed to save the post.");
        });
    }
});


$(document).on("click", ".btn-primary", function () { //on click cancel
    const postCard = $(this).closest('.card'); // Find the closest parent .card
    const postID = postCard.attr("post-id"); 
    const postData = postCard.attr("post-data"); 
    const editButton = `<button type="edit" class="btn btn-secondary" post-id ="${postID}">Edit</button>`;
    

    $.post("/cancel", { post_text: postData, post_id: postID }, function (response) {
        if (response.error) {
            alert("Error saving post: " + response.error);
            return;
        }

        postCard.find('.card-body .blockquote #edit-form').remove();

        const pElement = postCard.find('.card-body .blockquote p');
        if (pElement.length) {
            pElement.html(postData);  // Restore the content
        } else {
            // In case the <p> doesn't exist anymore, recreate it
            postCard.find('.card-body .blockquote').append(`<p>${postData}</p>`);
        }

        // Remove the save and cancel buttons
        postCard.find('#modify-buttons .btn-success').remove();
        postCard.find('#modify-buttons .btn-primary').remove();

        // Add the edit button back
        postCard.find('#modify-buttons').prepend(editButton);

    }).fail(function () {
        alert("Failed to save the post.");
    });
});