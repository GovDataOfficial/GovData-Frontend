import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getCroppedImg,
  type PixelCrop,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/cropUtils";

// Mock canvas and context
const mockContext = {
  drawImage: vi.fn(),
  imageSmoothingEnabled: false,
  imageSmoothingQuality: "",
};

const mockCanvas = {
  getContext: vi.fn().mockReturnValue(mockContext),
  width: 0,
  height: 0,
  toDataURL: vi.fn().mockReturnValue("data:image/png;base64,mockedImage"),
};

// Mock document.createElement
global.document.createElement = vi.fn().mockImplementation((tagName) => {
  if (tagName === "canvas") {
    return mockCanvas;
  }
  return document.createElement(tagName);
});

describe("cropUtils", () => {
  const validImageSrc = "data:image/png;base64,validImage";
  const invalidImageSrc = "";

  const validCrop: PixelCrop = {
    x: 10,
    y: 20,
    width: 100,
    height: 200,
  };

  const invalidCrop: PixelCrop = {
    x: 10,
    y: 20,
    width: 0, // Invalid width
    height: 200,
  };

  let originalImage: typeof global.Image;

  beforeEach(() => {
    vi.clearAllMocks();

    // Save original Image constructor
    originalImage = global.Image;

    // Mock Image
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      src: string = "";
      naturalWidth: number = 300;
      naturalHeight: number = 400;

      constructor() {
        setTimeout(() => {
          // Consider only validImageSrc as valid, everything else fails
          if (this.src === validImageSrc) {
            this.onload();
          } else {
            this.onerror();
          }
        }, 0);
      }
    } as unknown as typeof Image;
  });

  afterEach(() => {
    // Restore original Image constructor
    global.Image = originalImage;
  });

  describe("getCroppedImg", () => {
    it("should throw error for invalid image source", async () => {
      await expect(getCroppedImg(invalidImageSrc, validCrop)).rejects.toThrow(
        "Image source is required",
      );
    });

    it("should throw error for invalid crop parameters", async () => {
      await expect(getCroppedImg(validImageSrc, invalidCrop)).rejects.toThrow(
        "Crop dimensions must be positive values",
      );
    });

    it("should process image with default dimensions", async () => {
      await getCroppedImg(validImageSrc, validCrop);

      // Since width is below MIN_WIDTH, it will be scaled up
      expect(mockCanvas.width).toBe(200); // Scaled up to MIN_WIDTH
      expect(mockCanvas.height).toBe(400); // Scaled proportionally (200 * 2)

      // Verify drawImage was called twice (once for crop, once for resize)
      expect(mockContext.drawImage).toHaveBeenCalledTimes(2);

      // Verify final output
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png");
    });

    it("should not resize if dimensions are within min and max width limits", async () => {
      // Set crop size between min and max dimensions
      const goodSizeCrop = { x: 10, y: 20, width: 250, height: 300 };

      // Reset drawImage calls count
      mockContext.drawImage.mockClear();

      await getCroppedImg(validImageSrc, goodSizeCrop);

      // Should call drawImage only once (for cropping, no resize needed)
      expect(mockContext.drawImage).toHaveBeenCalledTimes(1);
    });

    it("should handle image loading error", async () => {
      // This will trigger the image.onerror callback
      await expect(getCroppedImg("invalid-src", validCrop)).rejects.toThrow(
        "Failed to load image",
      );
    });
  });

  describe("calculateResizedDimensions", () => {
    it("should maintain dimensions if width is within min and max limits", async () => {
      // We can't directly test private functions, so we'll test through getCroppedImg
      const goodSizeCrop = { x: 10, y: 20, width: 250, height: 300 };

      await getCroppedImg(validImageSrc, goodSizeCrop);

      // For crops within limits, final canvas should match crop dimensions
      expect(mockCanvas.width).toBe(250);
      expect(mockCanvas.height).toBe(300);
    });

    // ===== SCALING DOWN TESTS =====

    it("should scale down if width exceeds maximum", async () => {
      // Create a crop that's too wide
      const wideCrop = { x: 10, y: 20, width: 700, height: 400 };

      mockContext.drawImage.mockClear();
      await getCroppedImg(validImageSrc, wideCrop);

      // Final width should be scaled to max, height scaled proportionally
      expect(mockCanvas.width).toBe(600);
      expect(mockCanvas.height).toBe(342); // 400 * (600/700)

      // Should call drawImage twice (once for crop, once for resize)
      expect(mockContext.drawImage).toHaveBeenCalledTimes(2);
    });

    it("should maintain aspect ratio when scaling down", async () => {
      // Create a crop with a specific aspect ratio
      const wideCrop = { x: 10, y: 20, width: 800, height: 400 };

      mockContext.drawImage.mockClear();
      await getCroppedImg(validImageSrc, wideCrop);

      // Check that aspect ratio is preserved
      const originalRatio = wideCrop.width / wideCrop.height;
      const newRatio = mockCanvas.width / mockCanvas.height;

      // Allow small difference due to rounding
      expect(Math.abs(originalRatio - newRatio)).toBeLessThan(0.01);
      expect(mockCanvas.width).toBe(600);

      // Should call drawImage twice (once for crop, once for resize)
      expect(mockContext.drawImage).toHaveBeenCalledTimes(2);
    });

    // ===== SCALING UP TESTS =====

    it("should scale up if width is below minimum", async () => {
      // Create a crop that's too narrow
      const narrowCrop = { x: 10, y: 20, width: 150, height: 300 };

      mockContext.drawImage.mockClear();
      await getCroppedImg(validImageSrc, narrowCrop);

      // Final width should be scaled to min, height scaled proportionally
      expect(mockCanvas.width).toBe(200);
      expect(mockCanvas.height).toBe(400); // 300 * (200/150)

      // Should call drawImage twice (once for crop, once for resize)
      expect(mockContext.drawImage).toHaveBeenCalledTimes(2);
    });

    it("should maintain aspect ratio when scaling up", async () => {
      // Create a crop with specific aspect ratio that's below min width
      const narrowCrop = { x: 10, y: 20, width: 100, height: 150 };

      mockContext.drawImage.mockClear();
      await getCroppedImg(validImageSrc, narrowCrop);

      // Check that aspect ratio is preserved
      const originalRatio = narrowCrop.width / narrowCrop.height;
      const newRatio = mockCanvas.width / mockCanvas.height;

      // Allow small difference due to rounding
      expect(Math.abs(originalRatio - newRatio)).toBeLessThan(0.01);
      expect(mockCanvas.width).toBe(200);

      // Should call drawImage twice (once for crop, once for resize)
      expect(mockContext.drawImage).toHaveBeenCalledTimes(2);
    });

    // Test the needsResize function implicitly
    it("should call resize when dimensions differ", async () => {
      // Create a crop that will need resizing (below min width)
      const narrowCrop = { x: 10, y: 20, width: 150, height: 300 };

      mockContext.drawImage.mockClear();
      await getCroppedImg(validImageSrc, narrowCrop);

      // Should call drawImage twice because resize is needed
      expect(mockContext.drawImage).toHaveBeenCalledTimes(2);
    });
  });

  describe("image quality settings", () => {
    it("should use correct smoothing settings for resize", async () => {
      // Reset context properties
      mockContext.imageSmoothingEnabled = false;
      mockContext.imageSmoothingQuality = "low";

      // Force resize by using dimensions greater than limits
      const largeCrop = { x: 10, y: 20, width: 700, height: 500 };

      await getCroppedImg(validImageSrc, largeCrop);

      // Verify smoothing settings were applied
      expect(mockContext.imageSmoothingEnabled).toBe(true);
      expect(mockContext.imageSmoothingQuality).toBe("high");
    });

    it("should use correct output format", async () => {
      await getCroppedImg(validImageSrc, validCrop);

      // Verify output format
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png");
    });
  });
});
