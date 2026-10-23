import { useMemo, useState } from 'react';
import CourseMatrix from './CourseMatrix';
import MajorPanel from './MajorPanel';
import { classAccent, coursePages, courseStats, data, entryTotal, exTotal, hoursLabel, type ClassData } from './shared';

/** 核心课程可视化岛：专业类切换 + 课程公共度排行 + 专业×课程矩阵 + 各专业示例清单 */
export default function CoreCoursesApp() {
	const [classIdx, setClassIdx] = useState(0);
	const [query, setQuery] = useState('');
	const cls = data.classes[classIdx] as ClassData;
	const accent = classAccent[cls.code];

	const stats = useMemo(() => courseStats(cls), [cls]);
	const q = query.trim().toLowerCase();
	const visible = useMemo(
		() => (q === '' ? stats : stats.filter((s) => s.name.toLowerCase().includes(q))),
		[stats, q],
	);
	// 排行榜默认展示覆盖 ≥2 个专业的课程；可展开全部
	const [showAll, setShowAll] = useState(false);
	const sharedRows = visible.filter((s) => s.majors >= 2);
	const rows = showAll ? visible : sharedRows;
	const fullCoverage = stats.filter((s) => s.majors === cls.majors.length);

	return (
		<div className="cc-app" style={{ '--cc' : accent } as React.CSSProperties}>
			<div className="cc-toolbar">
				<div className="cc-tabs" role="tablist" aria-label="专业类">
					{data.classes.map((c, i) => (
						<button
							key={c.code}
							role="tab"
							aria-selected={i === classIdx}
							className={`cc-tab${i === classIdx ? ' on' : ''}`}
							style={{ '--cc': classAccent[c.code] } as React.CSSProperties}
							onClick={() => {
								setClassIdx(i);
								setShowAll(false);
							}}
						>
							<b>{c.name}</b>
							<span>{c.code}</span>
						</button>
					))}
				</div>
				<div className="cc-search">
					<input
						type="search"
						placeholder="搜索课程，如「数据结构」「信号」…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
					/>
				</div>
			</div>

			<p className="cc-credit">
				<span className="cc-chipln">学分结构</span>
				{cls.credit}。<span className="cc-note">{cls.note}</span>
			</p>

			<section className="cc-block">
				<header className="cc-block-head">
					<h3>课程公共度排行</h3>
					<p>
						聚合本类全部 {exTotal(cls)} 份示例（{cls.majors.length} 个专业），统计每门课程被多少专业与示例采用——
						覆盖专业越多的课程，越是这个专业类的「公共核心课」。
						{fullCoverage.length > 0 && (
							<>
								其中 <b>{fullCoverage.map((s) => s.name).join('、')}</b>{' '}
								{fullCoverage.length > 1 ? '等 ' + fullCoverage.length + ' 门' : ''}覆盖全部专业。
							</>
						)}
					</p>
				</header>
				<ol className="cc-rank">
					{rows.map((s, i) => (
						<li
							key={s.name}
							className={s.majors === cls.majors.length ? ' full' : s.majors * 2 >= cls.majors.length ? ' most' : ''}
						>
							<span className="cc-rank-no">{i + 1}</span>
							{coursePages[s.name] ? (
								<a className="cc-rank-name link" href={coursePages[s.name]} title={`${s.name} · 查看课程介绍`}>
									{s.name}<i aria-hidden="true">↗</i>
								</a>
							) : (
								<span className="cc-rank-name" title={s.name}>{s.name}</span>
							)}
							<span className="cc-rank-bar">
								<i style={{ width: `${(s.majors / cls.majors.length) * 100}%` }} />
							</span>
							<span className="cc-rank-meta">
								<b>{s.majors}</b>/{cls.majors.length} 专业
							</span>
							<span className="cc-rank-meta dim">
								<b>{s.examples}</b> 份示例
							</span>
							<span className="cc-rank-hours">{hoursLabel(s)}</span>
						</li>
					))}
					{rows.length === 0 && <li className="cc-empty">没有匹配的课程</li>}
				</ol>
				{q === '' && visible.length > sharedRows.length && (
					<button className="cc-more" onClick={() => setShowAll((v) => !v)}>
						{showAll ? '收起仅修课程' : `展开全部 ${visible.length} 门课程（含仅单一专业采用）`}
					</button>
				)}
			</section>

			<CourseMatrix cls={cls} stats={stats} query={q} />

			<MajorPanel cls={cls} />
		</div>
	);
}
