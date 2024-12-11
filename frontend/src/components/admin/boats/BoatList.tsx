'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/services/api';
import { Boat, BoatStatus } from '@/types/types';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/dateUtils';
import { Eye, MessageSquare, RefreshCw, Trash2, Pencil } from 'lucide-react';

interface BoatListProps {
  boats: Boat[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditBoat: (boat: Boat) => void;
  onDeleteBoat: (boatId: number) => void;
  onUpdateStatus: (params: { boatId: number; status: BoatStatus }) => void;
}

export default function BoatList({
  boats,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onEditBoat,
  onDeleteBoat,
  onUpdateStatus
}: BoatListProps) {
  useEffect(() => {
    console.log('All boats:', boats);
    boats?.forEach(boat => {
      if (boat.images) {
        console.log('Boat ID:', boat.id);
        console.log('Images:', boat.images);
        console.log('Is Array?', Array.isArray(boat.images));
        console.log('Type:', typeof boat.images);
        if (typeof boat.images === 'string') {
          try {
            const parsed = JSON.parse(boat.images as string);
            console.log('Parsed images:', parsed);
          } catch (e) {
            console.log('Could not parse images string');
          }
        }
      }
    });
  }, [boats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!boats?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No boats found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#1a2234]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Boat</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {boats?.map((boat) => (
            <tr key={boat.id} className="hover:bg-[#2a3441]">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {boat.images?.[0] ? (
                      <img className="h-10 w-10 rounded object-cover" src={boat.images[0]} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-[#21336a] flex items-center justify-center text-white">
                        🚤
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">{boat.name}</div>
                    <div className="text-sm text-gray-400">{boat.location}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">{boat.type}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  boat.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  boat.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {boat.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${boat.pricePerDay}/day
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEditBoat(boat)}
                    className="text-blue-400 hover:text-blue-300"
                    title="Edit Boat"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => console.log('View Details')}
                    className="text-blue-400 hover:text-blue-300"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => console.log('Add Note')}
                    className="text-green-400 hover:text-green-300"
                    title="Add Note"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button
                    onClick={() => onUpdateStatus({ boatId: boat.id, status: boat.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE' })}
                    className="text-orange-400 hover:text-orange-300"
                    title="Toggle Status"
                  >
                    <RefreshCw size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteBoat(boat.id)}
                    className="text-red-400 hover:text-red-300"
                    title="Delete Boat"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
        <div className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-700 rounded disabled:opacity-50 text-white bg-[#1e2738] hover:bg-[#2a3441]"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-700 rounded disabled:opacity-50 text-white bg-[#1e2738] hover:bg-[#2a3441]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}