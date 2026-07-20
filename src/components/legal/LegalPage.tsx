import React from "react";
import Link from "next/link";

type TocItem = {
  id: string;
  label: string;
};

type LegalPageProps = {
  title: string;
  established: string;
  toc?: TocItem[];
  children: React.ReactNode;
};

export const LegalPage: React.FC<LegalPageProps> = ({
  title,
  established,
  toc,
  children,
}) => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-brand-pale select-text">
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
        {toc && toc.length > 0 && (
          <nav className="bg-white rounded-2xl shadow-sm px-6 py-5 sm:px-10 mb-6">
            <p className="text-sm font-bold text-gray-800 mb-2">目次</p>
            <ol className="list-decimal pl-5 flex flex-col gap-1">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-brand underline hover:text-brand-mid"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="bg-white rounded-2xl shadow-sm px-6 py-8 sm:px-10 flex flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  );
};

type SectionProps = {
  heading: string;
  id?: string;
  children: React.ReactNode;
};

export const LegalSection: React.FC<SectionProps> = ({
  heading,
  id,
  children,
}) => {
  return (
    <section id={id} className="scroll-mt-4">
      <h2 className="text-lg font-bold text-gray-800 border-l-4 border-brand pl-3 mb-3">
        {heading}
      </h2>
      <div className="text-[15px] text-gray-700 leading-[1.8] flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
};
