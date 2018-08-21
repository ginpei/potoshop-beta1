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

function sleep (ms: number) {
  return new Promise(done => setTimeout(done, ms));
}

/**
 * @see http://www.cipa.jp/std/documents/j/DC-008-2012_J.pdf
 */
export async function getOrientation (file: File): Promise<ExifOrientation> {
  // TODO check why this is called twice

  const jpeg = 0xffd8;
  const exifMarker = 0xffe1;
  const exifId = 0x45786966; // "E", "X", "I", "F"
  const orderLittleEndian = 0x4949;
  const endianAssertion = 0x002a;
  const orientationTag = 0x0112;
  // tslint:disable:object-literal-sort-keys
  const offsets = {
    firstMarker: 2,
    segment: {
      marker: 0,
      length: 2,
      exifId: 4,
    },
    tiffHeader: {
      fromSegment: 10,
      byteOrder: 0,
      endianAssertion: 2,
      ifdOffset: 4,
    },
    ifd: {
      fromTiffHeader: -1,
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
    throw new Error('Invalid JPEG format: first 2 bytes');
  }

  // APPx/Exif p.18, 19
  // - marker (short) `0xffe1` = APP1
  // - length (short) of segment
  // - padding (short) `0x0000` if exif
  // - "EXIF" (char[4]) if exif
  // - content
  // (The doc describe APP1 have to lay next to the SOI,
  //  however, Photoshop renders a JPEG file that SOI is followed by APP0.)
  let segmentPosition = offsets.firstMarker;
  while (true) {
    // just in case
    await sleep(1);

    const marker = view.getUint16(segmentPosition + offsets.segment.marker, false);
    if (marker === exifMarker) {
      const id = view.getUint32(segmentPosition + offsets.segment.exifId, false);
      if (id === exifId) {
        // found, yay!
        break;
      } else {
        console.warn('APP1 is not exif format', `0x${marker.toString(16)}, 0x${id.toString(16)}`);
        return -1;
      }
    }

    const offsetLength = offsets.segment.length;
    const length = offsetLength + view.getUint16(segmentPosition + offsetLength, false);
    segmentPosition += length;

    if (segmentPosition > view.byteLength) {
      console.warn('APP1 not found');
    return -1;
  }
  }
  const tiffHeaderOffset = segmentPosition + offsets.tiffHeader.fromSegment;

  // TIFF Header p.17
  // - byte order (short). `0x4949` = little, `0x4d4d` = big
  // - 42 (0x002a) (short)
  // - offset of IFD (long). Minimum is `0x00000008` (8).
  const littleEndian = view.getUint16(tiffHeaderOffset + offsets.tiffHeader.byteOrder, false) === orderLittleEndian;
  const endianAssertionValue = view.getUint16(tiffHeaderOffset + offsets.tiffHeader.endianAssertion, littleEndian);
  if (endianAssertionValue !== endianAssertion) {
    throw new Error(`Invalid JPEG format: littleEndian ${littleEndian}, assertion: 0x${endianAssertionValue}`);
  }
  const idfDistance = view.getUint32(tiffHeaderOffset + offsets.tiffHeader.ifdOffset, littleEndian);
  const idfPosition = tiffHeaderOffset + idfDistance;

  // IFD p.23
  // - num of IFD fields (short)
  // - IFD:
  //   - tag (short)
  //   - type (short)
  //   - count (long)
  //   - value offset (long)
  // - IFD...
  const numOfIdfFields = view.getUint16(idfPosition, littleEndian);
  const idfValuesPosition = idfPosition + 2;
  const fieldLength = 12;
  for (let i = 0; i < numOfIdfFields; i++) {
    const currentOffset = i * fieldLength;
    const tag = view.getUint16(idfValuesPosition + currentOffset, littleEndian);
    if (tag === orientationTag) {
      const valueOffset = currentOffset + offsets.ifd.value;
      const orientation = view.getUint16(idfValuesPosition + valueOffset, littleEndian);
      return orientation;
    }
  }

  // not found
  console.warn('Rotation information was not found');
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
