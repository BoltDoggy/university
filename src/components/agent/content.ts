/** 大模型与智能体课程内容（通识整理） */
export const agent = {
	name: '大模型与智能体',
	intro:
		'大模型与智能体（LLMs and Agents）是大模型浪潮催生的新一代综合实践课：以大模型为推理引擎，通过提示工程、检索增强、工具调用、规划记忆与多智能体协作，构建能自主完成复杂任务的 AI 系统。课程以「构建」为主线——每个模块都对应一个可运行的项目，是从模型使用走向系统创造的实战入口。',
	modules: [
		{ icon: '🧩', title: '大模型应用基础', desc: '把模型当组件：API 生态、选型与成本是工程的第一课。', topics: ['模型选型与 API', '上下文窗口管理', '结构化输出与解析', '成本与延迟权衡'] },
		{ icon: '💬', title: '提示工程实战', desc: '从「会聊」到「可靠」：让提示成为可测试的代码资产。', topics: ['提示模式库', 'Few-shot 与思维链', 'JSON 结构化输出', '提示评测与回归'] },
		{ icon: '🔍', title: 'RAG 系统构建', desc: '检索增强生成工程化：给智能体装上外接知识。', topics: ['文档切分与嵌入', '混合检索与重排', '引用与溯源', 'RAG 效果评测'] },
		{ icon: '🔧', title: '工具调用与函数', desc: '让模型操作真实世界：从函数调用到 MCP 协议。', topics: ['函数调用协议', 'MCP 模型上下文协议', '代码解释器', '沙箱与权限安全'] },
		{ icon: '🗺️', title: '规划与记忆', desc: '智能体的「大脑」：任务分解、反思纠错与长期记忆。', topics: ['ReAct 范式', '任务分解与规划', '反思与自纠错', '记忆系统设计'] },
		{ icon: '👥', title: '多智能体协作', desc: '角色分工的群体智能：协作、辩论与模拟社会。', topics: ['角色与协作拓扑', '智能体通信协议', '辩论与投票机制', '社会模拟'] },
		{ icon: '🏗️', title: '智能体框架与工程', desc: '从 demo 到生产：状态、容错与人机协同。', topics: ['LangGraph 等主流框架', '状态管理与容错', '人机协同 HITL', '可观测性'] },
		{ icon: '📊', title: '评测与安全上线', desc: '智能体不可靠就没有价值：评测、防御与合规。', topics: ['任务基准评测', '在线实验与监控', '注入攻击防御', '合规与审计'] },
	],
	prereq: ['大模型技术', '深度学习', '程序设计', '软件工程基础'],
	parallel: ['AI 应用工程', '数据工程'],
	follow: ['多模态智能体', '具身智能', '自动化科研', 'AI 产品工程'],
	books: [
		{ name: 'Hands-On Large Language Models', meta: 'Alammar & Grootendorst', note: '可视化讲解 LLM 原理与应用开发' },
		{ name: 'Prompt Engineering Guide', meta: 'DAIR.AI · 免费在线', note: '提示工程最系统的开源指南' },
		{ name: 'LangGraph 官方教程', meta: '文档即教材', note: '智能体编排的事实标准框架' },
		{ name: '《构建高效智能体》等工程指南', meta: 'Anthropic · 免费在线', note: '一线厂商的智能体设计方法论' },
	],
	labs: [
		{ name: 'OpenAI / Anthropic Cookbook', note: '官方示例库，覆盖主流智能体模式' },
		{ name: 'LangGraph / AutoGen 实战', note: '从单智能体到多智能体系统的搭建' },
		{ name: 'GAIA / SWE-bench 挑战', note: '在公开智能体基准上复现与改进' },
	],
};
