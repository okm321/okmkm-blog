"use client";

import { ModelViewer } from "../ModelViewer";
import classes from "./Introduction.module.scss";

export const Introduction = () => {
	return (
		<div className={classes.introduction}>
			<div className={classes.profile}>
				<div className={classes.profile__image} />
				<p>Hello, I'm a web developer!</p>
				<p>Here's my tech stack!</p>
			<div className={classes.modelViewer}>
				<div className={`${classes.modelViewer__item}`}>
					<ModelViewer
						src={"/react-pi.glb"}
						interactionPrompt="none"
						disableZoom
					/>
				</div>
				<div className={`${classes.modelViewer__item}`}>
					<ModelViewer
						src={"/next-pi.glb"}
						interactionPrompt="none"
						cameraOrbit="160deg 90deg 105%"
						disableZoom
					/>
				</div>
				<div className={`${classes.modelViewer__item}`}>
					<ModelViewer
						src={"/go-pi.glb"}
						interactionPrompt="none"
						cameraOrbit="180deg 90deg 105%"
						disableZoom
					/>
				</div>
				<div className={`${classes.modelViewer__item}`}>
					<ModelViewer
						src={"/vue-pi.glb"}
						interactionPrompt="none"
						cameraOrbit="200deg 90deg 105%"
						disableZoom
					/>
				</div>
				<div className={`${classes.modelViewer__item}`}>
				<ModelViewer
						src={"/nuxt-pi.glb"}
						interactionPrompt="none"
						cameraOrbit="220deg 90deg 105%"
						disableZoom
					/>
				</div>
			</div>
			</div>
		</div>
	);
};
