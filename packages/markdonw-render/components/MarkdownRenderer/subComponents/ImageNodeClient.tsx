"use client";

import type { RootContentMap } from "mdast";
import { type FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { createPortal } from "react-dom";
import classes from "./ImageNodeClient.module.scss";

export const ImageNodeClient: FC<{ node: RootContentMap["image"] }> = ({
	node,
}) => {
	const [isZoomed, setIsZoomed] = useState(false);
	const [el, setEl] = useState<HTMLElement | null>();

	const handleImageClick = () => {
		if (!isMobile) {
			setIsZoomed(true);
		}
	};

	const handleCloseZoom = () => {
		setIsZoomed(false);
	};

	useEffect(() => {
		setEl(document.getElementById("img-zoom-overlay"));
	}, []);

	useEffect(() => {
		if (isZoomed) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isZoomed]);

	return (
		<>
			<img
				src={node.url}
				alt={node.alt ?? ""}
				className={classes.img}
				onClick={handleImageClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleImageClick();
					}
				}}
				aria-label={`${node.alt || "画像"}を拡大表示`}
			/>
			{isZoomed &&
				el &&
				createPortal(
					<div
						className={classes.zoomOverlay}
						onClick={handleCloseZoom}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								handleCloseZoom();
							}
						}}
					>
						<img
							src={node.url}
							alt={node.alt ?? ""}
							className={classes.zoomedImage}
						/>
					</div>,
					el,
				)}
		</>
	);
};

export const ZoomedImagePortal: FC = () => {
	return <div id="img-zoom-overlay" />;
};
