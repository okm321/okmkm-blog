import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { Introduction } from "@/components/shared/Introduction/Introduction";
import { MarkdownRenderer } from "@packages/markdown-render";

export default function Home() {
	return (
		<div>
			<Introduction />
			<MarkdownRenderer>{"# Hello"}</MarkdownRenderer>
		</div>
	);
}
