
$(document).on("click", '[type=checkbox]', function (){
    const checkbox = $(this);
        checkbox.parent().toggleClass("strike");
    ;
});