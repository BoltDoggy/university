import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import DetailPane from './DetailPane';
import { inkColor, softColor, solidColor, type IndNode, type NodeRec, type SubCounts } from './shared';

interface Props {
	tree: IndNode[];
	nodeIndex: Map<string, NodeRec>;
	subCounts: Map<string, SubCounts>;
	v2011Rev: Map<string, { c: string; note: string }[]>;
	isicRev: Map<string, string[]>;
	selected: string | null;
	onSelect: (code: string) => void;
	/** 最近一次定位请求,tick 递增以重复触发同一 code 的滚动 */
	reveal: { code: string; tick: number } | null;
	onReveal: (code: string) => void;
}

/** 分类浏览器:逐级展开的树 + 名称/代码搜索 + 详情面板 */
export default function Explorer(props: Props) {
	const { tree, nodeIndex, subCounts, v2011Rev, isicRev, selected, onSelect, reveal, onReveal } = props;
	// 初始全部收起,仅显示门类层
	const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
	const [query, setQuery] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	const q = query.trim().toLowerCase();
	const hits = useMemo(() => {
		if (!q) return null;
		const out: NodeRec[] = [];
		for (const rec of nodeIndex.values()) {
			if (rec.node.c.toLowerCase().startsWith(q) || rec.node.n.toLowerCase().includes(q)) {
				out.push(rec);
				if (out.length >= 80) break;
			}
		}
		return out;
	}, [q, nodeIndex]);

	// 定位请求到达时滚动到目标行并闪烁;必要时先展开祖先
	useEffect(() => {
		if (!reveal) return;
		const row = containerRef.current?.querySelector<HTMLElement>(`.trow[data-code="${reveal.code}"]`);
		if (!row) return;
		row.scrollIntoView({ behavior: 'smooth', block: 'center' });
		row.classList.remove('flash');
		void row.offsetWidth;
		row.classList.add('flash');
	}, [reveal]);

	const toggle = useCallback((code: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			next.has(code) ? next.delete(code) : next.add(code);
			return next;
		});
	}, []);

	const expandAll = () =>
		setExpanded(new Set([...nodeIndex.values()].filter((r) => r.node.ch).map((r) => r.node.c)));
	const collapseAll = () => setExpanded(new Set());

	// 外部定位(旭日图/图例/搜索/面包屑):先展开祖先再交给 App 触发滚动
	const revealInTree = useCallback(
		(code: string) => {
			const rec = nodeIndex.get(code);
			if (rec) {
				setExpanded((prev) => {
					const next = new Set(prev);
					for (const p of rec.path) next.add(p.c);
					return next;
				});
			}
			onReveal(code);
		},
		[nodeIndex, onReveal],
	);

	const renderNode = (n: IndNode): ReactNode => {
		const rec = nodeIndex.get(n.c)!;
		const lvl = n.c.length;
		const s = subCounts.get(n.c)!;
		const open = expanded.has(n.c);
		const badgeStyle =
			lvl === 1
				? { background: solidColor(rec.menIdx), color: '#fff' }
				: { background: softColor(rec.menIdx), color: inkColor(rec.menIdx) };
		const meta = !n.ch ? '' : lvl === 1 ? `${s.d}/${s.z}/${s.x}` : lvl === 2 ? `${s.z}/${s.x}` : `${s.x}`;
		const activate = () => {
			onSelect(n.c);
			if (n.ch) toggle(n.c);
		};
		return (
			<div key={n.c} className={n.ch && open ? 'tnode open' : 'tnode'}>
				<div
					role="button"
					tabIndex={0}
					className={selected === n.c ? 'trow sel' : 'trow'}
					data-code={n.c}
					onClick={activate}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							activate();
						}
					}}
				>
					<span className={n.ch ? 'chev' : 'chev leaf'}>{n.ch ? '▶' : '·'}</span>
					<span className="tbadge" style={badgeStyle}>
						{n.c}
					</span>
					<span className="tname">{n.n}</span>
					{n.ch && <span className="tmeta">{meta}</span>}
				</div>
				{n.ch && open && <div className="tkids">{n.ch.map(renderNode)}</div>}
			</div>
		);
	};

	return (
		<section className="card">
			<div className="card-head">
				<div>
					<h2>分类浏览器</h2>
					<p className="card-desc">逐级展开浏览,或搜索名称 / 代码。计数格式:大类/中类/小类。</p>
				</div>
				<div className="tree-tools">
					<button type="button" className="ghost-btn" onClick={expandAll}>
						全部展开
					</button>
					<button type="button" className="ghost-btn" onClick={collapseAll}>
						全部收起
					</button>
				</div>
			</div>
			<div className="explorer">
				<div className="tree-pane">
					<div className="search-box">
						<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
							<path
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
							/>
						</svg>
						<input
							type="search"
							placeholder="搜索名称或代码,如:制造 / 631 / 软件"
							autoComplete="off"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && hits?.length) revealInTree(hits[0].node.c);
							}}
						/>
					</div>
					{hits && (
						<div className="search-results">
							{hits.length === 0 ? (
								<div className="sr-empty">没有匹配的分类</div>
							) : (
								<>
									<div className="sr-count">{hits.length >= 80 ? '前 80' : hits.length} 条结果</div>
									{hits.map((r) => (
										<button
											type="button"
											key={r.node.c}
											className="sr-item"
											onClick={() => revealInTree(r.node.c)}
										>
											<span
												className="tbadge"
												style={{ background: softColor(r.menIdx), color: inkColor(r.menIdx) }}
											>
												{r.node.c}
											</span>
											<span className="sr-name">{r.node.n}</span>
											<span className="sr-path">
												{r.path.slice(0, -1).map((p) => p.n).join(' / ') || '顶层'}
											</span>
										</button>
									))}
								</>
							)}
						</div>
					)}
					<div className="tree-root" ref={containerRef}>
						{tree.map(renderNode)}
					</div>
				</div>
				<aside className="detail">
					{selected ? (
						<DetailPane
							code={selected}
							nodeIndex={nodeIndex}
							subCounts={subCounts}
							v2011Rev={v2011Rev}
							isicRev={isicRev}
							onReveal={revealInTree}
						/>
					) : (
						<div className="detail-empty">
							点击左侧任意分类,
							<br />
							或点击上方旭日图弧段查看详情
						</div>
					)}
				</aside>
			</div>
		</section>
	);
}
