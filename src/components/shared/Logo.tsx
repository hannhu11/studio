import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-primary dark:text-primary-foreground">
      <BrainCircuit className="h-7 w-7 text-accent" />
      <span className="font-headline text-xl font-bold group-data-[collapsible=icon]:hidden">AI Quiz Master</span>
    </Link>
  );
}
