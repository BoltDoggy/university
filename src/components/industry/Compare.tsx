import { useMemo, useState } from 'react';
import { solidColor, type IndNode, type IndStatRow } from './shared';

const METRIC_LABEL: Record<CompareMetric, string> = { d: '大类', z: '中类', x: '小类' };
type CompareMetric = 'd' | 'z' | 'x';

interface Props {
	tree: IndNode[];
	stats: Record<string, IndStatRow>;
}

/** 2017 版 vs 2011 版各门类分类数量对比,可切换大/中/小类口径 */
export default function Compare({ tree, stats }: Props) {
	const [metric, setMetric] = useState<CompareMetric>('x');

	const rows = useMemo(
		() =>
			tree
				.map((m, i) => {
					const s = stats[m.c] ?? ({} as Partial<IndStatRow>);
					const oldKey: 'd11' | 'z11' | 'x11' = `${metric}11`;
					return { code: m.c, name: m.n, menIdx: i, cur: s[metric] ?? 0, old: s[oldKey] ?? 0 };
				})
				.sort((a, b) => b.cur - a.cur || b.old - a.old),
		[tree, stats, metric],
	);
	const max = Math.max(...rows.map((r) => Math.max(r.cur, r.old)), 1);

	return (
		<section className="card">
			<div className="card-head">
				<div>
					<h2>2017 版 vs 2011 版规模对比</h2>
					<p className="card-desc">各门类在新旧两版标准下的分类数量变化。</p>
				</div>
				<div className="seg">
					{(['d', 'z', 'x'] as const).map((k) => (
						<button
							key={k}
							type="button"
							className={metric === k ? 'on' : ''}
							onClick={() => setMetric(k)}
						>
							{METRIC_LABEL[k]}
						</button>
					))}
				</div>
			</div>
			<div className="cmp-legend">
				<span>
					<i className="sw sw17"></i>2017 版(现行)
				</span>
				<span>
					<i className="sw sw11"></i>2011 版
				</span>
			</div>
			<div className="cmp-rows">
				{rows.map((r) => {
					// 最大宽度留 18% 给条末数值标签,避免溢出
					const w = (v: number) => `${Math.max((v / max) * 82, v > 0 ? 1.2 : 0)}%`;
					const diff = r.cur - r.old;
					const deltaCls = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
					const deltaTxt = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '0';
					return (
						<div className="cmp-row" key={r.code}>
							<div className="cmp-label" title={`${r.code} ${r.name}`}>
								<i className="dot" style={{ background: solidColor(r.menIdx) }} />
								<b>{r.code}</b>
								<span>{r.name}</span>
							</div>
							<div className="cmp-bars">
								<div
									className="bar bar17"
									style={{ width: w(r.cur), background: solidColor(r.menIdx) }}
								>
									<span>{r.cur}</span>
								</div>
								<div className="bar bar11" style={{ width: w(r.old) }}>
									<span>{r.old}</span>
								</div>
							</div>
							<div className={`delta ${deltaCls}`}>{deltaTxt}</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
