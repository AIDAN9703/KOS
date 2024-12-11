'use client';

import { useState, useEffect } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { BookingStatus, isBookingStatus, type Booking } from '@/types/types';
import { format } from 'date-fns';
import { Eye, MessageSquare, RefreshCw, Trash2, Pencil } from 'lucide-react';
import { BookingDetailsModal } from '@/components/admin/bookings/BookingDetailsModal';
import { EditBookingModal } from '@/components/admin/bookings/EditBookingModal';

export default function AdminBookingsPage() {
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const { 
    bookings, 
    pagination,
    analytics,
    isLoading,
    updateStatus,
    addNote,
    reassignBooking,
    bulkUpdate,
    generateReport,
    updateBooking
  } = useBookings({
    search,
    ...(statusFilter && { status: statusFilter as BookingStatus }),
    page,
    ...dateRange
  });

  useEffect(() => {
    if (bookings?.length === 0 && page > 1) {
      setPage(prev => prev - 1);
    }
  }, [bookings, page]);

  const handleStatusChange = async (bookingId: number, status: BookingStatus) => {
    await updateStatus.mutateAsync({ id: bookingId, status });
  };

  const handleBulkStatusChange = async (newStatus: BookingStatus) => {
    if (!isBookingStatus(newStatus)) return;
    
    await bulkUpdate.mutateAsync({
      bookingIds: selectedBookings,
      data: { status: newStatus }
    });
    setSelectedBookings([]);
  };

  const handleAddNote = async (bookingId: number) => {
    const note = prompt('Enter note:');
    if (note) {
      await addNote.mutateAsync({ id: bookingId, note });
    }
  };

  const handleReassignBooking = async (bookingId: number) => {
    const newBoatId = prompt('Enter new boat ID:');
    if (newBoatId) {
      await reassignBooking.mutateAsync({ 
        id: bookingId, 
        newBoatId: parseInt(newBoatId, 10) 
      });
    }
  };

  const handleGenerateReport = async () => {
    const startDate = dateRange.startDate || format(new Date().setDate(1), 'yyyy-MM-dd');
    const endDate = dateRange.endDate || format(new Date(), 'yyyy-MM-dd');
    await generateReport.mutateAsync({ startDate, endDate, format: 'csv' });
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleEditBooking = async (bookingId: number, data: Partial<Booking>) => {
    await updateBooking.mutateAsync({ id: bookingId, data });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Booking Management</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-[#1e2738] border-gray-700 text-white placeholder-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-[#1e2738] border-gray-700 text-white"
          >
            <option value="">All Statuses</option>
            {Object.values(BookingStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-4 py-2 border rounded-lg bg-[#1e2738] border-gray-700 text-white"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-4 py-2 border rounded-lg bg-[#1e2738] border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1e2738] p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-white">Total Bookings</h3>
            <p className="text-2xl text-white">{analytics.totalBookings}</p>
          </div>
          <div className="bg-[#1e2738] p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
            <p className="text-2xl text-white">{analytics.recentBookings}</p>
          </div>
          <div className="bg-[#1e2738] p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-white">Cancellation Rate</h3>
            <p className="text-2xl text-white">{analytics.cancellationRate.toFixed(1)}%</p>
          </div>
          <div className="bg-[#1e2738] p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
            <p className="text-2xl text-white">${analytics.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <div className="bg-[#1e2738] p-4 rounded-lg shadow flex gap-4">
          <button 
            onClick={() => handleBulkStatusChange(BookingStatus.CONFIRMED)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirm Selected
          </button>
          <button 
            onClick={() => handleBulkStatusChange(BookingStatus.CANCELLED)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel Selected
          </button>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-[#1e2738] rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#1a2234]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked && bookings) {
                      setSelectedBookings(bookings.map((b: { id: any; }) => b.id));
                    } else {
                      setSelectedBookings([]);
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Boat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {bookings?.map((booking: Booking) => (
              <tr key={booking.id} className="hover:bg-gray-800">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedBookings.includes(booking.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBookings([...selectedBookings, booking.id]);
                      } else {
                        setSelectedBookings(selectedBookings.filter(id => id !== booking.id));
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{booking.user.firstName} {booking.user.lastName}</div>
                  <div className="text-sm text-gray-400">{booking.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{booking.boat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {format(new Date(booking.startDate), 'PPP')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                    className="border rounded px-2 py-1 text-sm bg-[#1e2738] text-white"
                  >
                    {Object.values(BookingStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="text-blue-400 hover:text-blue-300"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleAddNote(booking.id)}
                      className="text-green-400 hover:text-green-300"
                      title="Add Note"
                    >
                      <MessageSquare size={18} />
                    </button>
                    <button
                      onClick={() => handleReassignBooking(booking.id)}
                      className="text-orange-400 hover:text-orange-300"
                      title="Reassign Booking"
                    >
                      <RefreshCw size={18} />
                    </button>
                    <button
                      onClick={() => setEditingBooking(booking)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Edit Booking"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {/* TODO: Delete booking */}}
                      className="text-red-400 hover:text-red-300"
                      title="Delete Booking"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.total)}{' '}
            of {pagination.total} results
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setPage(page => page - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border border-gray-700 rounded disabled:opacity-50 text-white bg-[#1e2738] hover:bg-[#2a3441]"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page => page + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border border-gray-700 rounded disabled:opacity-50 text-white bg-[#1e2738] hover:bg-[#2a3441]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleGenerateReport}
        className="px-4 py-2 bg-[#21336a] text-white rounded hover:bg-[#2a4086]"
      >
        Export Bookings
      </button>

      {/* Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
      />

      <EditBookingModal
        booking={editingBooking}
        isOpen={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        onSave={handleEditBooking}
      />
    </div>
  );
}