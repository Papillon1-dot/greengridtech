// Mobile menu
var menuBtn = document.getElementById('menuBtn');
var navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', function(){
  var open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navLinks.addEventListener('click', function(e){
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(function(btn){
  btn.addEventListener('click', function(){
    var item = btn.parentElement;
    var open = item.getAttribute('data-open') === 'true';
    item.setAttribute('data-open', String(!open));
    btn.setAttribute('aria-expanded', String(!open));
  });
});

// Waitlist form → EmailJS (sends each signup to the founder's inbox)
(function(){
  var EMAILJS_SERVICE  = "service_xvgncuq";
  var EMAILJS_TEMPLATE = "template_ntb6wos";
  var EMAILJS_PUBLIC   = "JtijLbLZydVBt0K7h";

  if (window.emailjs) { emailjs.init({ publicKey: EMAILJS_PUBLIC }); }

  var form   = document.getElementById('wlForm');
  var card   = document.getElementById('wlCard');
  var btn    = form.querySelector('.wl-submit');
  var errBox = document.getElementById('wlError');

  function showError(msg){
    errBox.textContent = msg;
    errBox.classList.add('show');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    errBox.classList.remove('show');

    var checked = form.querySelector('input[name="irrigation"]:checked');
    var params = {
      name:       document.getElementById('f-name').value.trim(),
      phone:      document.getElementById('f-phone').value.trim(),
      location:   document.getElementById('f-location').value.trim(),
      crop:       document.getElementById('f-crop').value,
      irrigation: checked ? checked.value : '—',
      time:       new Date().toLocaleString()
    };
    // Pre-formatted summary, so the email is complete even if the
    // EmailJS template only references a single {{message}} field.
    params.message =
      "New SWMS waitlist signup\n\n" +
      "Name: "            + params.name + "\n" +
      "Phone: "           + params.phone + "\n" +
      "Farm location: "   + params.location + "\n" +
      "Crops: "           + params.crop + "\n" +
      "Uses irrigation: " + params.irrigation + "\n" +
      "Submitted: "       + params.time;

    if (!window.emailjs) {
      showError("Couldn't reach the signup service. Please check your connection and try again, or message us on WhatsApp.");
      return;
    }

    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending…";

    emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params, { publicKey: EMAILJS_PUBLIC })
      .then(function(){
        card.classList.add('submitted');
      })
      .catch(function(err){
        btn.disabled = false;
        btn.textContent = label;
        showError("Something went wrong sending your details. Please try again, or message us on WhatsApp.");
        console.error('EmailJS error:', err);
      });
  });
})();

// Scroll reveal (respects prefers-reduced-motion via CSS override)
var observer = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });