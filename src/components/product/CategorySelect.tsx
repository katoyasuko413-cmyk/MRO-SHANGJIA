import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { MOCK_CATEGORIES, CategoryNode } from '../../mock/industryCategories';

function CustomCheckbox({ checked, indeterminate, onChange, onClick }: { checked: boolean; indeterminate?: boolean; onChange: (c: boolean) => void; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div 
      className={`w-4 h-4 flex-shrink-0 rounded flex items-center justify-center transition-colors cursor-pointer ${checked ? 'bg-blue-600 border-transparent' : indeterminate ? 'bg-blue-600 border-transparent' : 'bg-white border border-slate-300 hover:border-blue-500'}`}
      onClick={(e) => {
        if (onClick) onClick(e);
        onChange(!checked);
      }}
    >
      {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      {!checked && indeterminate && <div className="w-2 h-0.5 bg-white rounded-full" />}
    </div>
  );
}

interface CategorySelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function CategorySelect({ value, onChange, placeholder }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track active traversal path to show selected sub-lists
  const [activePath, setActivePath] = useState<string[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { nodeMap, parentMap } = useMemo(() => {
    const nMap = new Map<string, CategoryNode>();
    const pMap = new Map<string, string>();
    
    const traverse = (nodes: CategoryNode[], parentId?: string) => {
      nodes.forEach(node => {
        nMap.set(node.id, node);
        if (parentId) pMap.set(node.id, parentId);
        if (node.children) traverse(node.children, node.id);
      });
    };
    traverse(MOCK_CATEGORIES);
    return { nodeMap: nMap, parentMap: pMap };
  }, []);

  const handleToggleCheck = (node: CategoryNode, checked: boolean) => {
    const newSelected = new Set(value);

    const addDescendants = (n: CategoryNode) => {
      newSelected.add(n.id);
      if (n.children) {
        n.children.forEach(addDescendants);
      }
    };

    const removeDescendants = (n: CategoryNode) => {
      newSelected.delete(n.id);
      if (n.children) {
        n.children.forEach(removeDescendants);
      }
    };

    const checkAncestors = (nId: string) => {
      const pId = parentMap.get(nId);
      if (pId) {
        const pNode = nodeMap.get(pId);
        if (pNode && pNode.children) {
          const allChildrenSelected = pNode.children.every(c => newSelected.has(c.id));
          if (allChildrenSelected) {
            newSelected.add(pId);
            checkAncestors(pId);
          }
        }
      }
    };

    const uncheckAncestors = (nId: string) => {
      const pId = parentMap.get(nId);
      if (pId) {
        newSelected.delete(pId);
        uncheckAncestors(pId);
      }
    };

    if (checked) {
      addDescendants(node);
      checkAncestors(node.id);
    } else {
      removeDescendants(node);
      uncheckAncestors(node.id);
    }

    onChange(Array.from(newSelected));
  };

  const isChecked = (id: string) => value.includes(id);

  const isIndeterminate = (id: string) => {
    if (value.includes(id)) return false; 
    const node = nodeMap.get(id);
    if (!node || !node.children) return false;
    
    const hasCheckedDescendant = (n: CategoryNode): boolean => {
      if (value.includes(n.id)) return true;
      if (n.children) {
        return n.children.some(c => hasCheckedDescendant(c));
      }
      return false;
    };
    return hasCheckedDescendant(node);
  };

  // Derive the 3 columns based on activePath
  const col1 = MOCK_CATEGORIES;
  const col2 = col1.find(c => c.id === activePath[0])?.children || [];
  const col3 = col2.find(c => c.id === activePath[1])?.children || [];

  const displayValue = value.length > 0 ? `已选择 ${value.length} 项` : (placeholder || '请选择品类');

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`w-full px-3 py-2 text-sm bg-white border rounded-lg cursor-pointer flex items-center justify-between transition-colors shadow-sm ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-400'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value.length > 0 ? 'text-slate-900 font-medium' : 'text-slate-400'}>
          {displayValue}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg z-50 flex overflow-hidden max-h-[300px]">
          {/* Column 1 */}
          <div className="w-48 overflow-y-auto border-r border-slate-100 py-2">
            {col1.map(node => (
              <div 
                key={node.id}
                className={`flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer ${activePath[0] === node.id ? 'bg-blue-50/50 text-blue-600' : 'text-slate-700'}`}
                onMouseEnter={() => setActivePath([node.id])}
              >
                <div className="flex items-center gap-3 flex-1">
                  <CustomCheckbox 
                    checked={isChecked(node.id)}
                    indeterminate={isIndeterminate(node.id)}
                    onChange={(c) => handleToggleCheck(node, c)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm">{node.name}</span>
                </div>
                {node.children && node.children.length > 0 && (
                  <ChevronRight size={16} className="text-slate-400 opacity-50" />
                )}
              </div>
            ))}
          </div>

          {/* Column 2 */}
          {col2.length > 0 && (
            <div className="w-48 overflow-y-auto border-r border-slate-100 py-2 bg-slate-50/30">
              {col2.map(node => (
                <div 
                  key={node.id}
                  className={`flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer ${activePath[1] === node.id ? 'bg-blue-50/50 text-blue-600' : 'text-slate-700'}`}
                  onMouseEnter={() => setActivePath([activePath[0], node.id])}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <CustomCheckbox 
                      checked={isChecked(node.id)}
                      indeterminate={isIndeterminate(node.id)}
                      onChange={(c) => handleToggleCheck(node, c)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm">{node.name}</span>
                  </div>
                  {node.children && node.children.length > 0 && (
                    <ChevronRight size={16} className="text-slate-400 opacity-50" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Column 3 */}
          {col3.length > 0 && (
            <div className="w-48 overflow-y-auto py-2 bg-slate-50/50">
              {col3.map(node => (
                <div 
                  key={node.id}
                  className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <CustomCheckbox 
                      checked={isChecked(node.id)}
                      indeterminate={isIndeterminate(node.id)}
                      onChange={(c) => handleToggleCheck(node, c)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm">{node.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
