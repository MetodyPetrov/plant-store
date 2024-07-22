export function isValidImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
}

export function formatNumber(num) {
  let [firstPart, secondPart] = parseFloat(num).toFixed(2).split('.');
  if (firstPart.length < 2) {
    firstPart = '0' + firstPart;
  }
  return `${firstPart}.${secondPart}`;
}