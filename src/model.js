export const USERS = [
  { id: 'demo001', name: '张三', role: '总经理', dept: '管理层', spaces: ['hr', 'sales', 'legal'], admin: true },
  { id: 'demo002', name: '李四', role: '人事负责人', dept: '人事部', spaces: ['hr'] },
  { id: 'demo003', name: '王五', role: '法务负责人', dept: '法务部', spaces: ['legal'] },
  { id: 'demo004', name: '赵六', role: '销售负责人', dept: '销售部', spaces: ['sales'] },
];
export const SPACES = {
  hr: { name: '人事', en: 'PEOPLE & CULTURE', dept: '人事部', person: '李四', color: '#b9ddc8', modules: ['招聘管理', '员工档案', '入转调离', '考勤休假', '薪酬福利', '绩效与培训'], caption: '让人才被看见，让成长有空间。', metric: '在职员工', value: 128 },
  sales: { name: '销售', en: 'RELATIONSHIPS & GROWTH', dept: '销售部', person: '赵六', color: '#b9ddc8', modules: ['线索管理', '客户管理', '商机管理', '跟进活动', '报价与订单', '合同与回款', '销售目标'], caption: '连接每一次信任，发现新的增长。', metric: '活跃商机', value: 46 },
  legal: { name: '法务', en: 'TRUST & COMPLIANCE', dept: '法务部', person: '王五', color: '#b9ddc8', modules: ['合同管理', '合同审查', '用印管理', '履约管理', '案件与纠纷', '合规风险', '知识产权'], caption: '让每一份承诺，都有可靠的保障。', metric: '履约中合同', value: 86 },
};
export const COMMON = ['首页', '知识问答', '知识库导入', '待办中心', '任务中心', '审批中心', '文档中心', '消息中心', '效能中心'];
export const dayKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function dateBefore(days) { const d = new Date(); d.setDate(d.getDate()-days); return dayKey(d); }
export function rangeFor(preset, custom = {}) {
  const now = new Date(); let start = new Date(now);
  if (preset === '最近7天') start.setDate(now.getDate()-6);
  if (preset === '最近30天') start.setDate(now.getDate()-29);
  if (preset === '本周') start.setDate(now.getDate()-(now.getDay()+6)%7);
  if (preset === '本月') start.setDate(1);
  if (preset === '本季度') start = new Date(now.getFullYear(), Math.floor(now.getMonth()/3)*3, 1);
  if (preset === '本年') start = new Date(now.getFullYear(), 0, 1);
  if (preset === '自定义') return { start: custom.start || dateBefore(6), end: custom.end || dateBefore(0) };
  return { start: dayKey(start), end: dayKey(now) };
}
export function permittedDocs(docs, user, space, extra = false) {
  return docs.filter(d => d.status === '已入库' && (d.space === 'public' || (user.spaces.includes(d.space) && (extra || d.space === space))));
}
export function makeDocs() {
  const definitions = [
    ['public', '员工手册 · 2026版', '企业制度', '12', '公司采用弹性工作制，标准工作时间为每周五天。日常办公时间为 09:00—18:00，午休一小时。员工应通过考勤系统登记出勤，异常情况请于三个工作日内提交说明。', ['考勤','办公','手册','打卡','工作时间']],
    ['public', '信息安全与数据使用规范', '信息安全', '6', '公司业务文件应保存在授权的工作空间内。禁止将客户资料、员工个人信息或合同附件发送到未经授权的外部渠道。申请访问其他部门资料时，需要获得资料负责人的授权。', ['安全','权限','数据','保密']],
    ['hr', '员工入职与转正管理制度', '人事制度', '12', '员工应在试用期结束前 7 个工作日提交转正申请，并附试用期工作总结。直属负责人在收到申请后 3 个工作日内完成评价，人事部核验材料后提交审批。入职当天须完成资料登记、设备领取与入职培训。', ['转正','试用期','入职','申请']],
    ['hr', '员工休假与考勤管理办法', '人事制度', '8', '年假申请应提前 3 个工作日提交，由直属负责人审批。连续休假超过 5 个工作日需部门负责人加签。休假前应完成工作交接，并在系统中登记交接人。可用年假余额以考勤休假页面为准。', ['年假','休假','请假','考勤']],
    ['hr', '招聘与面试操作指引', '操作指南', '5', '招聘需求经部门负责人批准后，由人事部发布岗位。面试采用专业初试与综合复试两个环节。面试官应在面试结束后 24 小时内填写评价。Offer 发放前须完成薪酬审批。', ['招聘','面试','offer','薪酬']],
    ['sales', '销售报价与折扣审批规范', '销售制度', '9', '标准报价以当前有效价格表为准。折扣在 5% 以内由销售负责人审批；折扣超过 5% 时，需提交总经理审批。报价单有效期为 30 天，报价审批完成后方可发送客户。', ['折扣','报价','价格','审批']],
    ['sales', '客户跟进与商机管理手册', '操作指南', '16', '新分配线索应在 24 小时内首次联系。重点商机至少每 7 天更新一次跟进记录。商机阶段包括初步接触、需求确认、方案报价、商务谈判和成交。客户交接时应同步联系人与历史记录。', ['客户','跟进','商机','线索']],
    ['sales', '回款与开票操作指南', '财务协同', '4', '申请开票时须提供合同编号、客户开票信息和对应订单。销售负责人应在约定回款日前 7 天进行提醒；发生逾期时，应登记原因、预计回款时间及后续跟进计划。', ['回款','开票','逾期','订单']],
    ['legal', '合同审查与签署管理规范', '法务制度', '7', '业务部门发起合同审查时，应提供完整合同文本、交易背景和对方主体信息。标准合同审查目标时效为 3 个工作日。涉及非标准责任条款的合同应标注风险并提交专项审批。合同审查完成后方可申请用印。', ['合同','审查','签署','条款']],
    ['legal', '印章使用与保管规范', '法务制度', '4', '用印申请需关联已完成审批的合同或文件，并填写份数及用途。印章由指定保管人管理，不得擅自外借。用印完成后须留存盖章文件扫描件，登记用印时间和经办人。', ['印章','用印','盖章']],
    ['legal', '合规事件上报与整改指引', '合规管理', '11', '发现潜在合规风险时，应在一个工作日内登记风险事项。法务部负责初步分级，指定整改负责人和期限。整改完成后由复核人确认，并保留整改证据和过程记录。', ['风险','合规','整改','事件']],
  ];
  return definitions.map((d,i) => ({ id: `doc-${i}`, space:d[0], title:d[1], category:d[2], page:d[3], content:d[4], keywords:d[5], version:'v2.1', status:'已入库', date:dateBefore(i+1), size:`${(0.3+i*0.27).toFixed(1)} MB`, owner:d[0] === 'public' ? '管理中心' : SPACES[d[0]].person, type:'PDF' }));
}
export function makeEvents() {
  const result=[];
  for(let days=0; days<366; days++) for(const [si,space] of Object.keys(SPACES).entries()) {
    ['知识问答','文档摘要','智能分析'].forEach((feature,fi)=> {
      const seed = (days*17+si*13+fi*7)%23;
      result.push({id:`ev-${space}-${days}-${fi}`,date:dateBefore(days),hour:9+fi*3,space, dept:SPACES[space].dept,employee:fi===0?SPACES[space].person:['陈嘉宁','周予安','林沐'][si],feature, model:fi===1?'模型 B · Pro':'模型 A · Lite',calls:8+seed,saved:45+seed*13,cost:Number((1.7+seed*.48+si*.3).toFixed(2)),input:3200+seed*970,output:1200+seed*320});
    });
  }
  return result;
}
export function filterEvents(events, range, space) { return events.filter(e=>(space==='all'||e.space===space) && e.date>=range.start && e.date<=range.end); }
export function totals(events) { return events.reduce((a,e)=>({calls:a.calls+e.calls,saved:a.saved+e.saved,cost:a.cost+e.cost,input:a.input+e.input,output:a.output+e.output}),{calls:0,saved:0,cost:0,input:0,output:0}); }
export function series(events, range, grain) {
  const map = new Map();
  const bucket=(date,hour=0)=>{const d=new Date(date+'T00:00:00'); if(grain==='小时') return `${date} ${String(hour).padStart(2,'0')}:00`; if(grain==='周'){d.setDate(d.getDate()-(d.getDay()+6)%7);return dayKey(d);}if(grain==='月')return date.slice(0,7);if(grain==='季度')return `${d.getFullYear()} Q${Math.floor(d.getMonth()/3)+1}`;if(grain==='年')return date.slice(0,4);return date;};
  const end=new Date(range.end+'T00:00:00');
  for(let d=new Date(range.start+'T00:00:00');d<=end;d.setDate(d.getDate()+1)){const date=dayKey(d);if(grain==='小时'){for(let h=0;h<24;h++)map.set(bucket(date,h),0);}else map.set(bucket(date),0);}
  events.forEach(e=>map.set(bucket(e.date,e.hour),(map.get(bucket(e.date,e.hour))||0)+e.saved/60));
  return [...map].map(([label,value])=>({label,value}));
}
export function makeTasks() {
  const titles={hr:['产品设计师 · 终面反馈确认','林沐的转正申请','10月新员工入职资料核验','研发团队培训计划审批','年度员工体验调研'],sales:['云栖科技 · 年度合作报价','星河设计 · 商机跟进','北辰集团 · 首期回款确认','十月销售目标复盘','新客户线索分配'],legal:['云栖科技服务合同审查','品牌合作协议用印申请','供应商资质风险复核','年度商标续展材料准备','产品服务协议版本更新']};
  return Object.entries(titles).flatMap(([space,items])=>items.map((title,i)=>({id:`task-${space}-${i}`,space,title,category:['审批','审批','任务','审批','任务'][i],priority:i===0?'高优先级':i===2?'低优先级':'常规',status:i===4?'已完成':'待处理',owner:SPACES[space].person,date:dateBefore(-i),code:`${space.toUpperCase()}-2026-${String(120+i).padStart(4,'0')}`})));
}
export function loadState(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
