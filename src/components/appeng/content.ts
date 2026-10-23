/** AI 应用工程课程内容（通识整理） */
export const appEng = {
	name: 'AI 应用工程',
	intro:
		'AI 应用工程（AI Engineering / AIPE）研究把模型变成可靠产品的工程学科：从场景与需求定义、数据闭环、实验评测，到模型服务化、MLOps/LLMOps 流水线与可信合规——覆盖从 notebook 原型到线上系统的全生命周期。它是 AI 浪潮能否兑现价值的那一公里。',
	modules: [
		{ icon: '🎯', title: '场景与需求工程', desc: 'AI 产品的需求特殊性：能力不确定，交付要确定。', topics: ['AI 产品思维', '场景可行性评估', '人机分工设计', '验收指标定义'] },
		{ icon: '📦', title: '数据工程闭环', desc: '数据是燃料：采集、清洗、标注与越用越好的飞轮。', topics: ['数据采集与合成', '标注体系与质检', '数据版本管理', '数据飞轮'] },
		{ icon: '🧪', title: '实验与评测', desc: '离线评测到在线实验的阶梯：用数据决定上线。', topics: ['离线指标设计', 'A/B 实验与分流', '在线评价指标', '评测集治理'] },
		{ icon: '🚀', title: '模型服务化', desc: '从 checkpoint 到高可用 API。', topics: ['推理服务架构', '批处理与流式', '弹性伸缩', '网关与配额'] },
		{ icon: '📈', title: 'MLOps 流水线', desc: '训练—部署—监控的自动化流水线。', topics: ['CI/CD for ML', '特征仓库', '模型注册中心', '流水线编排'] },
		{ icon: '🆕', title: 'LLMOps 新实践', desc: '大模型时代的运维新命题：提示、路由与成本。', topics: ['提示版本管理', '网关与模型路由', '成本与缓存', '灰度与回滚'] },
		{ icon: '🛡️', title: '可信与合规', desc: '上线不是终点：安全、隐私与审计是长期功课。', topics: ['内容安全', '隐私与脱敏', '模型审计', '法规遵从'] },
		{ icon: '🏭', title: '行业落地案例', desc: '从推荐到大模型：典型工程范式与踩坑复盘。', topics: ['推荐系统工程', '智能客服', '内容生成管线', '事故复盘'] },
	],
	prereq: ['机器学习导论', '大模型技术', '软件工程', '程序设计'],
	parallel: ['云原生与分布式', '数据库系统'],
	follow: ['MLOps 平台工程', '智能运维 AIOps', '大规模推荐系统', 'AI 产品实践'],
	books: [
		{ name: 'Designing Machine Learning Systems', meta: 'Chip Huyen', note: 'ML 系统设计的工程圣经' },
		{ name: 'AI Engineering', meta: 'Chip Huyen', note: '大模型应用工程的新作，直面 LLM 时代' },
		{ name: 'Machine Learning Engineering', meta: 'Burkov', note: '精炼的 ML 工程实践手册' },
		{ name: 'Rules of Machine Learning', meta: 'Google · 免费在线', note: 'Google 血泪经验的三十几条铁律' },
	],
	labs: [
		{ name: 'MLflow / Kubeflow', note: '开源 MLOps 平台全流程实践' },
		{ name: 'vLLM / Ray Serve', note: '推理服务化与弹性伸缩实战' },
		{ name: 'Langfuse 可观测性', note: 'LLM 应用的追踪、评测与监控' },
	],
};
