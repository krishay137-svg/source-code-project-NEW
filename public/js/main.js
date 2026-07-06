document.addEventListener("DOMContentLoaded", () => {

    console.log("EduShare Loaded Successfully");

    // Smooth scrolling for internal anchor links
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

});