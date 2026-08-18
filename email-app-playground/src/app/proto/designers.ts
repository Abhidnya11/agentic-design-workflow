/**
 * One entry per designer folder under src/app/proto/. Add yours here when you
 * create your folder — this file is what makes it show up on /proto.
 */
export interface Designer {
  id: string;
  name: string;
  href: string;
}

export const DESIGNERS: Designer[] = [
  { id: 'abhidnya', name: 'Abhidnya', href: '/proto/abhidnya' },
  { id: 'sky', name: 'Sky', href: '/proto/sky' },
];
