"use client";
import { useRef, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import { portraitCrop, movePortraitCrop } from "../domain/portrait-crop";
import styles from "./profile-portraits.module.css";
export function PortraitCropFrame({
  image,
  source,
  zoom,
  position,
  setPosition,
  pending,
  error,
}: {
  image: HTMLImageElement | null;
  source: string;
  zoom: number;
  position: { x: number; y: number };
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  pending: boolean;
  error: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointer: number;
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);
  const crop = image
    ? portraitCrop(image.naturalWidth, image.naturalHeight, zoom, position.x, position.y)
    : null;
  return (
    <div
      ref={frame}
      className={styles.cropFrame}
      role="group"
      aria-label="Area crop foto 1:1"
      tabIndex={0}
      onPointerDown={(event) => {
        if (!image || pending) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          pointer: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          startX: position.x,
          startY: position.y,
        };
      }}
      onPointerMove={(event) => {
        const start = drag.current;
        if (!start || start.pointer !== event.pointerId || !image || pending) return;
        setPosition(
          movePortraitCrop(
            image.naturalWidth,
            image.naturalHeight,
            zoom,
            start.startX,
            start.startY,
            event.clientX - start.x,
            event.clientY - start.y,
            frame.current!.clientWidth,
          ),
        );
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onLostPointerCapture={() => {
        drag.current = null;
      }}
      onKeyDown={(event) => {
        if (!event.key.startsWith("Arrow") || pending) return;
        event.preventDefault();
        setPosition((current) => ({
          x: Math.max(
            0,
            Math.min(
              1,
              current.x +
                (event.key === "ArrowRight" ? -0.025 : event.key === "ArrowLeft" ? 0.025 : 0),
            ),
          ),
          y: Math.max(
            0,
            Math.min(
              1,
              current.y +
                (event.key === "ArrowDown" ? -0.025 : event.key === "ArrowUp" ? 0.025 : 0),
            ),
          ),
        }));
      }}
    >
      {image && crop ? (
        <Image
          src={source}
          alt="Pratinjau crop foto"
          unoptimized
          draggable={false}
          width={image.naturalWidth}
          height={image.naturalHeight}
          style={{
            position: "absolute",
            maxWidth: "none",
            width: `${(image.naturalWidth / crop.size) * 100}%`,
            height: `${(image.naturalHeight / crop.size) * 100}%`,
            left: `${(-crop.x / crop.size) * 100}%`,
            top: `${(-crop.y / crop.size) * 100}%`,
          }}
        />
      ) : (
        <span className={styles.hint}>
          {error ? "Pilih foto lain untuk melanjutkan." : "Memuat foto..."}
        </span>
      )}
    </div>
  );
}
