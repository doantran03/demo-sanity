'use client';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function FamilyTreeChart({ data }: { data: unknown[] }) {
    const treeRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (isLoaded && treeRef.current && data && typeof FamilyTree !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const family = new FamilyTree(treeRef.current, {
                mouseScrool: 0, // FamilyTree.none
                mode: 'dark',
                template: 'hugo',
                roots: ["0addeb54-45b7-469b-9cac-5ecd3630a8b8"],
                nodeBinding: {
                    field_0: 'fullname',
                    field_1: 'dob',
                    img_0: 'avatar'
                },
            });
            family.load(data);
        }
    }, [isLoaded, data]);

    return (
        <>
            <Script 
                src="https://balkan.app/js/familytree.js" 
                strategy="afterInteractive"
                onLoad={() => setIsLoaded(true)} 
            />
            <div 
                ref={treeRef} 
                style={{ width: '100%', height: '600px', background: '#222' }} 
            />
        </>
    );
}