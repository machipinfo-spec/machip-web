import React from "react";
import Link from "next/link";

type LegalPageProps = {
  title: string;
  established: string;
  children: React.ReactNode;
};

export const LegalPage: React.FC<LegalPageProps> = ({
  title,
  established,
  children,
}) => {
  return (
    <div className="min-h-screen bg-brand-pale">
      <header className="bg-gradient-to-r from-brand to-brand-mid px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-sm text-white/80 hover:text-white no-underline"
          >
            ← まちっぷに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            {title}
          </h1>
          <p className="text-sm text-white/80 mt-2">{established}</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm px-6 py-8 sm:px-10 flex flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  );
};

type SectionProps = {
  heading: string;
  children: React.ReactNode;
};

export const LegalSection: React.FC<SectionProps> = ({
  heading,
  children,
}) => {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 border-l-4 border-brand pl-3 mb-3">
        {heading}
      </h2>
      <div className="text-sm text-gray-700 leading-7 flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
};
