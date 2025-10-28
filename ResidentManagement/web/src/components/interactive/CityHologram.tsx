"use client";

import { useMemo, useState, type PointerEvent } from "react";
import styles from "./CityHologram.module.css";

interface Tower {
  id: string;
  label: string;
  x: number;
  z: number;
  height: number;
  delay: number;
}

const INITIAL_TILT = { x: -14, y: 16 };

const CityHologram = () => {
  const towers = useMemo<readonly Tower[]>(
    () => [
      { id: "population", label: "Cư trú", x: -110, z: -60, height: 140, delay: 0 },
      { id: "temporary", label: "Tạm trú", x: -30, z: -20, height: 180, delay: 0.1 },
      { id: "security", label: "An ninh", x: 70, z: -30, height: 160, delay: 0.16 },
      { id: "documents", label: "Hồ sơ", x: -80, z: 45, height: 120, delay: 0.22 },
      { id: "analytics", label: "Thống kê", x: 20, z: 60, height: 150, delay: 0.28 },
      { id: "support", label: "Hỗ trợ", x: 110, z: 20, height: 110, delay: 0.34 },
    ],
    [],
  );

  const [tilt, setTilt] = useState(INITIAL_TILT);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const rotateY = ((offsetX / bounds.width) - 0.5) * 32;
    const rotateX = ((offsetY / bounds.height) - 0.5) * -28;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handlePointerLeave = () => {
    setTilt(INITIAL_TILT);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.scene}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className={styles.hologram}
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          <div className={styles.scanline} />
          <div className={styles.floor} />
          <div className={styles.grid} />
          <div className={styles.radar} />
          <div className={styles.ring} />
          <div className={styles.ringSecondary} />
          {towers.map((tower) => (
            <div
              key={tower.id}
              className={styles.tower}
              style={{
                height: `${tower.height}px`,
                transform: `translate3d(${tower.x}px, -${tower.height}px, ${tower.z}px)`,
                animationDelay: `${tower.delay}s`,
              }}
            >
              <span className={styles.towerGlow} />
              <span className={styles.towerLabel}>{tower.label}</span>
            </div>
          ))}
          <div className={styles.beam} />
        </div>
      </div>
      <div className={styles.legend}>
        <p className={styles.legendTitle}>Bản đồ dữ liệu 3D</p>
        <p className={styles.legendSubtitle}>
          Hệ thống mô phỏng trực quan hoạt động của từng phân hệ cư trú trong thời gian thực, tạo cảm giác trung tâm điều hành tương lai.
        </p>
        <ul className={styles.legendItems}>
          <li>Chuyển động nghiêng phản hồi theo con trỏ giúp quan sát 360°.</li>
          <li>Hiệu ứng hologram nhiều lớp thể hiện luồng dữ liệu liên thông.</li>
          <li>Các tháp dữ liệu phát sáng tương ứng các chỉ số trọng yếu.</li>
        </ul>
      </div>
    </div>
  );
};

export default CityHologram;
