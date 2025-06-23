$(document).ready(function() {
    // Sorting functionality
    let postBoxes = $('.post-box');
    postBoxes.sort(function(a, b) {
        let numA = $(a).find('.post-numbers').text().replace('#', '');
        let numB = $(b).find('.post-numbers').text().replace('#', '');
        return parseInt(numB) - parseInt(numA);
    });
    $('.post').append(postBoxes);

    // Filter functionality
    $(".filter-item").click(function() {
        // Remove active class from all and add to clicked
        $(".filter-item").removeClass("active-filter");
        $(this).addClass("active-filter");

        // Get filter value from class
        let filterValue = $(this).text().toLowerCase();
        
        if (filterValue === "home") {
            $(".post-box").show("1000");
            $(".banner-1").show(); // Show banner for home
        } else if (filterValue === "all") {
            $(".post-box").show("1000");
            $(".banner-1").hide(); // Hide banner for all
        } else if (filterValue === "deals") {
            $(".post-box").hide("1000");
            $(".post-box." + filterValue).show("1000");
            $(".banner-1").hide(); // Hide banner for deals
        } else {
            $(".post-box").hide("1000");
            $(".post-box." + filterValue).show("1000");
            $(".banner-1").hide(); // Hide banner for other categories
        }
    });
});

// Scroll functionality for header
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});