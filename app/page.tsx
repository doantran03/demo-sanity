import { client } from '@/sanity/lib/client';
import FamilyTreeChart from './components/FamilyTreeChart';

export interface Member {
  id: string;
  fullname: string;
  gender: 'male' | 'female' | 'other';
  dob?: string;
  avatar?: string;
  mid?: string;
  fid?: string;
  pids?: string[];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const members: Member[] = await client.fetch(
    `*[_type == "member"]{
      "id": _id,
      "fullname": fullName,
      "gender": gender,
      "dob": dob,
      "avatar": avatar.asset->url,
      "mid": mid._ref,
      "fid": fid._ref,
      "pids": coalesce(pids[]._ref, [])
    }`,
    {},
    {
      next: { revalidate: 0 }
    }
  );

  console.log('Fetched members:', members);

  return (
    <main style={{ padding: '20px' }}>
      <h1>Gia phả</h1>
      <div style={{ marginTop: '20px', border: '1px solid #444' }}>
        <FamilyTreeChart data={members} />
      </div>  
    </main>
  );
}