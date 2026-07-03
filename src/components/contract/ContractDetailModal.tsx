import React from 'react';
import { X, Download } from 'lucide-react';
import { Contract } from '../../models/contract';

interface ContractDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}

export function ContractDetailModal({ isOpen, onClose, contract }: ContractDetailModalProps) {
  if (!isOpen || !contract) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">查看合同</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-xl font-bold text-center text-slate-900 mb-5 tracking-wider">合同</h2>
          
          <div className="border border-slate-300 p-6 h-[450px] overflow-y-auto bg-white mb-6 shadow-inner">
            <div className="space-y-4 text-sm leading-[1.8] text-slate-800">
              <p>
                <strong className="font-bold">第一条 定义</strong><br />
                平台：指由甲方运营的，域名为[平台域名]的“天创MRO商城”网站、移动应用程序及其他技术平台。<br />
                商家：指符合本协议约定条件，并经甲方审核同意，在平台开设店铺进行商品或服务交易的乙方。<br />
                用户：指在平台注册、浏览、购买商品或服务的自然人、法人或其他组织。<br />
                店铺：指甲方在平台为乙方提供的，用于展示、介绍、销售商品及开展相关经营活动的虚拟空间。<br />
                商品：指乙方在店铺内展示、销售的所有产品，包括但不限于工业品、备品备件、劳保用品、办公用品等MRO相关品类。<br />
                服务费：指乙方因使用平台服务而应向甲方支付的费用，具体标准见本协议附件。
              </p>
              
              <p>
                <strong className="font-bold">第二条 入驻条件与资质</strong><br />
                主体资格：乙方应为依法注册并有效存续的企业法人、合伙企业或其他合法经营主体，具备从事相关商品经营的合法资质。<br />
                资质文件：乙方应向甲方提供真实、合法、有效的以下资质文件复印件（加盖公章）：<br />
                (1) 营业执照；<br />
                (2) 法定代表人或负责人身份证明；<br />
                (3) 银行开户许可证；<br />
                (4) 品牌授权书（如涉及品牌销售）；<br />
                (5) 行业许可证书（如《危险化学品经营许可证》等，视商品品类而定）；<br />
                (6) 其他甲方认为必要的证明文件。<br />
                商品质量：乙方承诺其销售的所有商品符合国家、行业及地方的质量标准、安全标准及环保要求，不存在任何权利瑕疵。
              </p>
              
              <p>
                <strong className="font-bold">第三条 平台服务内容</strong><br />
                店铺开设：甲方为乙方提供店铺开设、商品展示、交易撮合、订单管理、数据查询等基础技术服务。<br />
                支付结算：甲方提供或指定第三方支付机构，为交易提供资金代收代付、结算对账等服务。<br />
                营销推广：甲方可根据自身运营策略，为平台及商家提供广告位、促销活动、搜索优化等营销推广服务（部分服务可能另行收费）。<br />
                技术支持：甲方保障平台系统的正常运行，并提供必要的技术支持和维护服务。
              </p>
              
              <p>
                <strong className="font-bold">第四条 商家权利与义务</strong><br />
                信息真实性：乙方应确保其提供的所有信息及资质文件的真实性、准确性、完整性。如发生变更，应在三个工作日内书面通知甲方并更新数据。
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-base px-2">
            <div className="flex items-center gap-3">
              <span className="text-slate-800 font-medium">天创采购人：</span>
              <select 
                className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-[140px] bg-white transition-shadow text-slate-800"
                defaultValue={contract.tianchuangContact && contract.tianchuangContact !== '-' ? contract.tianchuangContact : ''}
              >
                <option value="">请选择</option>
                <option value="李雪琴">李雪琴</option>
                <option value="王建国">王建国</option>
                <option value="张小斐">张小斐</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-800 font-medium">商家对接人：</span>
              <span className="text-slate-800">赵六/13298761231</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-slate-100 flex justify-center gap-4 bg-slate-50/50 rounded-b-2xl text-center">
          {contract.status === '待签署' && (
            <button 
              onClick={onClose}
              className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded shadow-sm shadow-blue-200 transition-colors min-w-[140px]"
            >
              同意条款
            </button>
          )}
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = '#';
              link.download = `合同_${contract.id || '示例'}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded transition-colors flex items-center justify-center gap-2 min-w-[140px]"
          >
            <Download size={18} />
            下载合同
          </button>
        </div>
      </div>
    </div>
  );
}
