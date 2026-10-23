import { useMemo, useState } from 'react';
import type { ClassData, CourseStat } from './shared';

interface Props {
	cls: ClassData;
	stats: CourseStat[];
	query: string;
}

/** 专业 × 课程矩阵：行 = 覆盖 ≥2 专业的课程，列 = 专业，格内圆点 = 采用该课程的示例份数 */
export default function CourseMatrix({ cls, stats, query }: Props) {
	const [hover, setHover] = useState('');

	const rows = useMemo(() => {
		const base = stats.filter((s) => s.majors >= 2);
		return query === '' ? base : base.filter((s) => s.name.toLowerCase().includes(query));
	}, [stats, query]);
	const maxEx = Math.max(1, ...cls.majors.map((m) => m.ex.length));

	return (
		<section className="cc-block">
			<header className="cc-block-head">
				<h3>专业 × 课程矩阵</h3>
				<p>
					圆点数量表示该课程在此专业几份示例中出现（最多 {maxEx} 份）；无点即该专业未采用。
					覆盖全部专业的课程行以强调色标出。
				</p>
			</header>
			<div className="cc-matrix-wrap">
				<table className="cc-matrix">
					<thead>
						<tr>
							<th className="cc-mx-course">课程</th>
							{cls.majors.map((m) => (
								<th key={m.code} title={`${m.name} ${m.code}`}>
									<span>{m.name.replace(/科学与工程|科学$/, '')}</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((s) => {
							const full = s.majors === cls.majors.length;
							return (
								<tr
									key={s.name}
									className={full ? 'full' : ''}
									onMouseEnter={() => setHover(s.name)}
									onMouseLeave={() => setHover('')}
								>
									<td className="cc-mx-course">
										<span title={s.name}>{s.name}</span>
									</td>
									{cls.majors.map((m) => {
										const n = s.perMajor[m.name] || 0;
										return (
											<td
												key={m.code}
												className={n > 0 ? 'hit' : ''}
												title={`${m.name} · ${s.name}：${n > 0 ? `${n} 份示例采用` : '未采用'}`}
											>
												{hover === s.name && n === 0 ? (
													<span className="miss" />
												) : (
													Array.from({ length: n }, (_, k) => <i key={k} />)
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
				{rows.length === 0 && <p className="cc-empty">没有匹配的课程</p>}
			</div>
		</section>
	);
}
