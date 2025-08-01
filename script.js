const resizeBtn = document.getElementById('resize-btn');

resizeBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const body = document.body;

  // Toggle sidebar classes
  body.classList.toggle('sb-expanded');
  body.classList.toggle('sb-collapsed');

  // Toggle icon direction
  const icon = resizeBtn.querySelector('i');
  if (body.classList.contains('sb-collapsed')) {
    icon.classList.remove('bx-chevrons-left');
    icon.classList.add('bx-chevrons-right');
  } else {
    icon.classList.remove('bx-chevrons-right');
    icon.classList.add('bx-chevrons-left');
  }
});

// Highlight active link based on current page
window.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop();

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
