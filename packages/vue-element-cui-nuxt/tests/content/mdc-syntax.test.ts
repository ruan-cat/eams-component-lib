import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

import { describe, expect, test } from "vitest";

const contentRoot = join(dirname(fileURLToPath(import.meta.url)), "../../content");

function markdownFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith(".md") ? [path] : [];
	});
}

describe("content MDC syntax", () => {
	test("keeps every demo-playground block in the standard shape", () => {
		const violations: string[] = [];
		let demoCount = 0;

		for (const file of markdownFiles(contentRoot)) {
			const lines = readFileSync(file, "utf8").split(/\r?\n/);
			for (let index = 0; index < lines.length; index += 1) {
				if (lines[index] === "#preview" || lines[index] === "#code") {
					violations.push(`${relative(contentRoot, file)}:${index + 1}: slot marker outside container`);
					continue;
				}
				if (lines[index] !== "::demo-playground") {
					if (/^#{1,6}\s+::demo-playground$/.test(lines[index])) {
						violations.push(`${relative(contentRoot, file)}:${index + 1}: heading marker`);
					}
					continue;
				}

				demoCount += 1;
				const blockEnd = lines.indexOf("::", index + 1);
				if (blockEnd < 0) {
					violations.push(`${relative(contentRoot, file)}:${index + 1}: unclosed container`);
					continue;
				}

				const block = lines.slice(index + 1, blockEnd);
				index = blockEnd;
				const firstDelimiter = block.indexOf("---");
				const secondDelimiter = firstDelimiter < 0 ? -1 : block.indexOf("---", firstDelimiter + 1);
				if (firstDelimiter < 0 || secondDelimiter < 0) {
					violations.push(`${relative(contentRoot, file)}:${index + 1}: missing frontmatter delimiters`);
				} else {
					const frontmatter = block.slice(firstDelimiter + 1, secondDelimiter);
					if (!frontmatter.some((line) => line.startsWith("title:"))) {
						violations.push(`${relative(contentRoot, file)}:${index + 1}: missing title frontmatter`);
					}
					if (!frontmatter.some((line) => line.startsWith("description:"))) {
						violations.push(`${relative(contentRoot, file)}:${index + 1}: missing description frontmatter`);
					}
				}
				if (!block.includes("#preview")) {
					violations.push(`${relative(contentRoot, file)}:${index + 1}: missing #preview slot`);
				}
				if (!block.includes("#code")) {
					violations.push(`${relative(contentRoot, file)}:${index + 1}: missing #code slot`);
				}
			}
		}

		expect(demoCount).toBeGreaterThan(0);
		expect(violations).toEqual([]);
	});
});
