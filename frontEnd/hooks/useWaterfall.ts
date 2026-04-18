import { useState, useEffect, useRef } from "react";

export interface WaterfallOptions {
  containerSelector: string;
  columns?: number;
  gap?: number;
  debounceDelay?: number;
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
    debounceDelay = 200,
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
      return new Promise((resolve) => {
        setTimeout(resolve, 0);
        const images = document.querySelectorAll(`${optionsRef.current.containerSelector} img`);
        if (images.length === 0) return resolve();

        let loadedCount = 0;
        const checkDone = () => {
          loadedCount++;
          if (loadedCount >= images.length) resolve();
        };

        images.forEach((img) => {
          if ((img as HTMLImageElement).complete) {
            checkDone();
          } else {
            img.addEventListener("load", checkDone, { once: true });
            img.addEventListener("error", checkDone, { once: true });
          }
        });
      });
    };

    const waterfallLayout = () => {
      const container = document.querySelector(optionsRef.current.containerSelector) as HTMLElement;
      if (!container) return;

      const items = Array.from(container.children) as HTMLElement[];
      if (items.length === 0) return;

      // Reset all inline styles first
      items.forEach((item) => {
        item.style.position = "";
        item.style.left = "";
        item.style.top = "";
        item.style.width = "";
        item.style.height = "";
      });
      container.style.height = "";

      const containerWidth = container.clientWidth;
      const cols = getColumns();
      const columnWidth = (containerWidth - gap * (cols - 1)) / cols;

      requestAnimationFrame(() => {
        const columnsHeight: number[] = new Array(cols).fill(0);

        items.forEach((item) => {
          const minHeight = Math.min(...columnsHeight);
          const columnIndex = columnsHeight.indexOf(minHeight);

          item.style.position = "absolute";
          item.style.width = `${columnWidth}px`;
          item.style.left = `${columnIndex * (columnWidth + gap)}px`;
          item.style.top = `${minHeight}px`;

          columnsHeight[columnIndex] = minHeight + item.offsetHeight + gap;
        });

        const maxHeight = Math.max(...columnsHeight) - gap;
        container.style.height = `${maxHeight}px`;
      });
    };

    const runLayout = async () => {
      await waitForImagesLoad();
      waterfallLayout();
      setIsLayoutReady(true);
    };

    runLayout();

    const handleResize = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        waterfallLayout();
      }, optionsRef.current.debounceDelay);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [containerSelector, columns, gap, debounceDelay, breakpoints.mobile, breakpoints.tablet]);

  return {
    isLayoutReady
  };
}