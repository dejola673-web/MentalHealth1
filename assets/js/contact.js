document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  const response = document.getElementById("responseMessage");
  response.textContent = `Thank you, ${name}! Your message has been received.`;
  response.style.display = "block";

  document.getElementById("contactForm").reset();
});