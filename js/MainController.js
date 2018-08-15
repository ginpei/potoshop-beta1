export default class MainController {
  constructor () {
    this.originalWidth = 0;
    this.originalHeight = 0;
    this.scale = 1;
    this.image = null; // as Image
  }

  start (el) {
    this.elOriginalWidth = el.querySelector('.app-originalWidth');
    this.elOriginalHeight = el.querySelector('.app-originalHeight');
    this.elOutputWidth = el.querySelector('.app-outputWidth');
    this.elOutputHeight = el.querySelector('.app-outputHeight');
    this.elScale = el.querySelector('.app-scale');
    this.elAddBorder = el.querySelector('.app-addBorder');
    this.elCanvas = el.querySelector('.app-canvas');

    this.elScale.addEventListener('input', () => this.onScaleInput());
    this.elAddBorder.addEventListener('click', () => this.onAddBorderToggle());

    document.addEventListener('paste', (event) => this.onPaste(event));
  }

  readImage (file) {
    if (!file || !file.type.startsWith('image/')) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result;
        const image = new Image();
        image.src = url;
        // Firefox sometimes doesn't render immediately
        setTimeout(() => resolve(image), 1);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  setImage (image) {
    this.image = image;
    this.scale = 1;

    const width = image.naturalWidth;
    const height = image.naturalHeight;
    this.originalWidth = width;
    this.originalHeight = height;

    this.render();
  }

  render () {
    const width = Math.floor(this.originalWidth * this.scale);
    const height = Math.floor(this.originalHeight * this.scale);
    this.elOriginalWidth.value = this.originalWidth;
    this.elOriginalHeight.value = this.originalHeight;
    this.elOutputWidth.value = width;
    this.elOutputHeight.value = height;
    this.elScale.value = this.scale;
    this.elScale.disabled = !this.image;

    this.elCanvas.width = width;
    this.elCanvas.height = height;
    const context = this.elCanvas.getContext('2d');
    context.drawImage(this.image, 0, 0, width, height);

    if (this.bordered) {
      context.strokeStyle = 'gray';
      context.rect(0, 0, width, height);
      context.stroke();
    }
  }

  onScaleInput () {
    this.scale = this.elScale.value;
    this.render();
  }

  onAddBorderToggle () {
    this.bordered = this.elAddBorder.checked;
    this.render();
  }

  async onPaste (event) {
    const item = event.clipboardData.items[0];
    const file = item.getAsFile();
    const image = await this.readImage(file);
    if (image) {
      this.setImage(image);
    }
  }
}
