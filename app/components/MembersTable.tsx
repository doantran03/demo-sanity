'use client';

import { Edit2, Plus, Trash2, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Member } from '@/app/types/member';
import { useState, useMemo } from 'react';
import Image from 'next/image';

interface MembersTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 7;

const getGenderLabel = (gender: string) => {
  const labels: Record<string, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  };
  return labels[gender] || gender;
};

export default function MembersTable({
  members,
  onEdit,
  onDelete,
  onAddNew,
  isLoading,
}: MembersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Logic phân trang
  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
  
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return members.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, members]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Member List</h2>
        </div>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">Date of Birth</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-gray-500 font-medium">Loading members...</span>
                  </div>
                </td>
              </tr>
            ) : currentTableData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <User size={40} className="text-gray-300" />
                    <p>No members found. Click Add Member to start.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentTableData.map((member) => (
                <tr key={member.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-100 shadow-sm bg-gray-50 flex-shrink-0">
                        {member.avatar ? (
                          <Image 
                            src={member.avatar} 
                            alt={member.fullName} 
                            fill
                            sizes="40px"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900 line-clamp-1">{member.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.gender === 'male' ? 'bg-blue-100 text-blue-700' : 
                      member.gender === 'female' ? 'bg-pink-100 text-pink-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getGenderLabel(member.gender)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {member.dob 
                      ? new Date(member.dob).toLocaleDateString('vi-VN') 
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(member)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Member"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(member.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && members.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * ITEMS_PER_PAGE, members.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-900">{members.length}</span> members
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    currentPage === page 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                      : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}