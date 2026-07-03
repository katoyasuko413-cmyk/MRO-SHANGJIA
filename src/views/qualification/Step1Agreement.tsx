import React from 'react';

export default function Step1Agreement() {
    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
            <div className="flex items-end gap-3 mb-6 shrink-0">
                <h2 className="text-xl font-bold text-slate-800">平台入驻协议</h2>
                <span className="text-slate-500 text-sm mb-0.5">(V1.0.0)</span>
            </div>

            <div className="border border-slate-200 rounded-xl p-6 overflow-y-auto text-[14px] text-slate-700 leading-relaxed bg-slate-50/50 flex-1 min-h-[300px] mb-2">
                <p className="font-bold mb-2 text-slate-900 text-base">第一条 定义</p>
                <p className="mb-1">平台：指由甲方运营的，域名为 [平台域名] 的“天创MRO商城”网站、移动应用程序及其他技术平台。</p>
                <p className="mb-1">商家：指符合本协议约定条件，并经甲方审核同意，在平台开设店铺进行商品或服务交易的乙方。</p>
                <p className="mb-1">用户：指在平台注册、浏览、购买商品或服务的自然人、法人或其他组织。</p>
                <p className="mb-1">店铺：指甲方在平台为乙方提供的，用于展示、介绍、销售商品及开展相关经营活动的虚拟空间。</p>
                <p className="mb-1">商品：指乙方在店铺内展示、销售的所有产品，包括但不限于工业品、备品备件、劳保用品、办公用品等MRO相关品类。</p>
                <p className="mb-6">服务费：指乙方因使用平台服务而应向甲方支付的费用，具体标准见本协议附件。</p>
                
                <p className="font-bold mb-2 text-slate-900 text-base">第二条 入驻条件与资质</p>
                <p className="mb-1">主体资格：乙方应为依法注册并有效存续的企业法人、合伙企业或其他合法经营主体，具备从事相关商品经营的合法资质。</p>
                <p className="mb-1">资质文件：乙方应向甲方提供真实、合法、有效的以下资质文件复印件（加盖公章）：</p>
                <p className="mb-1">(1) 营业执照；</p>
                <p className="mb-1">(2) 法定代表人或负责人身份证明；</p>
                <p className="mb-1">(3) 银行开户许可证；</p>
                <p className="mb-1">(4) 品牌授权书（如涉及品牌销售）；</p>
                <p className="mb-6">(5) 行业许可证（如涉及特许经营）；</p>
                
                <p className="font-bold mb-2 text-slate-900 text-base">第三条 双方权利与义务</p>
                <p className="mb-1">甲方权利与义务：甲方有权对乙方的入驻资质进行审核，如发现虚假信息可拒绝入驻或终止协议。</p>
                <p className="mb-1">乙方权利与义务：乙方应确保其在平台销售的商品来源合法、质量合格，不侵犯任何第三方的合法权益。</p>
                <p className="mb-4">（请充分阅读协议条款及免责声明，保障您的切实权益......）</p>
                <p className="mb-4 text-slate-400 italic">... 更多协议内容 ...</p>
            </div>
        </div>
    );
}
