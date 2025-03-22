"use client";

import { type FC, useEffect, useState } from "react";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"model-viewer": MyElementAttributes;
		}
		interface MyElementAttributes {
			id?: string;
			src?: string;
			alt?: string;
			"camera-controls"?: boolean;
			"shadow-intensity"?: string;
			scale?: string;
			"auto-rotate"?: boolean;
			"rotation-per-second"?: string;
			"disable-zoom"?: boolean;
			"auto-rotate-delay"?: number;
			"interaction-prompt"?: string;
			loading?: string;
			children?: React.ReactNode;
		}
	}
}

type ModelViewerProps = {
	/** id */
	id?: string;
	/** 画像ソース */
	src: string;
	/** alt */
	alt?: string;
	/**
	 * カメラコントロール
	 * @description 有効にすると、ユーザーがカメラを操作できるようになる
	 */
	cameraControls?: boolean;
	/** カメラ位置 */
	cameraOrbit?: string;
	/** 影の強さ */
	shadowIntensity?: string;
	/** スケール */
	scale?: string;
	/** 自動回転 */
	autoRotate?: boolean;
	/** 回転速度 */
	rotationPerSecond?: string;
	/** ズーム無効 */
	disableZoom?: boolean;
	/** 自動回転遅延 */
	autoRotateDelay?: number;
	/** インタラクションプロンプト */
	interactionPrompt?: "auto" | "none";
};

export const ModelViewer: FC<ModelViewerProps> = ({
	id,
	src,
	alt,
	cameraControls = true,
	cameraOrbit,
	shadowIntensity = "1",
	scale = "1 1 1",
	autoRotate = true,
	rotationPerSecond = "0deg",
	disableZoom,
	autoRotateDelay,
	interactionPrompt,
}) => {
	const [randomOrbit, _] = useState("150deg 90deg 105%");

	useEffect(() => {
		// クライアントサイドでのみランダム値を生成
		// setRandomOrbit(`${Math.ceil(Math.random() * 360)}deg 90deg 105%`);
	}, []);
	return (
		<model-viewer
			id={id}
			src={src}
			alt={alt}
			camera-controls={cameraControls}
			camera-orbit={cameraOrbit || randomOrbit}
			shadow-intensity={shadowIntensity}
			scale={scale}
			auto-rotate={autoRotate}
			rotation-per-second={rotationPerSecond}
			disable-zoom={disableZoom}
			auto-rotate-delay={autoRotateDelay || 0}
			interaction-prompt={interactionPrompt}
		>
			<div
				slot="progress-bar"
				style={{
					display: "none",
					visibility: "hidden",
				}}
			/>
		</model-viewer>
	);
};
