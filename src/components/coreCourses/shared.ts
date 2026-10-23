import catalog from '../../data/core-courses.json';

/** core-courses.json 结构：课程条目为 [名称, 学时] 元组，学时为数字（学时）或字符串（周数） */
export type Hours = number | string;
export type Course = [string, Hours];

export interface Example {
	l: string;
	c: Course[];
}

export interface Major {
	code: string;
	name: string;
	base: string[];
	pro: string[];
	ex: Example[];
}

export interface ClassData {
	code: string;
	name: string;
	general: string[];
	common: string[];
	credit: string;
	note: string;
	majors: Major[];
}

export interface Catalog {
	title: string;
	source: string;
	method: string;
	classes: ClassData[];
}

export const data = catalog as unknown as Catalog;

/** 专业类强调色 */
export const classAccent: Record<string, string> = {
	'0807': '#0e7490',
	'0809': '#6d28d9',
};

/** 设有独立介绍页的课程：课程名 → 页面路径 */
export const coursePages: Record<string, string> = {
	操作系统: '/courses/os/',
	人工智能: '/courses/ai/',
};

export interface CourseStat {
	name: string;
	majors: number; // 覆盖专业数（任一示例含该课）
	examples: number; // 出现的示例份数
	hours: number[]; // 各处建议学时（周数不计入）
	perMajor: Record<string, number>; // 专业 → 出现于几份示例
}

/** 聚合一个专业类全部示例，统计每门课程的覆盖情况 */
export function courseStats(cls: ClassData): CourseStat[] {
	const map = new Map<string, CourseStat>();
	for (const m of cls.majors) {
		for (const ex of m.ex) {
			for (const [name, h] of ex.c) {
				let s = map.get(name);
				if (!s) {
					s = { name, majors: 0, examples: 0, hours: [], perMajor: {} };
					map.set(name, s);
				}
				if (!s.perMajor[m.name]) {
					s.perMajor[m.name] = 0;
					s.majors++;
				}
				s.perMajor[m.name]++;
				s.examples++;
				if (typeof h === 'number') s.hours.push(h);
			}
		}
	}
	return [...map.values()].sort(
		(a, b) => b.majors - a.majors || b.examples - a.examples || a.name.localeCompare(b.name, 'zh'),
	);
}

export function hoursLabel(stat: CourseStat): string {
	if (stat.hours.length === 0) return '—';
	const min = Math.min(...stat.hours);
	const max = Math.max(...stat.hours);
	return min === max ? `${min} 学时` : `${min}–${max} 学时`;
}

export const exTotal = (cls: ClassData) => cls.majors.reduce((s, m) => s + m.ex.length, 0);
export const entryTotal = (cls: ClassData) =>
	cls.majors.reduce((s, m) => s + m.ex.reduce((t, e) => t + e.c.length, 0), 0);
