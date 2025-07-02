// Maximum width for the output image
const MAX_WIDTH = 600;

// Minimum width for the output image
const MIN_WIDTH = 200;

/**
 * Types for the image cropping utility
 */
export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * This function crops an image using canvas and returns an optimized base64 encoded string.
 *
 * @param imageSrc - The source of the image to be cropped (base64).
 * @param pixelCrop - The cropped area in pixel values as specified by react-easy-crop.
 * @returns A base64 encoded string of the cropped and resized image.
 */
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: PixelCrop,
): Promise<string> => {
  // Validate inputs
  validateInputs(imageSrc, pixelCrop);

  // Load the image
  const image = await loadImage(imageSrc);

  // Perform cropping
  const croppedCanvas = cropImage(image, pixelCrop);

  // Calculate resized dimensions
  const { finalWidth, finalHeight } = calculateResizedDimensions(
    pixelCrop.width,
    pixelCrop.height,
  );

  // Resize the image if needed
  const finalCanvas = needsResize(
    pixelCrop.width,
    pixelCrop.height,
    finalWidth,
    finalHeight,
  )
    ? resizeImage(
        croppedCanvas,
        pixelCrop.width,
        pixelCrop.height,
        finalWidth,
        finalHeight,
      )
    : croppedCanvas;

  // Return the processed image
  return finalCanvas.toDataURL(`image/png`);
};

/**
 * Validates the required inputs
 */
const validateInputs = (imageSrc: string, pixelCrop: PixelCrop): void => {
  if (!imageSrc) {
    throw new Error("Image source is required");
  }

  if (!pixelCrop) {
    throw new Error("Crop parameters are required");
  }

  if (pixelCrop.width <= 0 || pixelCrop.height <= 0) {
    throw new Error("Crop dimensions must be positive values");
  }
};

/**
 * Crops the image according to the provided crop area
 */
const cropImage = (
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context is not available");
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas;
};

/**
 * Calculates the dimensions for resizing while preserving aspect ratio
 * Only considers width constraints, height adjusts accordingly
 */
const calculateResizedDimensions = (
  width: number,
  height: number,
): { finalWidth: number; finalHeight: number } => {
  let finalWidth = width;
  let finalHeight = height;
  const aspectRatio = width / height;

  // Handle maximum width (scale down if too large)
  if (finalWidth > MAX_WIDTH) {
    finalWidth = MAX_WIDTH;
    finalHeight = Math.floor(finalWidth / aspectRatio);
  }

  // Handle minimum width (scale up if too small)
  if (finalWidth < MIN_WIDTH) {
    finalWidth = MIN_WIDTH;
    finalHeight = Math.floor(finalWidth / aspectRatio);
  }

  return { finalWidth, finalHeight };
};

/**
 * Checks if the image needs resizing
 */
const needsResize = (
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number,
): boolean => {
  // Resize is needed if either dimension is different
  return targetWidth !== originalWidth || targetHeight !== originalHeight;
};

/**
 * Resizes the image to the specified dimensions
 */
const resizeImage = (
  sourceCanvas: HTMLCanvasElement,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Resize canvas context is not available");
  }

  // Use better quality image resizing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    sourceCanvas,
    0,
    0,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return canvas;
};

/**
 * Helper function to load an image and return a Promise
 * @param src - Image source URL or base64 string
 * @returns Promise that resolves with the loaded image
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });
};
