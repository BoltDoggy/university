/** 大模型技术课程内容（通识整理） */
export const llm = {
	name: '大模型技术',
	intro:
		'大模型技术（Large Language Models）以 Transformer 为骨架、以缩放定律为方法论，围绕「预训练—对齐—推理—应用」构建起新一代技术栈。课程从预训练与指令对齐的原理出发，覆盖提示工程、检索增强、智能体与部署优化，是理解并构建 AI 应用的系统工程课——国标（2018）发布时 GPT-1 刚问世，这是国标之后诞生的一门全新课程。',
	modules: [
		{ icon: '🏗️', title: '大模型概述', desc: '参数规模引爆能力涌现：GPT、LLaMA 与国产模型谱系。', topics: ['涌现能力', '缩放定律', '主流模型谱系', '开源与闭源生态'] },
		{ icon: '🧱', title: '预训练', desc: '在万亿 token 上学习语言与世界知识的工程与科学。', topics: ['数据工程', 'Tokenizer', '分布式训练', '训练稳定性'] },
		{ icon: '🎯', title: '对齐与后训练', desc: '从「补全机器」到「助手」：让模型有用且可靠。', topics: ['指令微调 SFT', 'RLHF 与 DPO', '安全对齐', '能力评测'] },
		{ icon: '🧩', title: '提示与上下文', desc: '用自然语言编程：不训练模型也能获得新能力。', topics: ['提示工程', '思维链与推理策略', '上下文学习', '结构化输出'] },
		{ icon: '🔍', title: '检索增强生成', desc: '给模型外接记忆与私域知识：RAG 已成应用标配。', topics: ['向量检索', 'RAG 架构', '重排与融合', '知识库问答'] },
		{ icon: '🤖', title: '智能体 Agent', desc: '从回答问题到完成任务：规划、工具与协作。', topics: ['工具与函数调用', '规划与反思', '多智能体协作', 'MCP 生态'] },
		{ icon: '⚡', title: '推理与部署', desc: '把大模型服务化：更快、更省、更稳。', topics: ['KV Cache', '投机解码', '量化与蒸馏', '推理框架 vLLM'] },
		{ icon: '🛡️', title: '安全、评测与治理', desc: '能力越大越要护栏：可信 AI 的工程边界。', topics: ['幻觉评测', '越狱与注入防御', '数据合规', '版权与水印'] },
	],
	prereq: ['深度学习', '自然语言处理', '机器学习导论', '程序设计'],
	parallel: ['分布式系统', '数据工程'],
	follow: ['多模态大模型', 'AI 应用工程', 'AI 安全', '具身智能'],
	books: [
		{ name: '《大语言模型》', meta: '赵鑫 等 · 免费在线', note: '中文系统化教材，从原理到训练' },
		{ name: '《大规模语言模型：从理论到实践》', meta: '复旦大学 NLP 组', note: '配套代码，覆盖训练与部署全链路' },
		{ name: 'Build a LLM from Scratch', meta: 'Raschka', note: '亲手实现一个小型 GPT 的最佳路径' },
		{ name: 'GPT-3 / InstructGPT / LLaMA 论文集', meta: '原始论文', note: '理解范式的第一手材料' },
	],
	labs: [
		{ name: 'nanoGPT / LLM101n', note: 'Karpathy 的从零手搓系列' },
		{ name: 'Hugging Face 生态', note: '从模型加载到微调部署的完整工具链' },
		{ name: 'LangChain / LlamaIndex', note: 'RAG 与智能体应用的主流框架' },
	],
};
