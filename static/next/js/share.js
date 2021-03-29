async function share(title, text, url = window.location.href) {
  try {
    if ('navigator' in window) {
      await navigator.share({
        title: title,
        text: text,
        url: url,
      });
    } else {
      copy(url);
    }
  } catch (e) {}
}
