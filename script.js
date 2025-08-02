
document.getElementById('airdrop-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const address = document.getElementById('address').value;
  const twitter = document.getElementById('twitter').value;
  const telegram = document.getElementById('telegram').value;

  const response = await fetch('https://noktra-api.vercel.app/api/airdrop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, twitter, telegram })
  });

  const result = await response.json();
  document.getElementById('message').textContent = result.message || 'Thank you for your submission!';
});

function setLanguage(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
}
