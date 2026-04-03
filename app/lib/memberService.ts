'use server'

import { client } from '@/sanity/lib/client';
import { Member } from '@/app/types/member';

const MEMBER_QUERY_FIELDS = `
  "id": _id,
  fullName,
  gender,
  dob,
  "avatar": avatar.asset->url,
  "mid": mid._ref,
  "fid": fid._ref,
  "pids": pids[]._ref
`;

// Upload image to Sanity and return asset reference
async function uploadImageToSanity(base64String: string): Promise<string | null> {
  try {
    // Extract the base64 data without the data URI prefix
    const base64Data = base64String.split(',')[1] || base64String;
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload as asset
    const asset = await client.assets.upload('image', buffer, {
      filename: `avatar-${Date.now()}.jpg`,
    });

    return asset._id;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Fetch all members
export async function fetchMembers(): Promise<Member[]> {
  try {
    const members = await client.fetch(
      `*[_type == "member"] {
        ${MEMBER_QUERY_FIELDS}
      } | order(fullName asc)`
    );
    return members || [];
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

// Fetch single member by ID
export async function fetchMember(id: string): Promise<Member | null> {
  try {
    const member = await client.fetch(
      `*[_type == "member" && _id == $id][0] {
        ${MEMBER_QUERY_FIELDS}
      }`,
      { id }
    );
    return member || null;
  } catch (error) {
    console.error('Error fetching member:', error);
    return null;
  }
}

// Create new member
export async function createMember(data: Partial<Member>): Promise<Member | null> {
  try {
    let avatarAssetId: string | null = null;
    
    // Upload avatar if provided
    if (data.avatar && typeof data.avatar === 'string' && data.avatar.startsWith('data:')) {
      avatarAssetId = await uploadImageToSanity(data.avatar);
    }

    const newMember = await client.create({
      _type: 'member',
      fullName: data.fullName,
      gender: data.gender || 'male',
      dob: data.dob,
      ...(avatarAssetId && { 
        avatar: { 
          _type: 'image',
          asset: { _type: 'reference', _ref: avatarAssetId }
        }
      }),
      ...(data.mid && { mid: { _type: 'reference', _ref: data.mid } }),
      ...(data.fid && { fid: { _type: 'reference', _ref: data.fid } }),
      ...(data.pids && { 
        pids: data.pids.map(id => ({ 
          _type: 'reference', 
          _ref: id,
          _key: Math.random().toString(36).substring(2, 9)
        })) 
      }),
    });

    // Sau khi tạo xong, ta trả về id thay vì _id để khớp interface
    return { ...newMember, id: newMember._id } as unknown as Member;
  } catch (error) {
    console.error('Error creating member:', error);
    return null;
  }
}

// Update member
export async function updateMember(
  id: string,
  data: Partial<Member>
): Promise<Member | null> {
  try {
    const updates: Record<string, unknown> = {
      fullName: data.fullName,
      gender: data.gender,
      dob: data.dob,
    };

    const fieldsToUnset: string[] = [];

    // Upload avatar if provided as base64
    if (data.avatar && typeof data.avatar === 'string' && data.avatar.startsWith('data:')) {
      const avatarAssetId = await uploadImageToSanity(data.avatar);
      if (avatarAssetId) {
        updates.avatar = { 
          _type: 'image',
          asset: { _type: 'reference', _ref: avatarAssetId }
        };
      }
    } else if (data.avatar === '') {
      // Avatar was deleted
      fieldsToUnset.push('avatar');
    }

    // Xử lý chuyển đổi từ string sang reference object
    if (data.mid !== undefined) {
      if (data.mid && data.mid !== '') {
        updates.mid = { _type: 'reference', _ref: data.mid };
      } else {
        fieldsToUnset.push('mid');
      }
    }
    if (data.fid !== undefined) {
      if (data.fid && data.fid !== '') {
        updates.fid = { _type: 'reference', _ref: data.fid };
      } else {
        fieldsToUnset.push('fid');
      }
    }
    if (data.pids !== undefined) {
      if (data.pids && data.pids.length > 0) {
        updates.pids = data.pids.map(pid => ({ 
          _type: 'reference', 
          _ref: pid,
          _key: Math.random().toString(36).substring(2, 9)
        }));
      } else {
        fieldsToUnset.push('pids');
      }
    }

    let patchOperation = client.patch(id).set(updates);
    if (fieldsToUnset.length > 0) {
      patchOperation = patchOperation.unset(fieldsToUnset);
    }
    
    const updatedMember = await patchOperation.commit();
    return { ...updatedMember, id: updatedMember._id } as unknown as Member;
  } catch (error) {
    console.error('Error updating member:', error);
    return null;
  }
}

// Delete member
export async function deleteMember(id: string): Promise<boolean> {
  try {
    await client.delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting member:', error);
    return false;
  }
}
