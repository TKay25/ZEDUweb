import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
  className?: string;
}

const AccordionItem: React.FC<AccordionItemProps & { 
  isOpen: boolean; 
  onToggle: () => void;
}> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-2">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter(item => item.defaultOpen).map(item => item.title)
  );

  const toggleItem = (title: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(title)
          ? prev.filter(t => t !== title)
          : [...prev, title]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(title) ? [] : [title]
      );
    }
  };

  return (
    <div className={className}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openItems.includes(item.title)}
          onToggle={() => toggleItem(item.title)}
        >
          {item.children}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;