/** 国民经济行业分类(GB/T 4754—2017)数据结构、索引构建与配色 */

export interface IndNode {
	c: string;
	n: string;
	d?: string;
	ch?: IndNode[];
}

export interface IndStatRow {
	name: string;
	d: number;
	z: number;
	x: number;
	d11: number;
	z11: number;
	x11: number;
}

export interface IndustryData {
	meta: {
		title: string;
		standard: string;
		replaces: string;
		issued: string;
		effective: string;
		counts: { men: number; da: number; zhong: number; xiao: number };
	};
	tree: IndNode[];
	stats: Record<string, IndStatRow>;
	v2011: Record<string, { t?: { c: string | number; n?: string; note?: string }[] }>;
	isic: Record<string, { c: string | number; n?: string }[]>;
}

export interface NodeRec {
	node: IndNode;
	/** 从门类到自身的完整路径 */
	path: { c: string; n: string }[];
	menIdx: number;
}

export const LEVEL_NAME: Record<number, string> = { 1: '门类', 2: '大类', 3: '中类', 4: '小类' };

/** code -> 节点记录(含路径与门类序号) */
export function buildNodeIndex(tree: IndNode[]): Map<string, NodeRec> {
	const index = new Map<string, NodeRec>();
	tree.forEach((m, menIdx) => {
		(function walk(n: IndNode, path: { c: string; n: string }[]) {
			const rec: NodeRec = { node: n, path: [...path, { c: n.c, n: n.n }], menIdx };
			index.set(n.c, rec);
			if (n.ch) n.ch.forEach((c) => walk(c, rec.path));
		})(m, []);
	});
	return index;
}

export interface SubCounts {
	d: number;
	z: number;
	x: number;
}

/** leafCount: 各节点叶子(小类)数;subCounts: 各节点大/中/小类后代数量 */
export function buildStatsMaps(tree: IndNode[]) {
	const leafCount = new Map<string, number>();
	const subCounts = new Map<string, SubCounts>();
	function fill(n: IndNode) {
		const acc: SubCounts = { d: 0, z: 0, x: 0 };
		if (n.ch) {
			for (const c of n.ch) {
				fill(c);
				const s = subCounts.get(c.c)!;
				acc.d += s.d;
				acc.z += s.z;
				acc.x += s.x;
				if (c.c.length === 2) acc.d++;
				else if (c.c.length === 3) acc.z++;
				else if (c.c.length === 4) acc.x++;
			}
		}
		leafCount.set(n.c, n.ch ? n.ch.reduce((s, c) => s + leafCount.get(c.c)!, 0) : 1);
		subCounts.set(n.c, acc);
	}
	tree.forEach(fill);
	return { leafCount, subCounts };
}

/** 2017 小类 code -> 2011 版来源 [{c: 旧码, note}] */
export function buildV2011Rev(v2011: IndustryData['v2011']): Map<string, { c: string; note: string }[]> {
	const rev = new Map<string, { c: string; note: string }[]>();
	for (const [old, v] of Object.entries(v2011)) {
		for (const t of v.t || []) {
			const code = String(t.c).trim();
			if (!code) continue;
			if (!rev.has(code)) rev.set(code, []);
			rev.get(code)!.push({ c: old, note: t.note || '' });
		}
	}
	return rev;
}

/** 2017 小类 code -> 对应的 ISIC Rev.4 代码 */
export function buildIsicRev(isic: IndustryData['isic']): Map<string, string[]> {
	const rev = new Map<string, string[]>();
	for (const [ic, arr] of Object.entries(isic)) {
		for (const t of arr) {
			for (const code of String(t.c).split(/[^\d]+/).filter(Boolean)) {
				if (!rev.has(code)) rev.set(code, []);
				if (!rev.get(code)!.includes(ic)) rev.get(code)!.push(ic);
			}
		}
	}
	return rev;
}

/* ---------- 门类配色(按门类序号取色相) ---------- */
const hueOf = (i: number) => (i * 360) / 20 + 8;
export const ringFill = (menIdx: number, ring: number) =>
	`hsl(${hueOf(menIdx)}, 62%, ${[55, 64, 72][ring]}%)`;
export const solidColor = (menIdx: number, l = 48) => `hsl(${hueOf(menIdx)}, 58%, ${l}%)`;
export const softColor = (menIdx: number, l = 92) => `hsl(${hueOf(menIdx)}, 55%, ${l}%)`;
export const inkColor = (menIdx: number) => `hsl(${hueOf(menIdx)}, 52%, 32%)`;
