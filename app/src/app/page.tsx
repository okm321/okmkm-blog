import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { MarkdownRenderer } from "@packages/markdown-render";

export default function Home() {
	return (
		<div>
			<HeroSection />
			<MarkdownRenderer>{"# Hello"}</MarkdownRenderer>
		</div>
	);
}
