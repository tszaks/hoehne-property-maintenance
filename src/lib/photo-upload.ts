export const MAX_ORIGINAL_PHOTO_BYTES = 20 * 1024 * 1024;
export const TARGET_PHOTO_BYTES = 2_800_000;
export const TARGET_PHOTO_MEGABYTES = Math.round(MAX_ORIGINAL_PHOTO_BYTES / 1024 / 1024);

type PreparedPhoto = {
  dataUrl: string;
  name: string;
  compressed: boolean;
};

const DIRECT_SEND_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

export async function prepareProjectPhoto(file: File): Promise<PreparedPhoto> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a photo file.');
  }

  if (file.size > MAX_ORIGINAL_PHOTO_BYTES) {
    throw new Error(`Please choose a photo under ${TARGET_PHOTO_MEGABYTES} MB.`);
  }

  if (file.size <= TARGET_PHOTO_BYTES && DIRECT_SEND_TYPES.has(file.type.toLowerCase())) {
    return {
      dataUrl: await fileToDataUrl(file),
      name: file.name,
      compressed: false,
    };
  }

  return {
    dataUrl: await compressPhoto(file),
    name: file.name,
    compressed: true,
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read that photo. Please try another image.'));
    reader.readAsDataURL(file);
  });
}

async function compressPhoto(file: File): Promise<string> {
  const image = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to prepare that photo. Please try another image.');

  let bestDataUrl = '';
  for (const maxEdge of [1800, 1500, 1200, 1000]) {
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.82, 0.74, 0.66, 0.58]) {
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      bestDataUrl = dataUrl;
      if (dataUrlBytes(dataUrl) <= TARGET_PHOTO_BYTES) return dataUrl;
    }
  }

  if (dataUrlBytes(bestDataUrl) <= TARGET_PHOTO_BYTES * 1.15) return bestDataUrl;
  throw new Error('Unable to prepare that photo. Please try one clear photo or a smaller screenshot.');
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to prepare that photo. Please try a JPEG, PNG, or screenshot.'));
    };
    image.src = url;
  });
}

function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.ceil((base64.length * 3) / 4);
}
