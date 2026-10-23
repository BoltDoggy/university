import { useEffect, useMemo, useRef, useState } from 'react';
import catalog from '../../data/majors-2026.json';
import { catColor, chipTitle, groupsOf, majorCount, type Category } from './shared';

const categories = catalog.categories as Category[];

/** 专业目录交互岛:搜索过滤 + 侧边导航滚动高亮 + 折叠分组 */
export default function MajorsExplorer() {
	const [query, setQuery] = useState('');
	const [closed, setClosed] = useState<Set<string>>(() => new Set());
	const [activeId, setActiveId] = useState('');
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const q = query.trim().toLowerCase();

	// 搜索可见性:专业命中自身/所属类/所属门类任一即显示,命中类/门类时整组保留
	const view = useMemo(() => {
		let count = 0;
		const cats = categories.map((cat) => {
			const catHit = q !== '' && `${cat.name} ${cat.code}`.toLowerCase().includes(q);
			const classes = groupsOf(cat).map((cls) => {
				const clsHit = catHit || (q !== '' && `${cls.name} ${cls.code}`.toLowerCase().includes(q));
				const majors = cls.majors.map((m) => {
					const show = q === '' || clsHit || `${m.name} ${m.code}`.toLowerCase().includes(q);
					if (show) count++;
					return { m, show };
				});
				return { cls, majors, show: majors.some((x) => x.show) };
			});
			return { cat, classes, show: classes.some((c) => c.show) };
		});
		return { cats, count };
	}, [q]);

	const maxCatMajors = useMemo(() => Math.max(...categories.map(majorCount)), []);

	// 按 “/” 快捷聚焦搜索框
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === '/' && document.activeElement !== inputRef.current) {
				e.preventDefault();
				inputRef.current?.focus();
			}
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, []);

	// 滚动时高亮侧边导航中当前门类
	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActiveId(entry.target.id);
				}
			},
			{ rootMargin: '-30% 0px -60% 0px' },
		);
		root.querySelectorAll('section.cat').forEach((s) => observer.observe(s));
		return () => observer.disconnect();
	}, []);

	const groupKey = (catCode: string, clsCode: string) => `${catCode}/${clsCode}`;
	const toggleGroup = (catCode: string, clsCode: string) =>
		setClosed((prev) => {
			const next = new Set(prev);
			next.has(groupKey(catCode, clsCode))
				? next.delete(groupKey(catCode, clsCode))
				: next.add(groupKey(catCode, clsCode));
			return next;
		});

	return (
		<div ref={rootRef}>
			<div className="toolbar">
				<div className="search-box">
					<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
						<path
							d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
					<input
						ref={inputRef}
						id="search"
						type="search"
						placeholder="搜索专业名称或代码，如「人工智能」「0835」「数学」…（按 / 聚焦）"
						autoComplete="off"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
					/>
				</div>
				<p className="legend">
					<i className="badge t">T</i>特设专业
					<i className="badge k">K</i>国家控制布点
					<i className="dot-demo"></i>含学位授予备注
					{q !== '' && <span className="result-info">匹配 {view.count} 个专业</span>}
				</p>
			</div>

			<div className="layout">
				<nav className="side" aria-label="学科门类导航">
					{view.cats.map(({ cat }) => (
						<a
							key={cat.code}
							href={`#cat-${cat.code}`}
							className={activeId === `cat-${cat.code}` ? 'side-link active' : 'side-link'}
						>
							<span className="side-code" style={{ color: catColor[cat.code] }}>{cat.code}</span>
							<span className="side-name">{cat.name}</span>
							<span className="side-count">{majorCount(cat)}</span>
							<span
								className="side-bar"
								style={{
									width: `${Math.max((majorCount(cat) / maxCatMajors) * 100, 4)}%`,
									background: catColor[cat.code],
								}}
							/>
						</a>
					))}
				</nav>

				<main id="catalog">
					{view.cats.map(({ cat, classes, show }) =>
						show ? (
							<section
								key={cat.code}
								className="cat"
								id={`cat-${cat.code}`}
								style={{ '--cat': catColor[cat.code] } as React.CSSProperties}
							>
								<header className="cat-head">
									<span className="cat-code">{cat.code}</span>
									<h2>{cat.name}</h2>
									<span className="cat-meta">
										{cat.classes ? `${cat.classes.length} 个专业类 · ` : ''}{majorCount(cat)} 个专业
									</span>
								</header>
								{classes.map(({ cls, majors, show: groupShow }) =>
									groupShow ? (
										<details
											key={cls.code || 'root'}
											className="cls"
											open={q !== '' || !closed.has(groupKey(cat.code, cls.code))}
										>
											<summary
												onClick={(e) => {
													e.preventDefault();
													toggleGroup(cat.code, cls.code);
												}}
											>
												<span className="cls-code">{cls.code}</span>
												<span className="cls-name">{cls.name}</span>
												<span className="cls-count">{cls.majors.length}</span>
												<svg className="chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
													<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
												</svg>
											</summary>
											<div className="chips">
												{majors.map(({ m, show: chipShow }) =>
													chipShow ? (
														<span key={m.code} className="chip" title={chipTitle(m)}>
															<span className="chip-name">{m.name}</span>
															<span className="chip-code">{m.code}</span>
															{m.is_special && <i className="badge t" title="特设专业">T</i>}
															{m.is_state_controlled && <i className="badge k" title="国家控制布点专业">K</i>}
															{m.note && <i className="dot" title={`注：${m.note}`} />}
														</span>
													) : null,
												)}
											</div>
										</details>
									) : null,
								)}
							</section>
						) : null,
					)}
					{q !== '' && view.count === 0 && (
						<div className="empty">
							<p>未找到匹配的专业，试试其他关键词，如「智能」「数据」「师范」。</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
