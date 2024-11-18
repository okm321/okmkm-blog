"use client";

import { ModelViewer } from "../ModelViewer";
import classes from "./Introduction.module.scss";

export const Introduction = () => {
	return (
		<div className={classes.introduction}>
			<div className={classes.profile}>
				<div className={classes.profile__image} />
				<p>エンジニアです</p>
			</div>

			<div className={classes.modelViewer}>
				<div className={`${classes.modelViewer__item} ${classes.first}`}>
					<ModelViewer
						src={"/react-pi.glb"}
						interactionPrompt="none"
						disableZoom
					/>
				</div>
				<div className={`${classes.modelViewer__item} ${classes.second}`}>
					<ModelViewer
						src={"/go-pi.glb"}
						interactionPrompt="none"
						disableZoom
					/>
				</div>
				<div className={`${classes.modelViewer__item} ${classes.third}`}>
					<ModelViewer
						src={"/next-pi.glb"}
						interactionPrompt="none"
						disableZoom
					/>
				</div>
				<div className={`${classes.modelViewer__item} ${classes.fourth}`}>
					<ModelViewer
						src={"/vue-pi.glb"}
						interactionPrompt="none"
						disableZoom
					/>
				</div>
				<div className={`${classes.modelViewer__item} ${classes.fifth}`}>
					<ModelViewer
						src={"/nuxt-pi.glb"}
						interactionPrompt="none"
						disableZoom
					/>
				</div>
			</div>
		</div>
	);
};
