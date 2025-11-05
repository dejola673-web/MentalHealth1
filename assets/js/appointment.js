document.getElementById("appointmentForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("patientName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const date = document.getElementById("date").value;
  const department = document.getElementById("department").value;
  const doctor
   = document.getElementById("doctor").value;

  if (!name || !email || !phone || !date || !department) {
    alert("Please fill in all required fields.");
    return;
  }

  const response = document.getElementById("responseMessage");
  response.textContent = `✅ Appointment booked successfully for ${name} in ${department} on ${date}.`;
  response.style.display = "block";

  document.getElementById("appointmentForm").reset();
});
