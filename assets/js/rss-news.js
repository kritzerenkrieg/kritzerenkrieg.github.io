async function loadRSS() {
  try {
    const response = await fetch('https://kritz.my.id/customfeed.xml');
    if (!response.ok) throw new Error('Network response was not ok');

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    const items = xmlDoc.querySelectorAll('item');
    const container = document.getElementById('rss-feed');
    container.innerHTML = ''; // Clear loading text

    // Fix container height, hide overflow (no scroll)
    container.style.height = '440px';
    container.style.overflow = 'hidden';
    container.style.whiteSpace = 'normal'; // Allow wrapping inside items

    // Helper to format pubDate like "Tue, 03 Jun 2025"
    function formatPubDate(pubDateStr) {
      if (!pubDateStr) return '';
      const parts = pubDateStr.split(' ');
      if (parts.length >= 4) {
        return parts.slice(0, 4).join(' ');
      }
      return pubDateStr;
    }

    // Show only first 3 items horizontally
    const maxItems = 3;
    for (let i = 0; i < Math.min(items.length, maxItems); i++) {
      const item = items[i];

      const title = item.querySelector('title')?.textContent || 'No title';
      const link = item.querySelector('link')?.textContent || '#';
      const description = item.querySelector('description')?.textContent || '';

      const rawPubDate = item.querySelector('pubDate')?.textContent || '';
      const pubDate = formatPubDate(rawPubDate);

      const enclosure = item.querySelector('enclosure');
      const imgUrl = enclosure ? enclosure.getAttribute('url') : null;

      const newsItem = document.createElement('div');
      newsItem.classList.add('col-lg-4');  // 3 columns horizontally

      newsItem.innerHTML = `
        <div class="service-item position-relative" data-aos="zoom-in" style="height: 440px; overflow: hidden;">
          <div class="img" style="overflow: hidden;">
            ${imgUrl ? `<img src="${imgUrl}" class="img-fluid" alt="${title}" style="object-fit: cover; width: 100%; height: 230px;">` : ''}
          </div>
          <div style="overflow: hidden;">
            <a href="${link}" class="stretched-link" target="_blank" rel="noopener noreferrer">
              <h3 style="
              font-size: 1.2rem;
              margin: 0;
              margin-top: 16px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              line-height: 1.3em;
              max-height: 2.6em;
              ">${title}</h3>
            </a>
            <p style="
              font-size: 1rem;
              height: 72px;  /* approx 3 lines */
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              margin-top: 0.5rem;
              margin-bottom: 0.5rem;
            ">${description}</p>
            <small>${pubDate}</small>
          </div>
        </div>
      `;

      container.appendChild(newsItem);
    }

    if (items.length === 0) {
      container.innerHTML = '<p>No news items found.</p>';
    }
  } catch (error) {
    const container = document.getElementById('rss-feed');
    if (container) container.innerHTML = 'Failed to load news.';
    console.error('Error loading RSS:', error);
  }
}

window.addEventListener('DOMContentLoaded', loadRSS);
