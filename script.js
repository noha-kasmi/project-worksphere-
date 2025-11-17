const burgerIcon = document.getElementById('burger-icon');
const sidebar = document.getElementById('sidebar');

burgerIcon.addEventListener('click', function() {
    this.classList.toggle('active');
    sidebar.classList.toggle('active');
});

document.addEventListener('click', function(event) {
    if (!sidebar.contains(event.target) && !burgerIcon.contains(event.target) && sidebar.classList.contains('active')) {
        burgerIcon.classList.remove('active');
        sidebar.classList.remove('active');
    }
});


