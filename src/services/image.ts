export function isImageFile (file: File | null): boolean {
  return Boolean(file && file.type.startsWith('image/'));
}

export function isJpegImage (file: File | null): boolean {
  return isImageFile(file) && file!.type === 'image/jpeg';
}

export enum ExifOrientation {
  original = 1,
  deg90 = 6,
  deg180 = 3,
  deg270 = 8,
  flipped = 2,
  deg90Flipped = 5,
  deg180Flipped = 4,
  deg270Flipped = 7,
  unknown = -1,
}

/**
 * @see http://www.cipa.jp/std/documents/j/DC-008-2012_J.pdf
 */
export async function getOrientation (file: File): Promise<ExifOrientation> {
  const jpeg = 0xffd8;
  const exifMarker = 0xffe1;
  const exifId = 0x45786966; // "E", "X", "I", "F"
  const orderLittleEndian = 0x4949;
  const endianAssertion = 0x002a;
  const orientationTag = 0x0112;
  // tslint:disable:object-literal-sort-keys
  const offsets = {
    app1Marker: 2,
    app1Length: 4,
    exifId: 6,
    tiffHeader: 12,
    byteOrder: 12,
    endianAssertion: 14,
    ifdOffset: 16,
    ifd: {
      tag: 0,
      type: 2,
      count: 4,
      value: 8,
    }
  };
  // tslint:enable:object-literal-sort-keys

  const buffer = await readFileAsArrayBuffer(file);
  const arr = new Uint8Array(buffer);
  const view = new DataView(arr.buffer);

  if (view.getUint16(0, false) !== jpeg) {
    throw new Error('Invalid JPEG format');
  }

  // Exif p.18, 19
  const marker = view.getUint16(offsets.app1Marker, false);
  const id = view.getUint32(offsets.exifId, false);
  if (marker !== exifMarker || id !== exifId) {
    // this JPEG is not Exif
    // thus orientation would not be set
    return -1;
  }

  // TIFF Header p.17
  const littleEndian = view.getUint16(offsets.byteOrder, false) === orderLittleEndian;
  if (view.getUint16(14, littleEndian) !== endianAssertion) {
    throw new Error('Invalid JPEG format');
  }
  const idfDistance = view.getUint32(offsets.ifdOffset, littleEndian);
  const idfOffset = offsets.tiffHeader + idfDistance;

  // IFD p.23
  const numOfIdfFields = view.getUint16(idfOffset, littleEndian);
  const idfValuesOffset = idfOffset + 2;
  const fieldLength = 12;
  for (let i = 0; i < numOfIdfFields; i++) {
    const currentOffset = idfValuesOffset + (i * fieldLength);
    const tag = view.getUint16(currentOffset, littleEndian);
    if (tag === orientationTag) {
      const valueOffset = currentOffset + offsets.ifd.value;
      const orientation = view.getUint16(valueOffset, littleEndian);
      return orientation;
    }
  }

  // not found
  return -1;
}

function readFileAsArrayBuffer (file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

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
