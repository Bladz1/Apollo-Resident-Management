'use client';

export default function SupportButton() {
  const scrollToSection = () => {
    const section = document.getElementById('support');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToSection}
      className="hover:text-yellow-200"
    >
      Hỗ trợ
    </button>
  );
}
