'use client';

import { useState } from 'react';
import { Boat, BoatStatus } from '@/types/types';
import BoatList from '@/components/admin/boats/BoatList';
import AddBoatForm from '@/components/admin/boats/AddBoatForm';
import EditBoatForm from '@/components/admin/boats/EditBoatForm';
import { useBoats } from '@/hooks/useBoats';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

type ActiveTab = 'boats' | 'addBoat' | 'editBoat';

export default function AdminBoatsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('boats');
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BoatStatus | ''>('');
  const [page, setPage] = useState(1);

  const { 
    boats, 
    pagination, 
    isLoading,
  } = useBoats({
    page,
    search,
    status: statusFilter || undefined
  });

  const handleEditBoat = (boat: Boat) => {
    setSelectedBoat(boat);
    setActiveTab('editBoat');
  };

  console.log('Current activeTab:', activeTab);
  console.log('Selected boat:', selectedBoat);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Boat Management</h1>
        {activeTab === 'boats' && (
          <button
            onClick={() => setActiveTab('addBoat')}
            className="px-4 py-2 bg-[#21336a] text-white rounded hover:bg-[#2a4086]"
          >
            Add New Boat
          </button>
        )}
      </div>

      {activeTab === 'boats' && (
        <>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search boats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-[#1e2738] border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BoatStatus | '')}
              className="px-4 py-2 border rounded-lg bg-[#1e2738] border-gray-700 text-white"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="bg-[#1e2738] rounded-lg shadow">
            <BoatList
              boats={boats}
              loading={isLoading}
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setPage}
              onEditBoat={handleEditBoat}
              onDeleteBoat={() => {}} // TODO: Implement handleDeleteBoat
              onUpdateStatus={() => {}} // TODO: Implement handleUpdateStatus
            />
          </div>
        </>
      )}

      {activeTab === 'addBoat' && (
        <div className="bg-[#1e2738] rounded-lg shadow p-6">
          <AddBoatForm 
            onSuccess={() => {
              setActiveTab('boats');
              toast.success('Boat added successfully');
            }} 
          />
        </div>
      )}

      {activeTab === 'editBoat' && selectedBoat && (
        <div className="bg-[#1e2738] rounded-lg shadow p-6">
          <EditBoatForm
            boat={selectedBoat}
            onSuccess={() => {
              setActiveTab('boats');
              setSelectedBoat(null);
              toast.success('Boat updated successfully');
            }}
            onCancel={() => {
              setActiveTab('boats');
              setSelectedBoat(null);
            }}
          />
        </div>
      )}
    </div>
  );
} 