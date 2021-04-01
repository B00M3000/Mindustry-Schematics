async function share(title, text, url = window.location.href) {
  try {
    if ('navigator' in window && 'share' in navigator) {
      await navigator.share({
        title: title,
        text: text,
        url: url,
      });
    } else {
      await copy(url);
    }
  } catch (e) {}
}
