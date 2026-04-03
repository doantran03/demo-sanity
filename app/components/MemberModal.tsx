'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Calendar, Search, Upload } from 'lucide-react';
import Image from 'next/image';
import { Member } from '@/app/types/member';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Member>) => Promise<void>;
  member?: Member;
  isLoading?: boolean;
  allMembers?: Member[];
}

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export default function MemberModal({
  isOpen,
  onClose,
  onSubmit,
  member,
  isLoading,
  allMembers = [],
}: MemberModalProps) {
  const [formData, setFormData] = useState<Partial<Member>>({
    id: undefined,
    fullName: '',
    gender: 'male',
    dob: '',
    avatar: undefined,
    mid: '',
    fid: '',
    pids: [],
  });
  const [partnersSearch, setPartnersSearch] = useState('');
  const [showPartnersDropdown, setShowPartnersDropdown] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const partnersDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        partnersDropdownRef.current &&
        !partnersDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPartnersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fullName: '',
        gender: 'male',
        dob: '',
        avatar: undefined,
        mid: '',
        fid: '',
        pids: [],
        id: undefined,
      });
      setPartnersSearch('');
      setShowPartnersDropdown(false);
    }
  }, [isOpen]);

  // Update form data when member changes
  useEffect(() => {
    if (isOpen && member) {
      const newFormData: Partial<Member> = {
        id: member?.id,
        fullName: member?.fullName || '',
        gender: member?.gender || 'male',
        dob: member?.dob
          ? new Date(member.dob).toISOString().split('T')[0]
          : '',
        avatar: member?.avatar,
        mid: member?.mid || '',
        fid: member?.fid || '',
        pids: member?.pids || [],
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(newFormData);
    }
  }, [isOpen, member]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          avatar: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          avatar: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: '',
    }));
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {member ? 'Edit Member' : 'Add New Member'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Full Name & Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || 'male'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date of Birth & Partners Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative flex items-center">
                  <input
                    ref={dateInputRef}
                    type="date"
                    name="dob"
                    value={formData.dob || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker?.()}
                    className="absolute right-3 text-gray-500 hover:text-gray-700 transition p-1"
                  >
                    <Calendar size={18} />
                  </button>
                </div>
              </div>

              {/* Partners */}
              {allMembers.length > 0 && (
                <div ref={partnersDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partners
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setShowPartnersDropdown(!showPartnersDropdown)}
                      className="border border-gray-300 rounded-lg p-2 bg-white cursor-pointer flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div className="flex flex-wrap gap-1 flex-1">
                        {(formData.pids || []).length > 0 ? (
                          (formData.pids || []).map((id) => {
                            const name = allMembers.find((m) => m.id === id)?.fullName;
                            return (
                              <span
                                key={id}
                                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                              >
                                {name}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-gray-500 text-sm">Select partners...</span>
                        )}
                      </div>
                      <span className="text-gray-400">▼</span>
                    </div>

                    {showPartnersDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative flex items-center">
                            <Search size={16} className="absolute left-2 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search partners..."
                              value={partnersSearch}
                              onChange={(e) => setPartnersSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full pl-7 pr-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {allMembers
                            .filter(
                              (m) =>
                                m.id !== formData.id &&
                                m.fullName
                                  .toLowerCase()
                                  .includes(partnersSearch.toLowerCase())
                            )
                            .map((member) => (
                              <label
                                key={member.id}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={(formData.pids || []).includes(member.id)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setFormData((prev: Partial<Member>) => ({
                                      ...prev,
                                      pids: isChecked
                                        ? [...(prev.pids || []), member.id]
                                        : (prev.pids || []).filter((id) => id !== member.id),
                                    }));
                                  }}
                                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700">{member.fullName}</span>
                              </label>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mother & Father Row */}
            {allMembers.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {/* Mother */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother
                  </label>
                  <select
                    name="mid"
                    value={formData.mid || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev: Partial<Member>) => ({
                        ...prev,
                        mid: value || '',
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select Mother</option>
                    {allMembers
                      .filter((m) => m.gender === 'female')
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.fullName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Father */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father
                  </label>
                  <select
                    name="fid"
                    value={formData.fid || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev: Partial<Member>) => ({
                        ...prev,
                        fid: value || '',
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select Father</option>
                    {allMembers
                      .filter((m) => m.gender === 'male')
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.fullName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar
              </label>
              
              {!formData.avatar ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => avatarInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden border border-gray-200 relative group">
                  <Image
                    src={formData.avatar}
                    alt="Avatar preview"
                    width={400}
                    height={128}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
