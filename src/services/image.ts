export function readImage (file: File): Promise<HTMLImageElement | null> {
  if (!file || !file.type.startsWith('image/')) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      const image = document.createElement('img');
      image.src = url;
      // Firefox sometimes doesn't render immediately
      setTimeout(() => resolve(image), 1);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
