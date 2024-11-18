"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const HeroSection = () => {
	const mountRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// **1. シーンを作成**
		const scene = new THREE.Scene();

		// **2. カメラを作成**
		const camera = new THREE.PerspectiveCamera(
			30,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);
		camera.position.set(0, 0, 8);

		// **3. レンダラーを作成**
		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio); // 解像度を向上
		renderer.shadowMap.enabled = true; // シャドウ有効化
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 高品質シャドウ

		// **4. レンダラーのサイズを親要素に合わせる関数**
		const resizeRenderer = () => {
			if (mountRef.current) {
				const { offsetWidth, offsetHeight } = mountRef.current;
				renderer.setSize(offsetWidth, offsetHeight);
				camera.aspect = offsetWidth / offsetHeight;
				camera.updateProjectionMatrix();
			}
		};

		// 初期サイズ設定
		resizeRenderer();
		mountRef.current?.appendChild(renderer.domElement);

		// **5. 環境光を追加**
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		scene.add(ambientLight);

		// **6. 太陽光を追加**
		const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
		directionalLight.position.set(10, 10, 10);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048; // 高解像度シャドウ
		directionalLight.shadow.mapSize.height = 2048;
		directionalLight.shadow.camera.near = 0.1;
		directionalLight.shadow.camera.far = 50;
		scene.add(directionalLight);

		// **7. GLBモデルの読み込み管理**
		const models: THREE.Object3D[] = [];
		const loader = new GLTFLoader();

		// モデル読み込み関数
		const loadModel = (path: string, position: THREE.Vector3) => {
			loader.load(
				path,
				// @ts-ignore
				(gltf) => {
					const model = gltf.scene;
					model.scale.set(0.3, 0.3, 0.3);
					model.position.copy(position);

					// 影とフィルタリング設定
					// @ts-ignore
					model.traverse((child) => {
						if (child instanceof THREE.Mesh) {
							child.castShadow = true;
							child.receiveShadow = true;

							if (child.material.map) {
								child.material.map.anisotropy = 16; // 異方性フィルタリング
							}
						}
					});

					scene.add(model);
					models.push(model);
				},
				undefined,
				// @ts-ignore
				(error) => {
					console.error(`Error loading model from ${path}:`, error);
				},
			);
		};

		// モデルをロード
		loadModel("/react-pi.glb", new THREE.Vector3(0, 0, 0));
		loadModel("/go-pi.glb", new THREE.Vector3(-4.5, 0, 0));
		loadModel("/nuxt-pi.glb", new THREE.Vector3(4.5, 0, 0));
		loadModel("/next-pi.glb", new THREE.Vector3(-2.5, 0.5, 0));
		loadModel("/vue-pi.glb", new THREE.Vector3(2.5, 0.5, 0));

		// **8. カメラコントロールを追加**
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.minDistance = 5;
		controls.maxDistance = 15;

		// **9. アニメーションループ**
		const animate = () => {
			requestAnimationFrame(animate);

			models.forEach((model, index) => {
				model.rotation.y += 0.005 + index * 0.001;
				model.rotation.x += 0.003 + index * 0.0005;
			});

			controls.update();
			renderer.render(scene, camera);
		};

		animate();

		// **10. リサイズイベントを監視**
		window.addEventListener("resize", resizeRenderer);

		// **11. クリーンアップ**
		return () => {
			window.removeEventListener("resize", resizeRenderer);
			mountRef.current?.removeChild(renderer.domElement);
			renderer.dispose();
		};
	}, []);

	return (
		<div
			ref={mountRef}
			style={{
				width: "100%", // 親要素の幅を画面いっぱいに
				height: "300px", // 高さを調整
				margin: "0 auto",
				overflow: "hidden",
				position: "relative",
			}}
		/>
	);
};
