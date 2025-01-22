$(document).on("click", ".btn-danger", function () { //on click delete
    const postID = $(this).attr("post-id");
    const deletionAlert = `
    <div class="alert alert-success alert-dismissible show" role="alert">
        <strong>Post deleted! ❌</strong> 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;

    $.ajax({
        url: "/delete",
        type: "DELETE",
        data: { post_id: postID }, // Send the post_id in the request body
        success: function (response) {
            console.log("Delete successful");
        },
        error: function (xhr, status, error) {
            console.error("Error occurred:", error);
        }
    });

    $(`.card-container .card[post-id="${postID}"]`).remove();

    $(".new-alerts").append(deletionAlert);
    setTimeout(() => {
        $(".new-alerts .alert-success").remove();
    }, 5000);

    const noPostsAlert = `<div class="alert alert-dark alert-dismissible fade show" role="alert">
    <strong>No posts yet! 💤</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    const existingPosts = $(`.card-container`).find('div').length > 0;

    if (!existingPosts) {
        $(".new-alerts").append(noPostsAlert);
    }

});