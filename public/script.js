document.getElementById('toggle-btn').addEventListener('click', function() {
  document.getElementById('login-card').classList.add('hidden');
  document.getElementById('registration-card').classList.remove('hidden');
});

document.getElementById('toggle-btn-back').addEventListener('click', function() {
  document.getElementById('registration-card').classList.add('hidden');
  document.getElementById('login-card').classList.remove('hidden');
});