import { useState, useEffect, useRef } from "react";

export interface WaterfallOptions {
  containerSelector: string;
  columns?: number;
  gap?: number;
  debounceDelay?: number;
  waitForImages?: boolean;
  breakpoints?: {
    mobile: number;
    tablet: number;
  };
}

export function useWaterfall(options: WaterfallOptions) {
  const {
    containerSelector,
    columns = 3,
    gap = 15,
    debounceDelay = 150,
    waitForImages = true,
    breakpoints = { mobile: 768, tablet: 1200 }
  } = options;

  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getColumns = (): number => {
      const width = window.innerWidth;
      const opts = optionsRef.current;
      const bp = opts.breakpoints;
      if (bp && width <= bp.mobile) return 1;
      if (bp && width <= bp.tablet) return 2;
      return opts.columns ?? 2;
    };

    const waitForImagesLoad = (): Promise<void> => {
      const images = document.querySelectorAll(`${optionsRef.current.containerSelector} img`);
      if (images.length === 0) return Promise.resolve();

      const imagePromises = Array.from(images).map((img) => {
        return new Promise<void>((resolve) => {
          if ((img as HTMLImageElement).complete) {
            resolve();
          } else {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }
        });
      });

      return Promise.all(imagePromises).then(() => {});
    };

    const waterfallLayout = () => {
      const container = document.querySelector(optionsRef.current.containerSelector) as HTMLElement;
      if (!container) return;

      const items = Array.from(container.children) as HTMLElement[];
      if (items.length === 0) return;

      const containerWidth = container.clientWidth;
      const cols = getColumns();
      const columnWidth = (containerWidth - gap * (cols - 1)) / cols;

      const columnsHeight: number[] = new Array(cols).fill(0);
      const itemHeights = items.map((item) => item.offsetHeight);

      items.forEach((item, index) => {
        const minHeight = Math.min(...columnsHeight);
        const columnIndex = columnsHeight.indexOf(minHeight);

        item.style.width = `${columnWidth}px`;
        item.style.position = "absolute";
        item.style.left = `${columnIndex * (columnWidth + gap)}px`;
        item.style.top = `${minHeight}px`;

        columnsHeight[columnIndex] =
          minHeight + (itemHeights[index] || 0) + gap;
      });

      const containerHeight = Math.max(...columnsHeight);
      container.style.height = `${containerHeight}px`;

      if (!isLayoutReady) {
        setIsLayoutReady(true);
      }
    };

    const debouncedLayout = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        waterfallLayout();
      }, optionsRef.current.debounceDelay);
    };

    const imageLoadListeners: Array<{
      img: HTMLImageElement;
      listener: () => void;
    }> = [];

    const cleanupImageListeners = () => {
      imageLoadListeners.forEach(({ img, listener }) => {
        img.removeEventListener("load", listener);
      });
      imageLoadListeners.length = 0;
    };

    const setupImageLoadListeners = () => {
      cleanupImageListeners();

      const container = document.querySelector(optionsRef.current.containerSelector);
      if (!container) return;

      const images = container.querySelectorAll("img");
      images.forEach((img) => {
        const htmlImg = img as HTMLImageElement;
        if (!htmlImg.complete) {
          const listener = () => debouncedLayout();
          htmlImg.addEventListener("load", listener);
          imageLoadListeners.push({ img: htmlImg, listener });
        }
      });
    };

    const waterfall = async () => {
      setIsLayoutReady(false);
      cleanupImageListeners();

      if (waitForImages) {
        await waitForImagesLoad();
      }

      waterfallLayout();
      setupImageLoadListeners();
    };

    waterfall();

    const handleResize = () => debouncedLayout();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;
    const containerEl = document.querySelector(containerSelector) as HTMLElement;
    if (containerEl) {
      resizeObserver = new ResizeObserver(debouncedLayout);
      resizeObserver.observe(containerEl);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      cleanupImageListeners();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [containerSelector, columns, gap, debounceDelay, breakpoints.mobile, breakpoints.tablet]);

  return {
    isLayoutReady
  };
}
