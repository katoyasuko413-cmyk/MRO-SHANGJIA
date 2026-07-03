import React, { useState, useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { Order } from '../../models/order';

interface DeliveryNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

function detectUnit(specification: string, name: string): string {
  const text = (specification + name).toLowerCase();
  if (text.includes('盒')) return '盒';
  if (text.includes('支')) return '支';
  if (text.includes('套')) return '套';
  if (text.includes('个')) return '个';
  if (text.includes('件')) return '件';
  if (text.includes('把')) return '把';
  if (text.includes('双')) return '双';
  if (text.includes('台')) return '台';
  if (text.includes('箱')) return '箱';
  if (text.includes('包')) return '包';
  return '个';
}

function generateQRCodeSVG(text: string) {
  const size = 21;
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

  const fillRect = (x: number, y: number, w: number, h: number, val: boolean) => {
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (y + r < size && x + c < size) {
          matrix[y + r][x + c] = val;
        }
      }
    }
  };

  // Finder pattern TL
  fillRect(0, 0, 7, 7, true);
  fillRect(1, 1, 5, 5, false);
  fillRect(2, 2, 3, 3, true);

  // Finder pattern TR
  fillRect(14, 0, 7, 7, true);
  fillRect(15, 1, 5, 5, false);
  fillRect(16, 2, 3, 3, true);

  // Finder pattern BL
  fillRect(0, 14, 7, 7, true);
  fillRect(1, 15, 5, 5, false);
  fillRect(2, 16, 3, 3, true);

  // Timing patterns
  for (let i = 8; i < 13; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern
  fillRect(14, 14, 5, 5, true);
  fillRect(15, 15, 3, 3, false);
  matrix[16][16] = true;

  // Let's hash text to fill in data patterns
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r < 8 && c < 8) continue;
      if (r < 8 && c > 12) continue;
      if (r > 12 && c < 8) continue;
      if (r === 6 || c === 6) continue;
      if (r >= 14 && r <= 18 && c >= 14 && c <= 18) continue;

      const cellHash = Math.abs((hash ^ (r * 13) ^ (c * 37)) % 100);
      matrix[r][c] = cellHash < 48;
    }
  }

  const paths: string[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        paths.push(`M${c},${r} h1 v1 h-1 z`);
      }
    }
  }

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      className="w-full h-full text-slate-800"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      <path d={paths.join(' ')} />
    </svg>
  );
}

export function DeliveryNoteModal({ isOpen, onClose, order }: DeliveryNoteModalProps) {
  const [purchaser, setPurchaser] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [procurementEngineer, setProcurementEngineer] = useState('王国秀');
  const [techEngineer, setTechEngineer] = useState('');
  const [recipientContact, setRecipientContact] = useState('');

  const [supplier, setSupplier] = useState('北京鹏龙天创物资贸易有限公司');
  const [shipperContact, setShipperContact] = useState('');
  const [shipperPhone, setShipperPhone] = useState('');
  const [logisticsCompany, setLogisticsCompany] = useState('');
  const [logisticsNumber, setLogisticsNumber] = useState('');
  const [logisticsContact, setLogisticsContact] = useState('');
  const [logisticsPhone, setLogisticsPhone] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');

  const [deliverer, setDeliverer] = useState('');
  const [receiver, setReceiver] = useState('');

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (order) {
      setPurchaser(order.purchaserName || '');
      setRecipientAddress(order.recipientAddress || '');
      setPoNumber(order.salesOrderNo || '');
      setProcurementEngineer(order.recipientName || '王国秀');
      setRecipientContact(`${order.recipientName || ''}, ${order.recipientPhone || ''}`);
      setSupplier('北京鹏龙天创物资贸易有限公司');
      setLogisticsCompany(order.deliveryMethod || '顺丰速运');
      setItems(order.items.map(item => ({
        ...item,
        unit: detectUnit(item.specification, item.name),
        arrivalQuantity: item.shippedQuantity || item.quantity,
        remark: item.requirementDesc || ''
      })));
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Dynamic Printing Style Block */}
      <style>{`
        @media print {
          /* Hide everything except the print area */
          body * {
            visibility: hidden;
            background: transparent !important;
          }
          #delivery-note-print-overlay, #delivery-note-print-overlay * {
            visibility: hidden;
          }
          #delivery-note-print-container, #delivery-note-print-container * {
            visibility: visible;
          }
          #delivery-note-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
          }
          /* Ensure borders print crisply and text remains legible */
          .print-border {
            border-color: #334155 !important;
          }
          /* Custom layout fixes for print inputs */
          input, textarea {
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      <div id="delivery-note-print-overlay" className="bg-white rounded-2xl shadow-xl w-full max-w-[1240px] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-shrink-0 items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600 font-bold text-sm">供货单预览 / 打印</span>
            <span className="text-xs text-slate-500 font-semibold">阅览并直接打印此供货单</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-lg shadow-emerald-100 transition-all cursor-pointer"
            >
              <Printer size={16} />
              打印供货单
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          
          {/* Main Delivery Note Printable Area */}
          <div 
            id="delivery-note-print-container" 
            className="bg-white border border-slate-400 p-8 shadow-sm max-w-[1180px] mx-auto text-slate-900 font-sans leading-normal select-text"
          >
            {/* Delivery Note Header Title with centered title and right-aligned QR Code */}
            <div className="relative mb-6 flex items-center justify-between">
              {/* Invisible spacer to keep the title perfectly centered */}
              <div className="w-[110px] h-1 shrink-0" />
              
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold tracking-wider text-black">供货单</h1>
                <h2 className="text-base font-bold tracking-widest text-slate-800">Delivery Note</h2>
              </div>
              
              {/* QR Code Container matching exactly the user's highlighted region */}
              <div id="delivery-note-qrcode" className="w-[110px] flex flex-col items-center gap-1 p-1 bg-white border border-slate-300 rounded shrink-0">
                <div className="w-[90px] h-[90px]">
                  {generateQRCodeSVG(poNumber || "S0202403210001")}
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-600 tracking-tight">
                  {poNumber || "S0202403210001"}
                </span>
              </div>
            </div>

            {/* Infobox Grid structure */}
            <div className="border-t border-l border-slate-700 text-xs">
              
              {/* Row 1 */}
              <div className="flex min-h-[38px]">
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  收货方：
                </div>
                <div className="w-[48%] border-r border-b border-slate-700 p-2 flex items-center text-slate-800 font-semibold">
                  {purchaser || ''}
                </div>
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  发货方：
                </div>
                <div className="w-[28%] border-b border-slate-700 p-2 flex items-center text-slate-800 font-semibold">
                  {supplier || ''}
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex min-h-[38px]">
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  交货地点：
                </div>
                <div className="w-[48%] border-r border-b border-slate-700 p-2 flex items-center text-slate-800">
                  {recipientAddress || ''}
                </div>
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  发货联系人：
                </div>
                <div className="w-[12%] border-r border-b border-slate-700 p-2 flex items-center justify-center text-center text-slate-800">
                  {shipperContact || ''}
                </div>
                <div className="w-[6%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  电话：
                </div>
                <div className="w-[10%] border-b border-slate-700 p-2 flex items-center justify-center text-center font-mono text-slate-800">
                  {shipperPhone || ''}
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex min-h-[38px]">
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  采购订单号PO：
                </div>
                <div className="w-[48%] border-r border-b border-slate-700 p-2 flex items-center font-mono text-slate-800">
                  {poNumber || ''}
                </div>
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  物流公司：
                </div>
                <div className="w-[28%] border-b border-slate-700 p-2 flex items-center text-slate-800">
                  {logisticsCompany || ''}
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex min-h-[38px]">
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  采购工程师：
                </div>
                <div className="w-[48%] border-r border-b border-slate-700 p-2 flex items-center text-slate-800">
                  {procurementEngineer || ''}
                </div>
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  物流单号：
                </div>
                <div className="w-[28%] border-b border-slate-700 p-2 flex items-center font-mono text-slate-800">
                  {logisticsNumber || ''}
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex min-h-[38px]">
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  技术工程师：
                </div>
                <div className="w-[48%] border-r border-b border-slate-700 p-2 flex items-center text-slate-800">
                  {techEngineer || ''}
                </div>
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  物流联系人：
                </div>
                <div className="w-[12%] border-r border-b border-slate-700 p-2 flex items-center justify-center text-center text-slate-800">
                  {logisticsContact || ''}
                </div>
                <div className="w-[6%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  电话：
                </div>
                <div className="w-[10%] border-b border-slate-700 p-2 flex items-center justify-center text-center font-mono text-slate-800">
                  {logisticsPhone || ''}
                </div>
              </div>

              {/* Row 6 */}
              <div className="flex min-h-[38px]">
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  收货人及电话：
                </div>
                <div className="w-[48%] border-r border-b border-slate-700 p-2 flex items-center text-slate-800">
                  {recipientContact || ''}
                </div>
                <div className="w-[12%] bg-slate-100 border-r border-b border-slate-700 p-2 font-medium flex items-center justify-center text-center">
                  到货时间：
                </div>
                <div className="w-[28%] border-b border-slate-700 p-2 flex items-center text-slate-800">
                  {arrivalTime || ''}
                </div>
              </div>

            </div>

            {/* Commodity Material Table structure */}
            <div className="mt-4">
              <table className="w-full border-collapse border border-slate-700 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold text-slate-800">
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[5%]">序号<br/>Item</th>
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[14%]">物料号<br/>SRM No.</th>
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[26%]">产品名称<br/>Description</th>
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[18%]">型号&订货号<br/>Type No.&Order No</th>
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[10%]">品牌<br/>Brand</th>
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[6%]">单位<br/>Unit</th>
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[7%]">总数量<br/>Total quantity</th>
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[10%]">到货数量<br/>Arrival quantity</th>
                    <th rowSpan={2} className="border border-slate-700 p-1.5 w-[10%]">备注<br/>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="text-center font-normal hover:bg-slate-50/50">
                      <td className="border border-slate-700 p-2 text-slate-600 font-mono text-center">
                        {index + 1}
                      </td>
                      <td className="border border-slate-700 p-2 text-center font-mono">
                        {item.sku || ''}
                      </td>
                      <td className="border border-slate-700 p-2 text-left font-medium">
                        {item.name || ''}
                      </td>
                      <td className="border border-slate-700 p-2 text-center">
                        {item.model || item.specification || ''}
                      </td>
                      <td className="border border-slate-700 p-2 text-center">
                        {item.brand || ''}
                      </td>
                      <td className="border border-slate-700 p-2 text-center">
                        {item.unit || ''}
                      </td>
                      <td className="border border-slate-700 p-2 text-center font-mono">
                        {item.quantity ?? ''}
                      </td>
                      <td className="border border-slate-700 p-2 text-center font-mono font-bold text-slate-900">
                        {item.arrivalQuantity ?? ''}
                      </td>
                      <td className="border border-slate-700 p-2 text-center text-slate-500">
                        {item.remark || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Bottom Signatures */}
            <div className="mt-8 flex justify-between items-end text-xs text-slate-800 px-2 font-medium relative">
              <div className="flex items-center gap-2 relative z-10">
                <span>送货人：</span>
                <span className="font-semibold">{deliverer || ''}</span>
              </div>

              {/* Sender Official Seal / Stamp */}
              <div className="absolute -top-12 left-12 pointer-events-none select-none z-0 transform -rotate-6 opacity-85 print:opacity-100 hover:opacity-100 transition-opacity">
                <svg width="112" height="112" viewBox="0 0 120 120" className="drop-shadow-[0_1px_2px_rgba(239,68,68,0.15)]">
                  {/* Outer double circle representing classic official stamps */}
                  <circle cx="60" cy="60" r="56" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                  <circle cx="60" cy="60" r="53" stroke="#ef4444" strokeWidth="1" fill="none" className="opacity-80" />
                  
                  <defs>
                    {/* Circle path starting from slightly left to right for curved text mapping */}
                    <path id="seal-text-path" d="M 12 60 A 48 48 0 0 1 108 60" fill="none" />
                  </defs>
                  
                  <text fill="#ef4444" fontSize="7.8" fontWeight="bold">
                    <textPath href="#seal-text-path" startOffset="50%" textAnchor="middle">
                      北京鹏龙天创物资贸易有限公司
                    </textPath>
                  </text>
                  
                  {/* Beautiful crisp five-pointed star in the core */}
                  <polygon points="60,42 64,52 75,52 66,59 69,70 60,63 51,70 54,59 45,52 56,52" fill="#ef4444" />
                  
                  {/* Stamp usage text horizontally positioned */}
                  <text x="60" y="85" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="2">
                    供货专用章
                  </text>
                </svg>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <span>收货人：</span>
                <span className="font-semibold">{receiver || ''}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
