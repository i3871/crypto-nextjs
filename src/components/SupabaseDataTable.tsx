'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface CryptoSymbol {
  id: number;
  symbol: string;
  created_at?: string;
  order_index?: number;
}

interface SupabaseDataTableProps {
  data: CryptoSymbol[];
  title?: string;
  onSymbolRemoved?: () => void;
  onOrderChanged?: () => void;
}

interface SortableRowProps {
  item: CryptoSymbol;
  onRemove: (id: number) => void;
}

function SortableRow({ item, onRemove }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-700 transition-colors ${
        isDragging ? 'bg-gray-600' : 'hover:bg-gray-700/50'
      }`}
    >
      <td className="py-3 px-2 text-center">
        <div
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </td>
      <td className="py-3 px-4 text-white font-mono font-semibold">{item.symbol}</td>
      <td className="py-3 px-4 text-gray-400 text-sm">
        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-400 hover:text-red-300 p-1 hover:bg-red-900/20 rounded transition-colors"
          title="Remove symbol"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

export default function SupabaseDataTable({ data, title = "Crypto Symbols", onSymbolRemoved, onOrderChanged }: SupabaseDataTableProps) {
  const [sortedData, setSortedData] = useState<CryptoSymbol[]>(data);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    setSortedData([...data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
  }, [data]);

  const handleRemove = async (id: number) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('crypto_symbols')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing symbol:', error);
        return;
      }

      if (onSymbolRemoved) {
        onSymbolRemoved();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedData.findIndex((item) => item.id === active.id);
      const newIndex = sortedData.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(sortedData, oldIndex, newIndex);
      setSortedData(newItems);

      // Update order_index in database
      if (supabase) {
        try {
          const updates = newItems.map((item, index) => ({
            id: item.id,
            order_index: index
          }));

          for (const update of updates) {
            const { error } = await supabase
              .from('crypto_symbols')
              .update({ order_index: update.order_index })
              .eq('id', update.id);

            if (error) {
              console.error('Error updating order:', error);
            }
          }

          if (onOrderChanged) {
            onOrderChanged();
          }
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedData.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="w-8"></th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Symbol</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Added</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}