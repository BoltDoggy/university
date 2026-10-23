import { useMemo, useState } from 'react';
import { edges as allEdges, nodes as allNodes, relStats, type GEdge, type GNode } from '../courses/relations';

interface Placed extends GNode {
	x: number;
	y: number;
	w: number;
}

const NODE_W = 138;
const NODE_H = 40;
const GAP_X = 30;
const GAP_Y = 96;
const PAD = 24;

/** 分层 DAG：先修边决定层号（最长路径），层内按邻接重心排序减少交叉 */
function layout(ns: GNode[], es: GEdge[]): { placed: Placed[]; width: number; height: number } {
	const req = es.filter((e) => e.kind === 'req');
	const into = new Map<string, string[]>();
	for (const e of req) {
		const list = into.get(e.to) ?? [];
		list.push(e.from);
		into.set(e.to, list);
	}
	const all = new Map(ns.map((n) => [n.id, n]));

	const layerOf = new Map<string, number>();
	const visiting = new Set<string>();
	const layer = (id: string): number => {
		if (layerOf.has(id)) return layerOf.get(id)!;
		if (visiting.has(id)) return 0; // 防御环
		visiting.add(id);
		const pres = into.get(id) ?? [];
		const l = pres.length === 0 ? 0 : 1 + Math.max(...pres.map(layer));
		visiting.delete(id);
		layerOf.set(id, l);
		return l;
	};
	for (const n of ns) layer(n.id);

	const maxLayer = Math.max(...layerOf.values());
	const rows: string[][] = Array.from({ length: maxLayer + 1 }, () => []);
	for (const n of ns) rows[layerOf.get(n.id)!].push(n.id);

	const pos = new Map<string, { x: number; y: number }>();
	const rowWidth = (ids: string[]) => ids.length * NODE_W + (ids.length - 1) * GAP_X;
	let width = 0;
	rows.forEach((ids) => {
		width = Math.max(width, rowWidth(ids));
		ids.forEach((id, i) => pos.set(id, { x: i * (NODE_W + GAP_X), y: 0 }));
	});

	// 自上而下重心排序（两轮足够）
	for (let pass = 0; pass < 2; pass++) {
		for (let r = 1; r < rows.length; r++) {
			const rowsAbove = rows[r].map((id) => {
				const pres = (into.get(id) ?? []).map((p) => pos.get(p)?.x).filter((v): v is number => v !== undefined);
				const bc = pres.length ? pres.reduce((a, b) => a + b, 0) / pres.length : pos.get(id)!.x;
				return { id, bc };
			});
			rowsAbove.sort((a, b) => a.bc - b.bc);
			rows[r] = rowsAbove.map((x) => x.id);
			rows[r].forEach((id, i) => pos.set(id, { x: i * (NODE_W + GAP_X), y: 0 }));
		}
	}

	width = 0;
	rows.forEach((ids) => (width = Math.max(width, rowWidth(ids))));
	const height = rows.length * (NODE_H + GAP_Y);
	const placed: Placed[] = [];
	rows.forEach((ids, r) => {
		const offset = (width - rowWidth(ids)) / 2;
		ids.forEach((id, i) => {
			const n = all.get(id)!;
			placed.push({ ...n, w: NODE_W, x: offset + i * (NODE_W + GAP_X), y: r * (NODE_H + GAP_Y) + PAD });
		});
	});
	return { placed, width: width + PAD * 2, height: height + PAD * 2 };
}

function edgePath(a: Placed, b: Placed): string {
	const x1 = a.x + NODE_W / 2;
	const y1 = a.y + NODE_H;
	const x2 = b.x + NODE_W / 2;
	const y2 = b.y;
	const mid = (y1 + y2) / 2;
	return `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`;
}

/** 课程关系图谱岛：分层布局 + 未建页课程开关 + 悬停聚焦 + 点击跳转 */
export default function CourseGraph() {
	const [showExt, setShowExt] = useState(false);
	const [focus, setFocus] = useState('');

	const view = useMemo(() => {
		const ns = allNodes.filter((n) => showExt || n.group !== 'ext');
		const ids = new Set(ns.map((n) => n.id));
		const es = allEdges.filter((e) => ids.has(e.from) && ids.has(e.to));
		return { ...layout(ns, es), es };
	}, [showExt]);

	const pos = useMemo(() => new Map(view.placed.map((p) => [p.id, p])), [view]);

	const touched = useMemo(() => {
		if (!focus) return null;
		const s = new Set<string>([focus]);
		for (const e of view.es) {
			if (e.from === focus) s.add(e.to);
			if (e.to === focus) s.add(e.from);
		}
		return s;
	}, [focus, view]);

	const edgeCls = (e: GEdge) => (focus ? (e.from === focus || e.to === focus ? 'hl' : 'dim') : '');

	return (
		<div className="cmap-wrap">
			<div className="cmap-legend">
				<span><i className="ln req" />先修 / 后续</span>
				<span><i className="ln par" />并行修读</span>
				<span><i className="nd base" />基础课</span>
				<span><i className="nd anchor" />国标锚定课</span>
				<span><i className="nd series" />AI 系列课</span>
				{showExt && <span><i className="nd ext" />未建页课程</span>}
				<label className="cmap-toggle">
					<input
						type="checkbox"
						checked={showExt}
						onChange={(e) => {
							setShowExt(e.target.checked);
							setFocus('');
						}}
					/>
					展示未建页课程（{relStats.extCount} 门）
				</label>
				<em>悬停聚焦 · 点击课程卡片进入介绍页</em>
			</div>
			<div className="cmap-scroll">
				<svg viewBox={`0 0 ${view.width} ${view.height}`} width={view.width} height={view.height} role="img" aria-label="课程先修与后续关系图">
					{view.es.map((e, i) => {
						const a = pos.get(e.from);
						const b = pos.get(e.to);
						if (!a || !b) return null;
						const ext = a.group === 'ext' || b.group === 'ext';
						return (
							<path
								key={i}
								d={edgePath(a, b)}
								className={`cmap-edge ${e.kind}${ext ? ' ext' : ''} ${edgeCls(e)}`}
								markerEnd={e.kind === 'req' ? 'url(#arrow)' : undefined}
							/>
						);
					})}
					<defs>
						<marker id="arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={5.5} markerHeight={5.5} orient="auto-start-reverse">
							<path d="M0,1 L9,5 L0,9 z" className="cmap-arrow" />
						</marker>
					</defs>
					{view.placed.map((n) => {
						const dim = touched && !touched.has(n.id);
						const hl = focus === n.id;
						return (
							<g
								key={n.id}
								className={`cmap-node ${n.group}${dim ? ' dim' : ''}${hl ? ' hl' : ''}`}
								onMouseEnter={() => setFocus(n.id)}
								onMouseLeave={() => setFocus('')}
								onClick={() => n.href && (window.location.href = n.href)}
								role={n.href ? 'link' : undefined}
							>
								<rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={10} />
								<text x={n.x + NODE_W / 2} y={n.y + NODE_H / 2 + 4.5}>
									{n.label}
								</text>
								<title>{n.note ? `${n.label}（${n.note}）` : n.label}</title>
							</g>
						);
					})}
				</svg>
			</div>
		</div>
	);
}
