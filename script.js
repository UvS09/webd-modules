async function searchUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const info = document.getElementById("info");
  info.innerHTML = '';

  const client_id = "cliend_id";
  const client_secret = "client_secret";

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": "Basic " + btoa(`${client_id}:${client_secret}`)
      }
    });

    
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
      const resetTime = new Date(response.headers.get('x-ratelimit-reset') * 1000);
      info.innerHTML = `⚠️ Rate limited - try again after ${resetTime.toLocaleTimeString()}`;
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      info.innerHTML = `❌ Error: ${errorData.message || response.statusText}`;
      return;
    }

    const data = await response.json();
    
    info.innerHTML = `
      <br>
      <img src="${data.avatar_url}" alt="User Avatar" class="avatar" width="100">
      <p><strong>User:</strong> <a href="${data.html_url}" target="_blank">${data.login}</a></p>
      <hr><br>
      <p><strong>Bio:</strong> ${data.bio || "No bio available"}</p>
      <p><strong>Public Repositories:</strong> <a href="${data.html_url}?tab=repositories" target="_blank">
        ${data.public_repos || "No Public Repo"}
      </a></p>
      <p><strong>Followers:</strong> ${data.followers}</p>
      <p><strong>Following:</strong> ${data.following}</p>
    `;

  } catch (error) {
    console.error("Error:", error);
    info.innerHTML = "⚠️ Network error - check console for details";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchForm").addEventListener("submit", searchUser);
});
