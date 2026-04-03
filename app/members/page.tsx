'use client';

import Header from '@/app/components/Header';
import MemberModal from '@/app/components/MemberModal';
import MembersTable from '@/app/components/MembersTable';
import Sidebar from '@/app/components/Sidebar';
import {
  createMember,
  deleteMember,
  fetchMembers,
  updateMember,
} from '@/app/lib/memberService';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Member } from '@/app/types/member';

export default function MembersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch members on mount
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddNew = () => {
    setSelectedMember(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const success = await deleteMember(id);
        if (success) {
          setMembers(members.filter((m) => m.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete member:', error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMember(undefined);
  };

  const handleSubmit = async (data: Partial<Member>) => {
    setIsSubmitting(true);

    try {
      if (selectedMember) {
        const updated = await updateMember(selectedMember.id, data);
        if (updated) {
          setMembers(
            members.map((m) =>
              m.id === selectedMember.id ? { ...m, ...data } : m
            )
          );
        }
      } else {
        const newMember = await createMember(data);
        if (newMember) {
          setMembers([...members, newMember]);
        }
      }
      handleModalClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Home
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-semibold">Members</span>
              </nav>
            </div>

            {/* Table Section */}
            <MembersTable
              members={members}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>

      {/* Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        member={selectedMember}
        isLoading={isSubmitting}
        allMembers={members}
      />
    </div>
  );
}