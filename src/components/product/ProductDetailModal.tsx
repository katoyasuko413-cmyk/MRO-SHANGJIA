import React from 'react';
import { X } from 'lucide-react';
import { Product } from '../../models/product';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-4 leading-none">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value, span = 1 }: { label: string, value: React.ReactNode, span?: number }) => (
  <div className={`flex flex-col gap-1.5 col-span-${span}`}>
    <span className="text-xs text-slate-500">{label}</span>
    <span className="text-sm text-slate-900 font-medium break-words leading-relaxed">{value || '-'}</span>
  </div>
);

// 模拟操作记录数据
const MOCK_LOGS = [
  { id: 1, operator: '张三 (供应商)', action: '提交审批', time: '2024-03-21 09:10:00', remarks: '新建商品' },
  { id: 2, operator: '李总 (采销)', action: '审核驳回', time: '2024-03-21 10:15:00', remarks: '图片不清晰请重新上传' },
  { id: 3, operator: '张三 (供应商)', action: '重新提交审批', time: '2024-03-21 11:30:00', remarks: '已更新图片' },
  { id: 4, operator: '李总 (采销)', action: '审核通过', time: '2024-03-21 14:00:00', remarks: '信息无误' },
  { id: 5, operator: '王总 (审批)', action: '审批通过', time: '2024-03-21 15:20:00', remarks: '同意上架' },
];

export function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">商品详情</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
            <Section title="基础信息">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
                <Field label="供应商SKU" value={product.supplierSku} />
                <Field label="商品名称" value={product.name} span={2} />
                <Field label="税收分类编码" value={product.taxCode || '-'} />
                <Field label="SKU" value={product.sku} />
                <Field label="SPU" value={product.spu} />
                <Field label="商品合同名称" value={product.contractName} span={2} />
                <Field label="商品品牌" value={product.brand} />
                <Field label="规格" value={product.specification} />
                <Field label="型号" value={product.model} />
                <Field label="单位" value="件" />
                <Field label="应用场景" value={product.scene} />
                <Field label="主品类" value={product.mainCategory} />
                <Field label="副品类" value="五金配件" />
                <Field label="商品标签" value="新品, 热销" />
              </div>
            </Section>

            <Section title="供货信息">
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
                <Field label="货期(天)" value={product.leadTimeDays} />
                <Field label="最小起售量" value="1" />
                <Field label="递增量" value="1" />
                <Field label="限购数量" value="不限" />
              </div>
            </Section>

            <Section title="价格信息">
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
                <Field label="税点" value={`${product.taxRate}%`} />
                <Field label="未税含运采购价" value={`¥${product.purchasePriceExclTax.toFixed(2)}`} />
                <Field label="含税含运采购价" value={`¥${product.purchasePriceInclTax.toFixed(2)}`} />
              </div>
            </Section>

            <Section title="销售区域规则">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <Field label="限售地区" value="新疆维吾尔自治区、西藏自治区" />
                <Field label="销售地区" value="全国其余地区" />
              </div>
            </Section>

            <Section title="品类动态属性">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
                <Field label="规格" value={product.specification} />
                <Field label="材质" value="PVC/不锈钢" />
              </div>
            </Section>

            <Section title="商品标签">
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-medium">新品上架</span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded text-xs font-medium">特价促销</span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded text-xs font-medium">包邮</span>
              </div>
            </Section>

            <Section title="商品图片">
              <div className="flex gap-4">
                {product.images?.length ? (
                  product.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`图片${idx + 1}`} className="w-24 h-24 object-contain bg-slate-50 rounded-lg shrink-0 shadow-sm border border-slate-100" />
                  ))
                ) : product.image.startsWith('http') ? (
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg shrink-0 shadow-sm border border-slate-100" />
                ) : (
                  <div className={`w-24 h-24 rounded-lg shrink-0 ${product.image} flex items-center justify-center font-bold text-slate-400 shadow-sm border border-slate-100`}>主图</div>
                )}
                {!product.images?.length && (
                  <>
                    <div className="w-24 h-24 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 shadow-sm border border-slate-200 border-dashed text-xs">辅图1</div>
                    <div className="w-24 h-24 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 shadow-sm border border-slate-200 border-dashed text-xs">辅图2</div>
                  </>
                )}
              </div>
            </Section>

            <Section title="商品详情">
              {product.detailImages?.length ? (
                <div className="flex flex-col w-full max-w-3xl border border-slate-100 mx-auto">
                  {product.detailImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`详情${idx + 1}`} className="w-full block" />
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 min-h-[120px]">
                  这里是商品详情的富文本内容展示区...
                </div>
              )}
            </Section>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Section title="操作记录">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 w-32">操作人</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 w-40">操作动作</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 w-48">操作时间</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500">备注 / 原因</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-900 font-medium">{log.operator}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            log.action.includes('驳回') ? 'bg-red-50 text-red-600' :
                            log.action.includes('通过') ? 'bg-green-50 text-green-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 font-mono">{log.time}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{log.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex justify-end">
           <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
