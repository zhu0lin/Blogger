$(document).ready(function () {
    $("#post-form").on("submit", function (event) {
        event.preventDefault();

        // Capture the text from the input
        const postData = { post_text: $("#post-input").val() };

        // Send the POST request
        $.post("/submit", postData, function (response) {
            if (response.error) {
                alert(response.error); // Handle error if any
                return;
            }

            // Create the new card
            const newCard = `
                <div class="card" post-id="${response.ID}" post-data="${response.data}">
                    <div class="card-header">${response.time}</div>
                    <div class="card-body">
                        <blockquote class="blockquote mb-0">
                            <p>${response.data}</p>
                        </blockquote>
                    </div>
                        <div id="modify-buttons" post-id = "${response.ID}">
                            <button type="edit" class="btn btn-secondary" post-id ="${response.ID}">Edit</button>
                            <button type="delete" class="btn btn-danger" post-id ="${response.ID}">Delete</button>
                        </div>
                </div>`;

            const newAlert = `
            <div class="alert alert-success alert-dismissible show" role="alert">
                <strong>New post created! ✅</strong> 
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

            $(".new-alerts .alert-dark:contains('No posts yet!')").remove(); //remove "No posts yet!" alert
            $(".new-alerts").append(newAlert); //pop to alert new post has been made

            setTimeout(() => {
                $(".new-alerts .alert-success").remove();
            }, 5000);


            // Append the new card and clear the input
            $("#card-container").prepend(newCard);
            $("#post-input").val(''); // Clear form input
        }).fail(function () {
            alert("Failed to submit the post.");
        });
    });
});
