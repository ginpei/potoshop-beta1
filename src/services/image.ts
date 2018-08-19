import imageState from '../store/imageState';

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

export function setImage (image: HTMLImageElement) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  imageState.dispatch({ type: 'SET_ORIGINAL_SIZE', value: { width, height }});
}
