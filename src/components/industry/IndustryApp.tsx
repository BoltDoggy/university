import { useCallback, useMemo, useRef, useState } from 'react';
import { DATA } from '../../data/industry.js';
import Compare from './Compare';
import Explorer from './Explorer';
import Sunburst from './Sunburst';
import { buildIsicRev, buildNodeIndex, buildStatsMaps, buildV2011Rev, type IndustryData } from './shared';

const data = DATA as unknown as IndustryData;

/** 行业分类页交互岛:旭日图 / 新旧对比 / 分类浏览器共享选中与定位状态 */
export default function IndustryApp() {
	const { nodeIndex, leafCount, subCounts, v2011Rev, isicRev } = useMemo(
		() => ({
			nodeIndex: buildNodeIndex(data.tree),
			...buildStatsMaps(data.tree),
			v2011Rev: buildV2011Rev(data.v2011),
			isicRev: buildIsicRev(data.isic),
		}),
		[],
	);

	const [selected, setSelected] = useState<string | null>(null);
	const [reveal, setReveal] = useState<{ code: string; tick: number } | null>(null);
	const tickRef = useRef(0);

	// tick 递增,使重复定位同一 code 也能触发滚动效果
	const revealInTree = useCallback((code: string) => {
		setSelected(code);
		tickRef.current += 1;
		setReveal({ code, tick: tickRef.current });
	}, []);

	return (
		<>
			<Sunburst
				tree={data.tree}
				nodeIndex={nodeIndex}
				leafCount={leafCount}
				subCounts={subCounts}
				onReveal={revealInTree}
			/>
			<Compare tree={data.tree} stats={data.stats} />
			<Explorer
				tree={data.tree}
				nodeIndex={nodeIndex}
				subCounts={subCounts}
				v2011Rev={v2011Rev}
				isicRev={isicRev}
				selected={selected}
				onSelect={setSelected}
				reveal={reveal}
				onReveal={revealInTree}
			/>
		</>
	);
}
