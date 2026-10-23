import { useMemo, useState } from 'react';
import {
	LEVEL_NAME,
	ringFill,
	solidColor,
	type IndNode,
	type NodeRec,
	type SubCounts,
} from './shared';

interface Props {
	tree: IndNode[];
	nodeIndex: Map<string, NodeRec>;
	leafCount: Map<string, number>;
	subCounts: Map<string, SubCounts>;
	onReveal: (code: string) => void;
}

const CX = 360;
const CY = 360;
const R0 = 96;
const RING_W = [88, 72, 58];

const polar = (r: number, a: number): [number, number] => [CX + r * Math.cos(a), CY + r * Math.sin(a)];

function arcPath(r0: number, r1: number, a0: number, a1: number): string {
	const [x0, y0] = polar(r1, a0);
	const [x1, y1] = polar(r1, a1);
	const [x2, y2] = polar(r0, a1);
	const [x3, y3] = polar(r0, a0);
	const large = a1 - a0 > Math.PI ? 1 : 0;
	return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r1} ${r1} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} A${r0} ${r0} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
}

interface ArcDef {
	d: string;
	code: string;
	chain: string[];
	menIdx: number;
	ring: number;
}
interface LabelDef {
	x: number;
	y: number;
	text: string;
}

function buildArcs(
	tree: IndNode[],
	nodeIndex: Map<string, NodeRec>,
	leafCount: Map<string, number>,
	total: number,
): { arcs: ArcDef[]; labels: LabelDef[] } {
	const arcs: ArcDef[] = [];
	const labels: LabelDef[] = [];
	(function walk(nodes: IndNode[], ring: number, r0: number, r1: number, start: number, chain: string[]) {
		let cursor = start;
		for (const n of nodes) {
			const span = (leafCount.get(n.c)! / total) * Math.PI * 2;
			const pad = Math.min(0.0045, span * 0.25);
			const ch = [...chain, n.c];
			arcs.push({
				d: arcPath(r0, r1, cursor + pad, cursor + span - pad),
				code: n.c,
				chain: ch,
				menIdx: nodeIndex.get(n.c)!.menIdx,
				ring,
			});
			if (ring === 0 && span >= 0.05) {
				const [x, y] = polar((r0 + r1) / 2, cursor + span / 2);
				labels.push({ x, y, text: n.c });
			}
			if (n.ch && ring < 2) walk(n.ch, ring + 1, r1, r1 + RING_W[ring + 1], cursor, ch);
			cursor += span;
		}
	})(tree, 0, R0, R0 + RING_W[0], -Math.PI / 2, []);
	return { arcs, labels };
}

/** 行业结构全景旭日图:悬停高亮同链路,点击定位到分类浏览器 */
export default function Sunburst({ tree, nodeIndex, leafCount, subCounts, onReveal }: Props) {
	const total = useMemo(() => tree.reduce((s, m) => s + (leafCount.get(m.c) ?? 0), 0), [tree, leafCount]);
	const { arcs, labels } = useMemo(
		() => buildArcs(tree, nodeIndex, leafCount, total),
		[tree, nodeIndex, leafCount, total],
	);
	const arcByCode = useMemo(() => new Map(arcs.map((a) => [a.code, a])), [arcs]);
	const [hoverChain, setHoverChain] = useState<string[] | null>(null);

	const rec = hoverChain ? nodeIndex.get(hoverChain[hoverChain.length - 1]) : undefined;
	const s = rec ? subCounts.get(rec.node.c) : undefined;
	const dimKey = hoverChain ? hoverChain.join('/') : '';
	const isDim = (a: ArcDef) => !!dimKey && !dimKey.startsWith(a.chain.join('/'));

	return (
		<section className="card">
			<div className="card-head">
				<div>
					<h2>行业结构全景</h2>
					<p className="card-desc">弧长按小类数量占比展示门类、大类、中类三层结构。悬停查看明细,点击任意弧段定位到下方浏览器。</p>
				</div>
			</div>
			<div className="sunburst-wrap">
				<div className="sb-chart">
					<svg
						viewBox="0 0 720 720"
						role="img"
						aria-label="国民经济行业分类旭日图"
						onMouseOver={(e) => {
							const p = (e.target as Element).closest('.sb-arc');
							if (!p) return;
							const a = arcByCode.get(p.getAttribute('data-code')!);
							if (a) setHoverChain(a.chain);
						}}
						onMouseLeave={() => setHoverChain(null)}
						onClick={(e) => {
							const p = (e.target as Element).closest('.sb-arc');
							if (p) onReveal(p.getAttribute('data-code')!);
						}}
					>
						{arcs.map((a) => (
							<path
								key={a.code}
								className={isDim(a) ? 'sb-arc dim' : 'sb-arc'}
								d={a.d}
								fill={ringFill(a.menIdx, a.ring)}
								data-code={a.code}
							/>
						))}
						{labels.map((l) => (
							<text key={l.text} className="sb-arc-label" x={l.x} y={l.y}>
								{l.text}
							</text>
						))}
					</svg>
					<div className="sb-center">
						{rec && s ? (
							<>
								<div className="sb-center-level">{LEVEL_NAME[rec.node.c.length]}</div>
								<div className="sb-center-code">{rec.node.c}</div>
								<div className="sb-center-name">{rec.node.n}</div>
								<div className="sb-center-sub">
									{rec.node.c.length === 1
										? `${s.d} 大类 · ${s.z} 中类 · ${s.x} 小类`
										: rec.node.c.length === 2
											? `${s.z} 中类 · ${s.x} 小类`
											: `${s.x} 小类`}
								</div>
							</>
						) : (
							<>
								<div className="sb-center-level">全部分类</div>
								<div className="sb-center-code">{total}</div>
								<div className="sb-center-name">个小类</div>
							</>
						)}
					</div>
				</div>
				<div className="sb-legend">
					{tree.map((m, i) => {
						const st = subCounts.get(m.c)!;
						const hl = hoverChain?.[0] === m.c;
						return (
							<button
								type="button"
								key={m.c}
								className={hl ? 'sb-legend-item hl' : 'sb-legend-item'}
								onMouseEnter={() => setHoverChain([m.c])}
								onMouseLeave={() => setHoverChain(null)}
								onClick={() => onReveal(m.c)}
							>
								<i className="dot" style={{ background: solidColor(i) }} />
								<b>{m.c}</b>
								<span className="lg-name">{m.n}</span>
								<span className="lg-count">{st.x}</span>
							</button>
						);
					})}
				</div>
			</div>
		</section>
	);
}
