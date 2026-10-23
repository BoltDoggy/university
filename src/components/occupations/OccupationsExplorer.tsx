import { useEffect, useMemo, useRef, useState } from 'react';
import catalog from '../../data/occupations-2022.json';
import { catColor, chipTitle, occCount, type MajorCategory } from './shared';

const categories = catalog.categories as MajorCategory[];

const haystack = (...parts: (string | undefined)[]): string =>
	parts.filter(Boolean).join(' ').toLowerCase();

/** 职业大典交互岛:搜索过滤 + 侧边导航滚动高亮 + 折叠小类 */
export default function OccupationsExplorer() {
	const [query, setQuery] = useState('');
	const [closed, setClosed] = useState<Set<string>>(() => new Set());
	const [activeId, setActiveId] = useState('');
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const q = query.trim().toLowerCase();

	// 搜索可见性:职业命中自身/所属小类/中类/大类任一即显示,命中类目时整组保留;
	// 无职业的小类(如各"其他"行)空查询下也要显示,故每级都补 q==='' 短路
	const view = useMemo(() => {
		let count = 0;
		const cats = categories.map((cat) => {
			const catHit = q !== '' && haystack(cat.name, cat.code, cat.gbm).includes(q);
			const middles = cat.middles.map((mid) => {
				const midHit = catHit || (q !== '' && haystack(mid.name, mid.code, mid.gbm).includes(q));
				const minors = mid.minors.map((min) => {
					const minHit = midHit || (q !== '' && haystack(min.name, min.code, min.gbm).includes(q));
					const occupations = min.occupations.map((o) => {
						const show = q === '' || minHit || haystack(o.name, o.code).includes(q);
						if (show) count++;
						return { o, show };
					});
					return { min, occupations, show: q === '' || minHit || occupations.some((x) => x.show) };
				});
				return { mid, minors, show: q === '' || midHit || minors.some((m) => m.show) };
			});
			return { cat, middles, show: q === '' || catHit || middles.some((m) => m.show) };
		});
		return { cats, count };
	}, [q]);

	const maxCatOcc = useMemo(() => Math.max(...categories.map(occCount)), []);

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

	// 滚动时高亮侧边导航中当前大类
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

	const toggle = (minorCode: string) =>
		setClosed((prev) => {
			const next = new Set(prev);
			next.has(minorCode) ? next.delete(minorCode) : next.add(minorCode);
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
						placeholder="搜索职业名称或代码，如「工业机器人」「4-05」「教师」…（按 / 聚焦）"
						autoComplete="off"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
					/>
				</div>
				<p className="legend">
					<i className="badge l">L</i>绿色职业
					<i className="badge s">S</i>数字职业
					{q !== '' && <span className="result-info">匹配 {view.count} 个职业</span>}
				</p>
			</div>

			<div className="layout">
				<nav className="side" aria-label="大类导航">
					{view.cats.map(({ cat }) => (
						<a
							key={cat.code}
							href={`#cat-${cat.code}`}
							className={activeId === `cat-${cat.code}` ? 'side-link active' : 'side-link'}
						>
							<span className="side-code" style={{ color: catColor[cat.code] }}>{cat.code}</span>
							<span className="side-name">{cat.name}</span>
							<span className="side-count">{occCount(cat)}</span>
							<span
								className="side-bar"
								style={{
									width: `${Math.max((occCount(cat) / maxCatOcc) * 100, 4)}%`,
									background: catColor[cat.code],
								}}
							/>
						</a>
					))}
				</nav>

				<main id="catalog">
					{view.cats.map(({ cat, middles, show }) =>
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
										{cat.middles.length} 个中类 · {occCount(cat)} 个职业
									</span>
								</header>
								{middles.map(({ mid, minors, show: midShow }) =>
									midShow ? (
										<div key={mid.code} className="mid">
											<header className="mid-head">
												<span className="mid-code">{mid.code}</span>
												<h3>{mid.name}</h3>
												<span className="mid-meta">{mid.minors.length} 个小类</span>
											</header>
											{minors.map(({ min, occupations, show: minShow }) =>
												minShow ? (
													<details
														key={min.code}
														className="minor"
														open={q !== '' || !closed.has(min.code)}
													>
														<summary
															onClick={(e) => {
																e.preventDefault();
																toggle(min.code);
															}}
														>
															<span className="minor-code">{min.code}</span>
															<span className="minor-name">{min.name}</span>
															<span className="minor-count">{min.occupations.length}</span>
															<svg className="chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
																<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
															</svg>
														</summary>
														<div className="chips">
															{occupations.map(({ o, show: chipShow }) =>
																chipShow ? (
																	<span key={o.code} className="chip" title={chipTitle(o)}>
																		<span className="chip-name">{o.name}</span>
																		<span className="chip-code">{o.code}</span>
																		{o.is_green && <i className="badge l" title="绿色职业">L</i>}
																		{o.is_digital && <i className="badge s" title="数字职业">S</i>}
																	</span>
																) : null,
															)}
															{min.occupations.length === 0 && (
																<span className="chips-empty">体系分类表未为此小类列出职业</span>
															)}
														</div>
													</details>
												) : null,
											)}
										</div>
									) : null,
								)}
							</section>
						) : null,
					)}
					{q !== '' && view.count === 0 && (
						<div className="empty">
							<p>未找到匹配的职业，试试其他关键词，如「工程」「销售」「机器」。</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
