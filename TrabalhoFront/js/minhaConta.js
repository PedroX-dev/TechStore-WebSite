const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach(header => {
    
    header.addEventListener("click", () => {
        const accordionItem = header.parentElement;
        const isAlreadyActive = accordionItem.classList.contains("active");

        accordionHeaders.forEach(h => {
            h.parentElement.classList.remove("active");
        });

        if (!isAlreadyActive) {
            accordionItem.classList.add("active");
        }
    });
});